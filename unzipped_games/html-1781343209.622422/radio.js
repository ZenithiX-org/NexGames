import { RADIO_STATIONS } from 'data:application/javascript;base64,ZXhwb3J0IGNvbnN0IFZFSElDTEVfQ0FUQUxPRyA9IHsKICAgICd0cnVjayc6IHsgbmFtZTogJ0Jhc2ljIFRydWNrJywgcHJpY2U6IDAsIGNhdGVnb3J5OiAndHJ1Y2snLCBpY29uOiAndHJ1Y2sucG5nJywgc3RhdHM6ICdTcGVlZDogTWVkaXVtJyB9LAogICAgJ3BsYW5lJzogeyBuYW1lOiAnU21hbGwgUGxhbmUnLCBwcmljZTogMjUwMCwgY2F0ZWdvcnk6ICdwbGFuZScsIGljb246ICdwbGFuZS5wbmcnLCBzdGF0czogJ1NwZWVkOiBMdWRpY3JvdXMnIH0sCiAgICAnYWR2YW5jZWQtdHJ1Y2snOiB7IG5hbWU6ICdBZHZhbmNlZCBUcnVjaycsIHByaWNlOiA1MDAwLCBjYXRlZ29yeTogJ3RydWNrJywgaWNvbjogJ2FkdmFuY2VkX3RydWNrLnBuZycsIHN0YXRzOiAnU3BlZWQ6IEZhc3QnIH0sCiAgICAnbW9uc3Rlci10cnVjayc6IHsgbmFtZTogJ01vbnN0ZXIgVHJ1Y2snLCBwcmljZTogNzUwMCwgY2F0ZWdvcnk6ICd0cnVjaycsIGljb246ICdtb25zdGVyX3RydWNrLnBuZycsIHN0YXRzOiAnU3BlZWQ6IFNsb3cnIH0sCiAgICAnY3liZXItdHJ1Y2snOiB7IG5hbWU6ICdDeWJlciBUcnVjaycsIHByaWNlOiAxNTAwMCwgY2F0ZWdvcnk6ICd0cnVjaycsIGljb246ICdjeWJlcl90cnVjay5wbmcnLCBzdGF0czogJ1NwZWVkOiBWZXJ5IEZhc3QnIH0sCiAgICAnc2VtaS10cnVjayc6IHsgbmFtZTogJ1NlbWktVHJ1Y2snLCBwcmljZTogMTAwMDAsIGNhdGVnb3J5OiAndHJ1Y2snLCBpY29uOiAnc2VtaV90cnVjay5wbmcnLCBzdGF0czogJ1NwZWVkOiBTbG93JyB9LAogICAgJ2hvdmVyY3JhZnQnOiB7IG5hbWU6ICdIb3ZlcmNyYWZ0JywgcHJpY2U6IDI1MDAwLCBjYXRlZ29yeTogJ3RydWNrJywgaWNvbjogJ2hvdmVyY3JhZnQucG5nJywgc3RhdHM6ICdTcGVlZDogRmFzdCwgQWxsIHRlcnJhaW4nIH0sCiAgICAndWZvJzogeyBuYW1lOiAnVUZPJywgcHJpY2U6IDc1MDAwLCBjYXRlZ29yeTogJ3BsYW5lJywgaWNvbjogJ3Vmby5wbmcnLCBzdGF0czogJ1NwZWVkOiBJbnNhbmUnIH0KfTsKCmV4cG9ydCBjb25zdCBDT01QQU5ZX0ZPVU5ESU5HX0NPU1QgPSA1MDAwMDsKZXhwb3J0IGNvbnN0IFNBVkVfS0VZID0gJ2dsb2JhbFRydWNrZXJTYXZlRGF0YSc7CgpleHBvcnQgY29uc3QgV09SS1NIT1BfVVBHUkFERV9DT1NUUyA9IHsKICAgIHNwZWVkOiAyMDAwCn07CgpleHBvcnQgY29uc3QgUkFESU9fU1RBVElPTlMgPSB7CiAgICAnVVNBJzogWwogICAgICAgIHsgbmFtZTogJ0NsYXNzaWMgUm9jayAxMDEnLCBnZW5yZTogJ1JvY2snLCB1cmw6ICdodHRwczovL3N0cmVhbXMuaWxvdmVtdXNpYy5kZS9pbG92ZXJhZGlvMi5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnQ291bnRyeSBSb2FkcyBGTScsIGdlbnJlOiAnQ291bnRyeScsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8xNy5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnSmF6eiBDYWbDqScsIGdlbnJlOiAnSmF6eicsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW82Lm1wMycgfQogICAgXSwKICAgICdVSyc6IFsKICAgICAgICB7IG5hbWU6ICdCQkMgUm9jaycsIGdlbnJlOiAnUm9jaycsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8yLm1wMycgfSwKICAgICAgICB7IG5hbWU6ICdMb25kb24gQmVhdHMnLCBnZW5yZTogJ0VsZWN0cm9uaWMnLCB1cmw6ICdodHRwczovL3N0cmVhbXMuaWxvdmVtdXNpYy5kZS9pbG92ZXJhZGlvMy5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnQ2xhc3NpY2FsIEJyaXRhaW4nLCBnZW5yZTogJ0NsYXNzaWNhbCcsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW83Lm1wMycgfQogICAgXSwKICAgICdGcmFuY2UnOiBbCiAgICAgICAgeyBuYW1lOiAnUmFkaW8gUGFyaXMnLCBnZW5yZTogJ1BvcCcsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8xLm1wMycgfSwKICAgICAgICB7IG5hbWU6ICdKYXp6IGRlIEZyYW5jZScsIGdlbnJlOiAnSmF6eicsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW82Lm1wMycgfSwKICAgICAgICB7IG5hbWU6ICfDiWxlY3Ryb25pcXVlIEZNJywgZ2VucmU6ICdFbGVjdHJvbmljJywgdXJsOiAnaHR0cHM6Ly9zdHJlYW1zLmlsb3ZlbXVzaWMuZGUvaWxvdmVyYWRpbzMubXAzJyB9CiAgICBdLAogICAgJ0dlcm1hbnknOiBbCiAgICAgICAgeyBuYW1lOiAnRGV1dHNjaGUgV2VsbGUnLCBnZW5yZTogJ1BvcCcsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8xLm1wMycgfSwKICAgICAgICB7IG5hbWU6ICdCZXJsaW4gQmVhdCcsIGdlbnJlOiAnRWxlY3Ryb25pYycsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8zLm1wMycgfSwKICAgICAgICB7IG5hbWU6ICdDbGFzc2ljYWwgR2VybWFuaWEnLCBnZW5yZTogJ0NsYXNzaWNhbCcsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW83Lm1wMycgfQogICAgXSwKICAgICdKYXBhbic6IFsKICAgICAgICB7IG5hbWU6ICdUb2t5byBGTScsIGdlbnJlOiAnSi1Qb3AnLCB1cmw6ICdodHRwczovL3N0cmVhbXMuaWxvdmVtdXNpYy5kZS9pbG92ZXJhZGlvMS5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnQW5pbWUgUmFkaW8nLCBnZW5yZTogJ1NvdW5kdHJhY2snLCB1cmw6ICdodHRwczovL3N0cmVhbXMuaWxvdmVtdXNpYy5kZS9pbG92ZXJhZGlvOC5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnSmF6eiBUb2t5bycsIGdlbnJlOiAnSmF6eicsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW82Lm1wMycgfQogICAgXSwKICAgICdBdXN0cmFsaWEnOiBbCiAgICAgICAgeyBuYW1lOiAnQXVzc2llIFJvY2snLCBnZW5yZTogJ1JvY2snLCB1cmw6ICdodHRwczovL3N0cmVhbXMuaWxvdmVtdXNpYy5kZS9pbG92ZXJhZGlvMi5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnU3lkbmV5IFNvdW5kcycsIGdlbnJlOiAnUG9wJywgdXJsOiAnaHR0cHM6Ly9zdHJlYW1zLmlsb3ZlbXVzaWMuZGUvaWxvdmVyYWRpbzEubXAzJyB9LAogICAgICAgIHsgbmFtZTogJ091dGJhY2sgQ291bnRyeScsIGdlbnJlOiAnQ291bnRyeScsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8xNy5tcDMnIH0KICAgIF0sCiAgICAnQnJhemlsJzogWwogICAgICAgIHsgbmFtZTogJ1JhZGlvIEJyYXNpbCcsIGdlbnJlOiAnU2FtYmEnLCB1cmw6ICdodHRwczovL3N0cmVhbXMuaWxvdmVtdXNpYy5kZS9pbG92ZXJhZGlvMS5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnQm9zc2EgTm92YSBGTScsIGdlbnJlOiAnQm9zc2EgTm92YScsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW82Lm1wMycgfSwKICAgICAgICB7IG5hbWU6ICdSaW8gQmVhdCcsIGdlbnJlOiAnRWxlY3Ryb25pYycsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8zLm1wMycgfQogICAgXQp9Ow==';

