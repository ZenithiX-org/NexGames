export class TruckController {
    constructor(map, gameInstance, vehicleId) {
        this.map = map;
        this.gameInstance = gameInstance;
        this.vehicleId = vehicleId;

        // Adjust movement speed based on vehicle type
        this.movementSpeed = this.getVehicleSpeed(this.vehicleId);

        // Create vehicle marker with more robust positioning
        this.vehicleMarker = L.marker([40.7128, -74.0060], { // Default position
            icon: L.divIcon({
                className: 'vehicle-icon',
                html: this.getVehicleIconHTML(this.vehicleId),
                iconSize: [60, 60],
                iconAnchor: [30, 30]
            })
        });
        
        // Add marker to map after creating it
        if (this.map && this.vehicleMarker) {
            this.vehicleMarker.addTo(this.map);
        }

        this.isMoving = false;
        this.joystickData = null;
        this.animationFrameId = null;
        
        this.velocity = { x: 0, y: 0 };
        this.rotation = 0; // In radians
        this.currentSpeed = 0;
        this.maxSpeed = this.getVehicleSpeed(this.vehicleId);
        this.acceleration = 0.0002;
        this.friction = 0.96;
        this.turnSpeed = 0.05;
        
        // Gear System
        this.currentGear = 1;
        this.maxGears = 6;
        this.cruiseControlActive = false;
        this.targetCruiseSpeed = 0;

        // Apply any existing upgrades
        this.applyUpgrades(this.gameInstance.state.vehicleUpgrades);
        
        this.setupKeyControls(); 
        this.setupDestinationCheck();
        this.startPhysicsLoop();
    }

    // New centralized physics loop
    startPhysicsLoop() {
        if (this.physicsFrameId) cancelAnimationFrame(this.physicsFrameId);
        
        const loop = () => {
            this.updatePhysics();
            this.physicsFrameId = requestAnimationFrame(loop);
        };
        this.physicsFrameId = requestAnimationFrame(loop);
    }

    updatePhysics() {
        const isPlane = this.gameInstance.getVehicleCategory(this.vehicleId) === 'plane' || this.vehicleId === 'ufo';
        
        // 1. Handle Inputs
        if (this.gameInstance.ui.joystickEnabled && this.joystickData) {
            // Steering
            const targetAngle = -this.joystickData.angle.radian + Math.PI/2; 
            const angleDiff = targetAngle - this.rotation;
            const normalizedDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
            this.rotation += normalizedDiff * 0.1;
            
            // Throttle
            const force = Math.min(this.joystickData.force, 2);
            // On joystick, only vertical-ish input should kill cruise control (Up/Down)
            const isVerticalInput = Math.abs(Math.sin(this.joystickData.angle.radian)) > 0.5;
            if (force > 0.5 && isVerticalInput) {
                this.cruiseControlActive = false; 
            }
            
            if (!this.cruiseControlActive) {
                this.currentSpeed += this.acceleration * force;
            }
        } else if (!this.gameInstance.ui.joystickEnabled && this.keyIsDown) {
            if (this.activeKeys['ArrowUp']) {
                this.currentSpeed += this.acceleration;
                this.cruiseControlActive = false;
            }
            if (this.activeKeys['ArrowDown']) {
                this.currentSpeed -= this.acceleration * 1.5; // Stronger braking
                this.cruiseControlActive = false;
            }
            
            if (this.activeKeys['ArrowLeft']) this.rotation -= this.turnSpeed;
            if (this.activeKeys['ArrowRight']) this.rotation += this.turnSpeed;
        }

        // 2. Cruise Control Logic
        if (this.cruiseControlActive) {
            if (this.currentSpeed < this.targetCruiseSpeed) {
                this.currentSpeed += this.acceleration * 1.5; // Faster pickup
            } else {
                this.currentSpeed = this.targetCruiseSpeed;
            }
        }

        // 3. Apply Nitro
        let speedMultiplier = 1;
        if (this.gameInstance.nitroActive) {
            speedMultiplier = 2.5;
            this.currentSpeed += this.acceleration * 0.5;
        }

        // 4. Gear Shifting Logic
        const speedPercent = Math.abs(this.currentSpeed) / this.maxSpeed;
        const newGear = Math.min(this.maxGears, Math.floor(speedPercent * this.maxGears) + 1);
        if (newGear !== this.currentGear) {
            this.currentGear = newGear;
            // Shifting effect: small speed drop
            if (this.currentSpeed > 0) this.currentSpeed *= 0.98;
        }

        // 5. Speed Limits & Friction
        const limit = this.maxSpeed * speedMultiplier;
        if (this.currentSpeed > limit) this.currentSpeed = limit;
        if (this.currentSpeed < -limit/2) this.currentSpeed = -limit/2;
        
        if (!this.cruiseControlActive) {
            this.currentSpeed *= this.friction;
        }
        if (Math.abs(this.currentSpeed) < 0.00001) this.currentSpeed = 0;

        // 6. Update Position based on Heading
        const vx = Math.sin(this.rotation) * this.currentSpeed;
        const vy = Math.cos(this.rotation) * this.currentSpeed;
        
        if (vx !== 0 || vy !== 0) {
            this.move(vx, vy);
            this.isMoving = true;
        } else {
            this.isMoving = false;
        }

        // 7. Update Visuals
        if (this.vehicleMarker && this.vehicleMarker.getElement()) {
            const el = this.vehicleMarker.getElement().querySelector('img');
            if (el) {
                const deg = (this.rotation * 180 / Math.PI);
                el.style.transform = `rotate(${deg}deg)`;
            }
        }

        // Update Speedometer UI
        this.gameInstance.ui.updateSpeedometer(
            this.currentSpeed, 
            this.maxSpeed, 
            this.currentGear, 
            this.cruiseControlActive
        );
    }

    toggleCruiseControl() {
        this.cruiseControlActive = !this.cruiseControlActive;
        if (this.cruiseControlActive) {
            // If stopped or very slow, set a default cruise speed (City Cruise)
            if (this.currentSpeed < 0.0005) {
                this.targetCruiseSpeed = 0.001; // ~40kmh
            } else {
                this.targetCruiseSpeed = this.currentSpeed;
            }
            this.gameInstance.ui.notifications.showToast("Cruise Control Active", "info");
        } else {
            this.gameInstance.ui.notifications.showToast("Cruise Control Off", "info");
        }
    }

    destroy() {
        if (this.physicsFrameId) cancelAnimationFrame(this.physicsFrameId);
        document.removeEventListener('keydown', this.keydownHandler);
        document.removeEventListener('keyup', this.keyupHandler);
        if (this.checkDestinationInterval) {
            clearInterval(this.checkDestinationInterval);
        }
        if (this.vehicleMarker && this.map) {
            try {
                this.map.removeLayer(this.vehicleMarker);
            } catch (error) {
                console.warn("Error removing vehicle marker:", error);
            }
        }
        if (this.joystickManager) {
            this.joystickManager.destroy();
            this.joystickManager = null;
        }
    }

    getVehicleSpeed(vehicleId) {
        switch(vehicleId) {
            case 'truck': return 0.003; 
            case 'plane': return 0.06; 
            case 'advanced-truck': return 0.005;
            case 'monster-truck': return 0.0025;
            case 'cyber-truck': return 0.0075;
            case 'semi-truck': return 0.002;
            case 'hovercraft': return 0.006;
            case 'ufo': return 0.1;
            default: return 0.003;
        }
    }

    getVehicleIconHTML(vehicleId) {
        const vehicleImages = {
            'truck': 'truck.png',
            'plane': 'plane.png',
            'advanced-truck': 'advanced_truck.png',
            'monster-truck': 'monster_truck.png',
            'cyber-truck': 'cyber_truck.png',
            'semi-truck': 'semi_truck.png',
            'hovercraft': 'hovercraft.png',
            'ufo': 'ufo.png'
        };
        const imageSrc = vehicleImages[vehicleId] || 'truck.png';
        return `<img src="${imageSrc}" alt="${vehicleId}" style="transition: transform 0.1s linear;">`;
    }

    setupKeyControls() {
        this.activeKeys = {}; 
        this.keyIsDown = false;

        this.keydownHandler = (e) => {
            if (this.gameInstance.ui.joystickEnabled) return;
            const key = e.key; // Use original casing (e.g., "ArrowUp")
            
            if (key.toLowerCase() === 'c') {
                this.toggleCruiseControl();
            }

            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
                 e.preventDefault();
                 this.activeKeys[key] = true;
                 this.keyIsDown = true;
                 this.vehicleMarker.getElement()?.classList.add('moving');
            }
        };

        this.keyupHandler = (e) => {
             if (this.gameInstance.ui.joystickEnabled) return;
             const key = e.key;
             if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
                 delete this.activeKeys[key];
                 if (Object.keys(this.activeKeys).length === 0) {
                    this.keyIsDown = false;
                    this.vehicleMarker.getElement()?.classList.remove('moving');
                 }
             }
        };

        document.addEventListener('keydown', this.keydownHandler);
        document.addEventListener('keyup', this.keyupHandler);
    }

    enableJoystick() {
        const joystickContainer = document.getElementById('joystick-container');
        if (!joystickContainer || this.joystickManager) return;
        
        joystickContainer.style.display = 'block';
        const options = {
            zone: joystickContainer,
            mode: 'dynamic',
            color: 'rgba(0, 210, 255, 0.7)', // Slightly more visible
            size: 140,
            threshold: 0.1,
            restOpacity: 0.5
        };

        this.joystickManager = nipplejs.create(options);
        this.joystickManager.on('move', (evt, data) => this.joystickData = data);
        this.joystickManager.on('end', () => this.joystickData = null);
        this.keyIsDown = false;
    }

    disableJoystick() {
        if (this.joystickManager) {
            this.joystickManager.destroy();
            this.joystickManager = null;
        }
        const joystickContainer = document.getElementById('joystick-container');
        if (joystickContainer) joystickContainer.style.display = 'none';
        this.joystickData = null;
    }

    setupDestinationCheck() {
        if (this.checkDestinationInterval) clearInterval(this.checkDestinationInterval);
        this.checkDestinationInterval = setInterval(() => {
            if (this.gameInstance.currentMission) {
                const currentPos = this.vehicleMarker.getLatLng();
                const destCoords = this.gameInstance.currentMission.destinationCoords;
                if (this.isCloseToDestination(currentPos.lat, currentPos.lng, destCoords[0], destCoords[1])) {
                    this.gameInstance.completeMission();
                }
            }
        }, 500); 
    }

    isCloseToDestination(lat1, lon1, lat2, lon2) {
        const threshold = this.gameInstance.getVehicleCategory(this.vehicleId) === 'plane' ? 0.5 : 0.1;
        return (Math.abs(lat1 - lat2) < threshold && Math.abs(lon1 - lon2) < threshold);
    }

    move(lng, lat) {
        if (!this.map || !this.vehicleMarker) return;
        const prevPos = this.vehicleMarker.getLatLng();
        const newPos = { lat: prevPos.lat + lat, lng: prevPos.lng + lng };

        this.vehicleMarker.setLatLng(newPos);
        if (this.gameInstance.radioManager) this.gameInstance.radioManager.updateLocation([newPos.lat, newPos.lng]);
        
        try {
            this.map.setView(newPos, this.map.getZoom(), { animate: false });
        } catch (e) {
            console.warn("Map view error:", e);
        }
    }

    setPosition(coords) {
        if (!this.map || !this.vehicleMarker) return;
        const newPos = L.latLng(coords[0], coords[1]);
        this.vehicleMarker.setLatLng(newPos);
        
        try {
            this.map.setView(newPos, this.map.getZoom(), { animate: false });
        } catch(e) {
            console.warn("Could not set map view:", e);
        }

        if (this.gameInstance.radioManager) {
            this.gameInstance.radioManager.updateLocation(coords);
        }
    }

    applyUpgrades(upgrades) {
        const speedMultiplier = 1 + ((upgrades.speed || 0) * 0.1);
        this.maxSpeed = this.getVehicleSpeed(this.vehicleId) * speedMultiplier;
    }
}