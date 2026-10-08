import { VEHICLE_CATALOG } from 'data:application/javascript;base64,ZXhwb3J0IGNvbnN0IFZFSElDTEVfQ0FUQUxPRyA9IHsKICAgICd0cnVjayc6IHsgbmFtZTogJ0Jhc2ljIFRydWNrJywgcHJpY2U6IDAsIGNhdGVnb3J5OiAndHJ1Y2snLCBpY29uOiAndHJ1Y2sucG5nJywgc3RhdHM6ICdTcGVlZDogTWVkaXVtJyB9LAogICAgJ3BsYW5lJzogeyBuYW1lOiAnU21hbGwgUGxhbmUnLCBwcmljZTogMjUwMCwgY2F0ZWdvcnk6ICdwbGFuZScsIGljb246ICdwbGFuZS5wbmcnLCBzdGF0czogJ1NwZWVkOiBMdWRpY3JvdXMnIH0sCiAgICAnYWR2YW5jZWQtdHJ1Y2snOiB7IG5hbWU6ICdBZHZhbmNlZCBUcnVjaycsIHByaWNlOiA1MDAwLCBjYXRlZ29yeTogJ3RydWNrJywgaWNvbjogJ2FkdmFuY2VkX3RydWNrLnBuZycsIHN0YXRzOiAnU3BlZWQ6IEZhc3QnIH0sCiAgICAnbW9uc3Rlci10cnVjayc6IHsgbmFtZTogJ01vbnN0ZXIgVHJ1Y2snLCBwcmljZTogNzUwMCwgY2F0ZWdvcnk6ICd0cnVjaycsIGljb246ICdtb25zdGVyX3RydWNrLnBuZycsIHN0YXRzOiAnU3BlZWQ6IFNsb3cnIH0sCiAgICAnY3liZXItdHJ1Y2snOiB7IG5hbWU6ICdDeWJlciBUcnVjaycsIHByaWNlOiAxNTAwMCwgY2F0ZWdvcnk6ICd0cnVjaycsIGljb246ICdjeWJlcl90cnVjay5wbmcnLCBzdGF0czogJ1NwZWVkOiBWZXJ5IEZhc3QnIH0sCiAgICAnc2VtaS10cnVjayc6IHsgbmFtZTogJ1NlbWktVHJ1Y2snLCBwcmljZTogMTAwMDAsIGNhdGVnb3J5OiAndHJ1Y2snLCBpY29uOiAnc2VtaV90cnVjay5wbmcnLCBzdGF0czogJ1NwZWVkOiBTbG93JyB9LAogICAgJ2hvdmVyY3JhZnQnOiB7IG5hbWU6ICdIb3ZlcmNyYWZ0JywgcHJpY2U6IDI1MDAwLCBjYXRlZ29yeTogJ3RydWNrJywgaWNvbjogJ2hvdmVyY3JhZnQucG5nJywgc3RhdHM6ICdTcGVlZDogRmFzdCwgQWxsIHRlcnJhaW4nIH0sCiAgICAndWZvJzogeyBuYW1lOiAnVUZPJywgcHJpY2U6IDc1MDAwLCBjYXRlZ29yeTogJ3BsYW5lJywgaWNvbjogJ3Vmby5wbmcnLCBzdGF0czogJ1NwZWVkOiBJbnNhbmUnIH0KfTsKCmV4cG9ydCBjb25zdCBDT01QQU5ZX0ZPVU5ESU5HX0NPU1QgPSA1MDAwMDsKZXhwb3J0IGNvbnN0IFNBVkVfS0VZID0gJ2dsb2JhbFRydWNrZXJTYXZlRGF0YSc7CgpleHBvcnQgY29uc3QgV09SS1NIT1BfVVBHUkFERV9DT1NUUyA9IHsKICAgIHNwZWVkOiAyMDAwCn07CgpleHBvcnQgY29uc3QgUkFESU9fU1RBVElPTlMgPSB7CiAgICAnVVNBJzogWwogICAgICAgIHsgbmFtZTogJ0NsYXNzaWMgUm9jayAxMDEnLCBnZW5yZTogJ1JvY2snLCB1cmw6ICdodHRwczovL3N0cmVhbXMuaWxvdmVtdXNpYy5kZS9pbG92ZXJhZGlvMi5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnQ291bnRyeSBSb2FkcyBGTScsIGdlbnJlOiAnQ291bnRyeScsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8xNy5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnSmF6eiBDYWbDqScsIGdlbnJlOiAnSmF6eicsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW82Lm1wMycgfQogICAgXSwKICAgICdVSyc6IFsKICAgICAgICB7IG5hbWU6ICdCQkMgUm9jaycsIGdlbnJlOiAnUm9jaycsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8yLm1wMycgfSwKICAgICAgICB7IG5hbWU6ICdMb25kb24gQmVhdHMnLCBnZW5yZTogJ0VsZWN0cm9uaWMnLCB1cmw6ICdodHRwczovL3N0cmVhbXMuaWxvdmVtdXNpYy5kZS9pbG92ZXJhZGlvMy5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnQ2xhc3NpY2FsIEJyaXRhaW4nLCBnZW5yZTogJ0NsYXNzaWNhbCcsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW83Lm1wMycgfQogICAgXSwKICAgICdGcmFuY2UnOiBbCiAgICAgICAgeyBuYW1lOiAnUmFkaW8gUGFyaXMnLCBnZW5yZTogJ1BvcCcsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8xLm1wMycgfSwKICAgICAgICB7IG5hbWU6ICdKYXp6IGRlIEZyYW5jZScsIGdlbnJlOiAnSmF6eicsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW82Lm1wMycgfSwKICAgICAgICB7IG5hbWU6ICfDiWxlY3Ryb25pcXVlIEZNJywgZ2VucmU6ICdFbGVjdHJvbmljJywgdXJsOiAnaHR0cHM6Ly9zdHJlYW1zLmlsb3ZlbXVzaWMuZGUvaWxvdmVyYWRpbzMubXAzJyB9CiAgICBdLAogICAgJ0dlcm1hbnknOiBbCiAgICAgICAgeyBuYW1lOiAnRGV1dHNjaGUgV2VsbGUnLCBnZW5yZTogJ1BvcCcsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8xLm1wMycgfSwKICAgICAgICB7IG5hbWU6ICdCZXJsaW4gQmVhdCcsIGdlbnJlOiAnRWxlY3Ryb25pYycsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8zLm1wMycgfSwKICAgICAgICB7IG5hbWU6ICdDbGFzc2ljYWwgR2VybWFuaWEnLCBnZW5yZTogJ0NsYXNzaWNhbCcsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW83Lm1wMycgfQogICAgXSwKICAgICdKYXBhbic6IFsKICAgICAgICB7IG5hbWU6ICdUb2t5byBGTScsIGdlbnJlOiAnSi1Qb3AnLCB1cmw6ICdodHRwczovL3N0cmVhbXMuaWxvdmVtdXNpYy5kZS9pbG92ZXJhZGlvMS5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnQW5pbWUgUmFkaW8nLCBnZW5yZTogJ1NvdW5kdHJhY2snLCB1cmw6ICdodHRwczovL3N0cmVhbXMuaWxvdmVtdXNpYy5kZS9pbG92ZXJhZGlvOC5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnSmF6eiBUb2t5bycsIGdlbnJlOiAnSmF6eicsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW82Lm1wMycgfQogICAgXSwKICAgICdBdXN0cmFsaWEnOiBbCiAgICAgICAgeyBuYW1lOiAnQXVzc2llIFJvY2snLCBnZW5yZTogJ1JvY2snLCB1cmw6ICdodHRwczovL3N0cmVhbXMuaWxvdmVtdXNpYy5kZS9pbG92ZXJhZGlvMi5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnU3lkbmV5IFNvdW5kcycsIGdlbnJlOiAnUG9wJywgdXJsOiAnaHR0cHM6Ly9zdHJlYW1zLmlsb3ZlbXVzaWMuZGUvaWxvdmVyYWRpbzEubXAzJyB9LAogICAgICAgIHsgbmFtZTogJ091dGJhY2sgQ291bnRyeScsIGdlbnJlOiAnQ291bnRyeScsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8xNy5tcDMnIH0KICAgIF0sCiAgICAnQnJhemlsJzogWwogICAgICAgIHsgbmFtZTogJ1JhZGlvIEJyYXNpbCcsIGdlbnJlOiAnU2FtYmEnLCB1cmw6ICdodHRwczovL3N0cmVhbXMuaWxvdmVtdXNpYy5kZS9pbG92ZXJhZGlvMS5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnQm9zc2EgTm92YSBGTScsIGdlbnJlOiAnQm9zc2EgTm92YScsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW82Lm1wMycgfSwKICAgICAgICB7IG5hbWU6ICdSaW8gQmVhdCcsIGdlbnJlOiAnRWxlY3Ryb25pYycsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8zLm1wMycgfQogICAgXQp9Ow==';