export class RadioManager {
    constructor(game) {
        this.game = game;
        this.audioElement = null;
        this.currentCountry = 'USA';
        this.isPlaying = false;
        
        this.initAudioElement();
    }

    initAudioElement() {
        this.audioElement = new Audio();
        this.audioElement.volume = this.game.state.radioVolume;
        this.audioElement.addEventListener('error', () => {
            console.warn('Radio stream error, trying next station');
            this.handleStreamError();
        });
    }

    updateLocation(coordinates) {
        const newCountry = this.getCountryFromCoordinates(coordinates);
        if (newCountry !== this.currentCountry) {
            this.currentCountry = newCountry;
            this.game.ui.updateRadioCountry(newCountry);
            
            // If radio is on and we switched countries, switch to first station of new country
            if (this.game.state.radioEnabled && this.isPlaying) {
                const stations = RADIO_STATIONS[this.currentCountry];
                if (stations && stations.length > 0) {
                    this.playStation(stations[0]);
                }
            }
        }
    }

    getCountryFromCoordinates([lat, lng]) {
        // USA bounds
        if (lat >= 24.396 && lat <= 49.384 && lng >= -125.0 && lng <= -66.93) {
            return 'USA';
        }
        // UK bounds
        if (lat >= 49.9 && lat <= 60.85 && lng >= -8.15 && lng <= 1.78) {
            return 'UK';
        }
        // France bounds
        if (lat >= 41.3 && lat <= 51.1 && lng >= -5.1 && lng <= 9.6) {
            return 'France';
        }
        // Germany bounds
        if (lat >= 47.3 && lat <= 55.1 && lng >= 5.9 && lng <= 15.0) {
            return 'Germany';
        }
        // Japan bounds
        if (lat >= 24.0 && lat <= 46.0 && lng >= 122.0 && lng <= 146.0) {
            return 'Japan';
        }
        // Australia bounds
        if (lat >= -44.0 && lat <= -10.0 && lng >= 113.0 && lng <= 154.0) {
            return 'Australia';
        }
        // Brazil bounds
        if (lat >= -34.0 && lat <= 5.3 && lng >= -74.0 && lng <= -28.8) {
            return 'Brazil';
        }
        
        // Default to USA if coordinates don't match any country
        return 'USA';
    }

