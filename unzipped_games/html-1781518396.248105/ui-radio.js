export class UIRadio {
    constructor(game) {
        this.game = game;
    }

    setupRadioPanel() {
        const radioToggle = document.getElementById('radio-toggle');
        const volumeSlider = document.getElementById('radio-volume');
        
        if (radioToggle) {
            const newRadioToggle = radioToggle.cloneNode(true);
            radioToggle.parentNode.replaceChild(newRadioToggle, radioToggle);
            
            newRadioToggle.addEventListener('change', () => {
                this.game.radioManager.toggleRadio();
            });
        }
        
        if (volumeSlider) {
            const newVolumeSlider = volumeSlider.cloneNode(true);
            volumeSlider.parentNode.replaceChild(newVolumeSlider, volumeSlider);
            
            newVolumeSlider.addEventListener('input', (e) => {
                this.game.radioManager.setVolume(e.target.value);
            });
        }
    }

    updateRadioUI() {
        const radioToggle = document.getElementById('radio-toggle');
        const volumeSlider = document.getElementById('radio-volume');
        const countryDisplay = document.getElementById('radio-country');
        const stationList = document.getElementById('radio-stations');
        const currentStationDisplay = document.getElementById('current-station');
        
        if (radioToggle) {
            radioToggle.checked = this.game.state.radioEnabled;
        }
        
        if (volumeSlider) {
            volumeSlider.value = this.game.state.radioVolume;
        }
        
        if (countryDisplay) {
            countryDisplay.textContent = this.game.radioManager.currentCountry;
        }
        
        if (currentStationDisplay) {
            const station = this.game.state.currentStation;
            if (station && this.game.state.radioEnabled) {
                currentStationDisplay.innerHTML = `📻 ${station.name} (${station.genre})`;
            } else {
                currentStationDisplay.innerHTML = '📻 Radio Off';
            }
        }
        
        if (stationList) {
            const stations = this.game.radioManager.getCurrentStations();
            let stationsHTML = '';
            stations.forEach(station => {
                const isActive = this.game.state.currentStation === station;
                stationsHTML += `
                    <div class="radio-station ${isActive ? 'active' : ''}" data-station="${station.name}">
                        <span class="station-name">${station.name}</span>
                        <span class="station-genre">${station.genre}</span>
                    </div>
                `;
            });
            stationList.innerHTML = stationsHTML;
            
            stationList.querySelectorAll('.radio-station').forEach(stationEl => {
                const newStationEl = stationEl.cloneNode(true);
                stationEl.parentNode.replaceChild(newStationEl, stationEl);
                
                newStationEl.addEventListener('click', () => {
                    const stationName = newStationEl.dataset.station;
                    const station = stations.find(s => s.name === stationName);
                    if (station && this.game.state.radioEnabled) {
                        this.game.radioManager.playStation(station);
                    }
                });
            });
        }
    }

    updateRadioCountry(country) {
        const countryDisplay = document.getElementById('radio-country');
        if (countryDisplay) {
            countryDisplay.textContent = country;
            setTimeout(() => {
                const notification = document.createElement('div');
                notification.className = 'radio-notification';
                notification.innerHTML = `📻 Now receiving ${country} radio stations`;
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 3000);
            }, 100);
        }
    }
}

