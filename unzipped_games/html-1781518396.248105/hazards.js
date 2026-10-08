/**
 * hazards.js
 * Controls dynamic hazards like Police Chasers
 */
export class PoliceChaser {
    constructor(gameInstance, spawnCoords) {
        this.game = gameInstance;
        this.map = gameInstance.map;
        this.speed = 0.0025; // Base speed per tick (slightly faster than basic truck)
        
        // Create Marker
        const policeIcon = L.divIcon({
            className: 'police-icon',
            html: `
                <div style="font-size: 24px; filter: drop-shadow(0 0 5px red); animation: blink 0.5s infinite;">
                    🚓
                </div>
            `,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        this.marker = L.marker(spawnCoords, { icon: policeIcon }).addTo(this.map);
        this.isActive = true;

        this.chaseInterval = setInterval(() => this.chase(), 100);
    }

    chase() {
        if (!this.isActive || !this.game.truck || !this.game.truck.vehicleMarker) return;

        const playerPos = this.game.truck.vehicleMarker.getLatLng();
        const myPos = this.marker.getLatLng();

        const latDiff = playerPos.lat - myPos.lat;
        const lngDiff = playerPos.lng - myPos.lng;
        
        // Simple normalization
        const dist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
        
        if (dist < 0.01) { // Reduced catch radius for fairer gameplay
            // Collision!
            this.game.busted();
            this.destroy();
            return;
        }

        const moveLat = (latDiff / dist) * this.speed;
        const moveLng = (lngDiff / dist) * this.speed;

        this.marker.setLatLng({
            lat: myPos.lat + moveLat,
            lng: myPos.lng + moveLng
        });
    }

    destroy() {
        this.isActive = false;
        clearInterval(this.chaseInterval);
        if (this.map && this.marker) {
            this.map.removeLayer(this.marker);
        }
    }
}