export class UICore {
    constructor(game) {
        this.game = game;
        this.joystickEnabled = this.isMobile();
        this.panelOpen = false;
        this.shopOpen = false;
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || ('ontouchstart' in window);
    }

    // --- Main Update Function ---
    updateAllUI() {
        const state = this.game.state;
        this.updateMoneyUI(state.money);
        this.updateCompanyStatusUI(state.companyStarted, state.money);
        this.updateLevelUI(state.level, state.xp, state.xpForNextLevel);
        this.setupVehicleShop(state.ownedVehicles, state.selectedVehicle, state.money);
        if (this.game.currentMission) {
            this.updateMissionUI(this.game.currentMission);
        }
        this.updateLeaderboard();
    }

    // --- UI Update Methods ---
    updateMissionUI(mission) {
        const destinationDetails = document.getElementById('destination-details');
        if (destinationDetails) {
            destinationDetails.textContent = `${mission.start} → ${mission.destination}`;
        }
        
        const cargoDetails = document.getElementById('cargo-details');
        if (cargoDetails && mission.cargo) {
            const cargo = mission.cargo;
            const smugglerTag = cargo.isSmuggler ? ' ⚠️' : '';
            cargoDetails.innerHTML = `${cargo.icon} ${cargo.name}${smugglerTag} — <span style="color: var(--success)">$${cargo.value.toLocaleString()}</span>`;
        }

        const distanceElement = document.getElementById('distance-remaining');
        if(distanceElement && mission.startCoords && mission.destinationCoords) {
             const distance = this.game.calculateDistance(
                mission.startCoords,
                mission.destinationCoords
            );
            distanceElement.textContent = `📍 ${distance.toFixed(1)} mi`;
        }
    }