    toggleRadio() {
        this.game.state.radioEnabled = !this.game.state.radioEnabled;
        
        if (this.game.state.radioEnabled) {
            // Start playing first available station
            const stations = RADIO_STATIONS[this.currentCountry];
            if (stations && stations.length > 0) {
                this.playStation(stations[0]);
            }
        } else {
            this.stopRadio();
        }
        
        this.game.ui.updateRadioUI();
        this.game.state.save();
    }

    playStation(station) {
        if (!station) return;
        
        this.stopRadio();
        this.game.state.currentStation = station;
        this.audioElement.src = station.url;
        this.audioElement.volume = this.game.state.radioVolume;
        
        this.audioElement.play().then(() => {
            this.isPlaying = true;
            this.game.ui.updateRadioUI();
        }).catch(error => {
            console.warn('Failed to play radio station:', error);
            this.handleStreamError();
        });
    }

    stopRadio() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
        }
        this.isPlaying = false;
        this.game.state.currentStation = null;
    }

    setVolume(volume) {
        this.game.state.radioVolume = Math.max(0, Math.min(1, volume));
        if (this.audioElement) {
            this.audioElement.volume = this.game.state.radioVolume;
        }
        this.game.state.save();
    }

    handleStreamError() {
        // Try next station in the country if current one fails
        const stations = RADIO_STATIONS[this.currentCountry];
        if (stations) {
            const currentIndex = stations.findIndex(s => s === this.game.state.currentStation);
            const nextIndex = (currentIndex + 1) % stations.length;
            if (nextIndex !== currentIndex) {
                setTimeout(() => this.playStation(stations[nextIndex]), 1000);
            }
        }
    }

    getCurrentStations() {
        return RADIO_STATIONS[this.currentCountry] || [];
    }

    destroy() {
        this.stopRadio();
        if (this.audioElement) {
            this.audioElement.removeEventListener('error', this.handleStreamError);
            this.audioElement = null;
        }
    }
}