    updateMoneyUI(money) {
        const moneyElement = document.getElementById('money-display');
        if (moneyElement) {
            moneyElement.textContent = `$${money.toLocaleString()}`;
        }
        this.updateCompanyStatusUI(this.game.state.companyStarted, money);
    }

    updateCompanyStatusUI(companyStarted, money) {
        const statusContainer = document.getElementById('company-status');
        if (!statusContainer) return;

        if (companyStarted) {
            statusContainer.innerHTML = `<p class="company-founded">🏢 Company Founded!</p>`;
        } else if (money >= 50000) { 
            statusContainer.innerHTML = `<button id="start-company-btn">Start Company ($50,000)</button>`;
            const startCompanyBtn = document.getElementById('start-company-btn');
            if(startCompanyBtn) {
                 startCompanyBtn.addEventListener('click', () => {
                     this.game.startCompany();
                 }, { once: true });
            }
        } else {
            statusContainer.innerHTML = `<p class="company-goal">Save $50,000 to start a company.</p>`;
        }
    }
    
    updateLevelUI(level, xp, xpForNextLevel) {
        const levelEl = document.getElementById('level-number');
        const xpBarEl = document.getElementById('xp-bar');

        if(levelEl) levelEl.textContent = level;
        if(xpBarEl) {
            const xpPercentage = Math.min((xp / xpForNextLevel) * 100, 100);
            xpBarEl.style.width = `${xpPercentage}%`;
        }
    }

    updateSpeedometer(speed, maxSpeed, gear, cruise) {
        const speedValEl = document.getElementById('current-speed-val');
        const gearValEl = document.getElementById('current-gear-val');
        const cruiseEl = document.getElementById('cruise-control-indicator');
        const needleEl = document.getElementById('rpm-needle');

        if (speedValEl) {
            // Speed in engine units to KM/H conversion (arbitrary multiplier for "realistic" feel)
            const kmh = Math.round(Math.abs(speed) * 40000);
            speedValEl.textContent = kmh;
        }

        if (gearValEl) gearValEl.textContent = gear;
        
        if (cruiseEl) {
            cruiseEl.classList.toggle('hidden', !cruise);
        }

        if (needleEl) {
            // RPM simulation based on speed within current gear
            const gearRange = maxSpeed / 6;
            const speedInGear = (Math.abs(speed) % gearRange) / gearRange;
            const rpmRotation = -90 + (speedInGear * 180); // -90 to 90 degrees
            needleEl.style.transform = `translateX(-50%) rotate(${rpmRotation}deg)`;
        }
    }

    setupVehicleShop(ownedVehicles, selectedVehicle, money) {
        const vehicleShopContainer = document.getElementById('vehicle-shop');
        if (!vehicleShopContainer) return;

        let shopContent = `
            <div class="drawer-header">
                <h3>Vehicle Hangar</h3>
                <button class="drawer-close" id="close-shop-btn">&times;</button>
            </div>
        `;

        for (const id in VEHICLE_CATALOG) {
            const vehicle = VEHICLE_CATALOG[id];
            const isOwned = ownedVehicles.includes(id);
            const canAfford = money >= vehicle.price;

            let priceOrStatusText;
            let priceOrStatusClass = 'vehicle-price';
            if (isOwned) {
                if (id === selectedVehicle) {
                    priceOrStatusText = '✓ Active';
                } else {
                    priceOrStatusText = 'Select';
                    priceOrStatusClass += ' action-select';
                }
            } else {
                priceOrStatusText = `$${vehicle.price.toLocaleString()}`;
            }
            
            let classes = "shop-vehicle-option";
            if (!isOwned && !canAfford) {
                classes += " locked";
            }
            if (isOwned && id === selectedVehicle) {
                classes += " selected";
            }

            shopContent += `
                <div class="${classes}" data-id="${id}" data-price="${vehicle.price}">
                    <div class="vehicle-details">
                        <img src="${vehicle.icon}" alt="${vehicle.name}">
                        <div class="vehicle-info">
                            <span class="vehicle-name">${vehicle.name}</span>
                            <span class="vehicle-stats">${vehicle.stats}</span>
                        </div>
                    </div>
                    <span class="${priceOrStatusClass}">${priceOrStatusText}</span>
                </div>
            `;
        }
        
        vehicleShopContainer.innerHTML = shopContent;
        this.setupShopEventListeners();
    }

    setupShopEventListeners() {
        const vehicleShopContainer = document.getElementById('vehicle-shop');
        if (!vehicleShopContainer) return;

        // Close button inside drawer
        const closeBtn = vehicleShopContainer.querySelector('#close-shop-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                vehicleShopContainer.classList.add('drawer-hidden');
                this.shopOpen = false;
            });
        }

        vehicleShopContainer.querySelectorAll('.shop-vehicle-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const targetOption = e.currentTarget;
                if (targetOption.classList.contains('locked')) return;
                const vehicleId = targetOption.dataset.id;
                this.game.handleVehicleSelection(vehicleId);
            });
        });

         const startCompanyBtn = document.getElementById('start-company-btn');
        if (startCompanyBtn) {
            startCompanyBtn.addEventListener('click', () => {
                this.game.startCompany();
            }, { once: true });
        }
    }

    updateLeaderboard() {
        const lbList = document.getElementById('leaderboard-list');
        if (!lbList) return;

        // Create player entry
        const player = { name: "YOU", money: this.game.state.money, rank: 1 };
        
        // Sample data for other NPCs (we can get from NPCManager if we track their "wealth")
        // For "fake" multiplayer, let's just generate some randomized entries and sort them
        const entries = [player];
        
        if (this.game.npcs && this.game.npcs.npcs) {
            this.game.npcs.npcs.slice(0, 4).forEach(npc => {
                // Deterministic pseudo-random money based on name
                let fakeMoney = 0;
                for (let i = 0; i < npc.name.length; i++) fakeMoney += npc.name.charCodeAt(i) * 1000;
                entries.push({ name: npc.name, money: fakeMoney });
            });
        }

        // Sort by money
        entries.sort((a, b) => b.money - a.money);

        lbList.innerHTML = entries.slice(0, 3).map((e, index) => `
            <div class="leaderboard-item">
                <span class="lb-rank">#${index + 1}</span>
                <span class="lb-name">${e.name}</span>
                <span class="lb-money">$${e.money.toLocaleString()}</span>
            </div>
        `).join('');
    }

    // --- Drawer Toggle Setup ---
    setupDrawerToggles() {
        const panelBtn = document.getElementById('toggle-panel-btn');
        const shopBtn = document.getElementById('toggle-shop-btn');
        const panel = document.getElementById('ui-panel');
        const shop = document.getElementById('vehicle-shop');
        const closePanel = document.getElementById('close-panel-btn');

        if (panelBtn && panel) {
            panelBtn.addEventListener('click', () => {
                this.panelOpen = !this.panelOpen;
                panel.classList.toggle('drawer-hidden', !this.panelOpen);
                // Close shop if opening panel
                if (this.panelOpen && this.shopOpen) {
                    shop.classList.add('drawer-hidden');
                    this.shopOpen = false;
                }
            });
        }

        if (closePanel && panel) {
            closePanel.addEventListener('click', () => {
                panel.classList.add('drawer-hidden');
                this.panelOpen = false;
            });
        }

        if (shopBtn && shop) {
            shopBtn.addEventListener('click', () => {
                this.shopOpen = !this.shopOpen;
                shop.classList.toggle('drawer-hidden', !this.shopOpen);
                // Close panel if opening shop
                if (this.shopOpen && this.panelOpen) {
                    panel.classList.add('drawer-hidden');
                    this.panelOpen = false;
                }
            });
        }
    }
}