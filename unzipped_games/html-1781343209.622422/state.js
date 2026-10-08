import { SAVE_KEY, WORKSHOP_UPGRADE_COSTS } from 'data:application/javascript;base64,ZXhwb3J0IGNvbnN0IFZFSElDTEVfQ0FUQUxPRyA9IHsKICAgICd0cnVjayc6IHsgbmFtZTogJ0Jhc2ljIFRydWNrJywgcHJpY2U6IDAsIGNhdGVnb3J5OiAndHJ1Y2snLCBpY29uOiAndHJ1Y2sucG5nJywgc3RhdHM6ICdTcGVlZDogTWVkaXVtJyB9LAogICAgJ3BsYW5lJzogeyBuYW1lOiAnU21hbGwgUGxhbmUnLCBwcmljZTogMjUwMCwgY2F0ZWdvcnk6ICdwbGFuZScsIGljb246ICdwbGFuZS5wbmcnLCBzdGF0czogJ1NwZWVkOiBMdWRpY3JvdXMnIH0sCiAgICAnYWR2YW5jZWQtdHJ1Y2snOiB7IG5hbWU6ICdBZHZhbmNlZCBUcnVjaycsIHByaWNlOiA1MDAwLCBjYXRlZ29yeTogJ3RydWNrJywgaWNvbjogJ2FkdmFuY2VkX3RydWNrLnBuZycsIHN0YXRzOiAnU3BlZWQ6IEZhc3QnIH0sCiAgICAnbW9uc3Rlci10cnVjayc6IHsgbmFtZTogJ01vbnN0ZXIgVHJ1Y2snLCBwcmljZTogNzUwMCwgY2F0ZWdvcnk6ICd0cnVjaycsIGljb246ICdtb25zdGVyX3RydWNrLnBuZycsIHN0YXRzOiAnU3BlZWQ6IFNsb3cnIH0sCiAgICAnY3liZXItdHJ1Y2snOiB7IG5hbWU6ICdDeWJlciBUcnVjaycsIHByaWNlOiAxNTAwMCwgY2F0ZWdvcnk6ICd0cnVjaycsIGljb246ICdjeWJlcl90cnVjay5wbmcnLCBzdGF0czogJ1NwZWVkOiBWZXJ5IEZhc3QnIH0sCiAgICAnc2VtaS10cnVjayc6IHsgbmFtZTogJ1NlbWktVHJ1Y2snLCBwcmljZTogMTAwMDAsIGNhdGVnb3J5OiAndHJ1Y2snLCBpY29uOiAnc2VtaV90cnVjay5wbmcnLCBzdGF0czogJ1NwZWVkOiBTbG93JyB9LAogICAgJ2hvdmVyY3JhZnQnOiB7IG5hbWU6ICdIb3ZlcmNyYWZ0JywgcHJpY2U6IDI1MDAwLCBjYXRlZ29yeTogJ3RydWNrJywgaWNvbjogJ2hvdmVyY3JhZnQucG5nJywgc3RhdHM6ICdTcGVlZDogRmFzdCwgQWxsIHRlcnJhaW4nIH0sCiAgICAndWZvJzogeyBuYW1lOiAnVUZPJywgcHJpY2U6IDc1MDAwLCBjYXRlZ29yeTogJ3BsYW5lJywgaWNvbjogJ3Vmby5wbmcnLCBzdGF0czogJ1NwZWVkOiBJbnNhbmUnIH0KfTsKCmV4cG9ydCBjb25zdCBDT01QQU5ZX0ZPVU5ESU5HX0NPU1QgPSA1MDAwMDsKZXhwb3J0IGNvbnN0IFNBVkVfS0VZID0gJ2dsb2JhbFRydWNrZXJTYXZlRGF0YSc7CgpleHBvcnQgY29uc3QgV09SS1NIT1BfVVBHUkFERV9DT1NUUyA9IHsKICAgIHNwZWVkOiAyMDAwCn07CgpleHBvcnQgY29uc3QgUkFESU9fU1RBVElPTlMgPSB7CiAgICAnVVNBJzogWwogICAgICAgIHsgbmFtZTogJ0NsYXNzaWMgUm9jayAxMDEnLCBnZW5yZTogJ1JvY2snLCB1cmw6ICdodHRwczovL3N0cmVhbXMuaWxvdmVtdXNpYy5kZS9pbG92ZXJhZGlvMi5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnQ291bnRyeSBSb2FkcyBGTScsIGdlbnJlOiAnQ291bnRyeScsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8xNy5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnSmF6eiBDYWbDqScsIGdlbnJlOiAnSmF6eicsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW82Lm1wMycgfQogICAgXSwKICAgICdVSyc6IFsKICAgICAgICB7IG5hbWU6ICdCQkMgUm9jaycsIGdlbnJlOiAnUm9jaycsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8yLm1wMycgfSwKICAgICAgICB7IG5hbWU6ICdMb25kb24gQmVhdHMnLCBnZW5yZTogJ0VsZWN0cm9uaWMnLCB1cmw6ICdodHRwczovL3N0cmVhbXMuaWxvdmVtdXNpYy5kZS9pbG92ZXJhZGlvMy5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnQ2xhc3NpY2FsIEJyaXRhaW4nLCBnZW5yZTogJ0NsYXNzaWNhbCcsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW83Lm1wMycgfQogICAgXSwKICAgICdGcmFuY2UnOiBbCiAgICAgICAgeyBuYW1lOiAnUmFkaW8gUGFyaXMnLCBnZW5yZTogJ1BvcCcsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8xLm1wMycgfSwKICAgICAgICB7IG5hbWU6ICdKYXp6IGRlIEZyYW5jZScsIGdlbnJlOiAnSmF6eicsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW82Lm1wMycgfSwKICAgICAgICB7IG5hbWU6ICfDiWxlY3Ryb25pcXVlIEZNJywgZ2VucmU6ICdFbGVjdHJvbmljJywgdXJsOiAnaHR0cHM6Ly9zdHJlYW1zLmlsb3ZlbXVzaWMuZGUvaWxvdmVyYWRpbzMubXAzJyB9CiAgICBdLAogICAgJ0dlcm1hbnknOiBbCiAgICAgICAgeyBuYW1lOiAnRGV1dHNjaGUgV2VsbGUnLCBnZW5yZTogJ1BvcCcsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8xLm1wMycgfSwKICAgICAgICB7IG5hbWU6ICdCZXJsaW4gQmVhdCcsIGdlbnJlOiAnRWxlY3Ryb25pYycsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8zLm1wMycgfSwKICAgICAgICB7IG5hbWU6ICdDbGFzc2ljYWwgR2VybWFuaWEnLCBnZW5yZTogJ0NsYXNzaWNhbCcsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW83Lm1wMycgfQogICAgXSwKICAgICdKYXBhbic6IFsKICAgICAgICB7IG5hbWU6ICdUb2t5byBGTScsIGdlbnJlOiAnSi1Qb3AnLCB1cmw6ICdodHRwczovL3N0cmVhbXMuaWxvdmVtdXNpYy5kZS9pbG92ZXJhZGlvMS5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnQW5pbWUgUmFkaW8nLCBnZW5yZTogJ1NvdW5kdHJhY2snLCB1cmw6ICdodHRwczovL3N0cmVhbXMuaWxvdmVtdXNpYy5kZS9pbG92ZXJhZGlvOC5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnSmF6eiBUb2t5bycsIGdlbnJlOiAnSmF6eicsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW82Lm1wMycgfQogICAgXSwKICAgICdBdXN0cmFsaWEnOiBbCiAgICAgICAgeyBuYW1lOiAnQXVzc2llIFJvY2snLCBnZW5yZTogJ1JvY2snLCB1cmw6ICdodHRwczovL3N0cmVhbXMuaWxvdmVtdXNpYy5kZS9pbG92ZXJhZGlvMi5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnU3lkbmV5IFNvdW5kcycsIGdlbnJlOiAnUG9wJywgdXJsOiAnaHR0cHM6Ly9zdHJlYW1zLmlsb3ZlbXVzaWMuZGUvaWxvdmVyYWRpbzEubXAzJyB9LAogICAgICAgIHsgbmFtZTogJ091dGJhY2sgQ291bnRyeScsIGdlbnJlOiAnQ291bnRyeScsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8xNy5tcDMnIH0KICAgIF0sCiAgICAnQnJhemlsJzogWwogICAgICAgIHsgbmFtZTogJ1JhZGlvIEJyYXNpbCcsIGdlbnJlOiAnU2FtYmEnLCB1cmw6ICdodHRwczovL3N0cmVhbXMuaWxvdmVtdXNpYy5kZS9pbG92ZXJhZGlvMS5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnQm9zc2EgTm92YSBGTScsIGdlbnJlOiAnQm9zc2EgTm92YScsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW82Lm1wMycgfSwKICAgICAgICB7IG5hbWU6ICdSaW8gQmVhdCcsIGdlbnJlOiAnRWxlY3Ryb25pYycsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8zLm1wMycgfQogICAgXQp9Ow==';
import { ACHIEVEMENTS } from 'data:application/javascript;base64,ZXhwb3J0IGNvbnN0IEFDSElFVkVNRU5UUyA9IHsKICAgIC8vIE1pc3Npb24gYmFzZWQKICAgIEZJUlNUX0RFTElWRVJZOiB7CiAgICAgICAgbmFtZTogJ0ZpcnN0IERlbGl2ZXJ5JywKICAgICAgICBkZXNjcmlwdGlvbjogJ0NvbXBsZXRlIHlvdXIgZmlyc3QgbWlzc2lvbi4nLAogICAgICAgIHJld2FyZDogeyB4cDogNTAsIG1vbmV5OiA1MDAgfSwKICAgICAgICBjaGVjazogKHN0YXRzLCBnYW1lU3RhdGUpID0+IHN0YXRzLm1pc3Npb25zQ29tcGxldGVkID49IDEKICAgIH0sCiAgICBTRUFTT05FRF9EUklWRVI6IHsKICAgICAgICBuYW1lOiAnU2Vhc29uZWQgRHJpdmVyJywKICAgICAgICBkZXNjcmlwdGlvbjogJ0NvbXBsZXRlIDEwIG1pc3Npb25zLicsCiAgICAgICAgcmV3YXJkOiB7IHhwOiAyMDAsIG1vbmV5OiAyMDAwIH0sCiAgICAgICAgY2hlY2s6IChzdGF0cywgZ2FtZVN0YXRlKSA9PiBzdGF0cy5taXNzaW9uc0NvbXBsZXRlZCA+PSAxMAogICAgfSwKICAgIE1BU1RFUl9IQVVMRVI6IHsKICAgICAgICBuYW1lOiAnTWFzdGVyIEhhdWxlcicsCiAgICAgICAgZGVzY3JpcHRpb246ICdDb21wbGV0ZSA1MCBtaXNzaW9ucy4nLAogICAgICAgIHJld2FyZDogeyB4cDogMTAwMCwgbW9uZXk6IDEwMDAwIH0sCiAgICAgICAgY2hlY2s6IChzdGF0cywgZ2FtZVN0YXRlKSA9PiBzdGF0cy5taXNzaW9uc0NvbXBsZXRlZCA+PSA1MAogICAgfSwKCiAgICAvLyBNb25leSBiYXNlZAogICAgR0VUVElOR19TVEFSVEVEOiB7CiAgICAgICAgbmFtZTogJ0dldHRpbmcgU3RhcnRlZCcsCiAgICAgICAgZGVzY3JpcHRpb246ICdFYXJuIGEgdG90YWwgb2YgJDIwLDAwMC4nLAogICAgICAgIHJld2FyZDogeyB4cDogMTAwIH0sCiAgICAgICAgY2hlY2s6IChzdGF0cywgZ2FtZVN0YXRlKSA9PiBzdGF0cy50b3RhbEVhcm5pbmdzID49IDIwMDAwCiAgICB9LAogICAgQklHX1NQRU5ERVI6IHsKICAgICAgICBuYW1lOiAnQmlnIFNwZW5kZXInLAogICAgICAgIGRlc2NyaXB0aW9uOiAnT3duIGF0IGxlYXN0IDMgdmVoaWNsZXMuJywKICAgICAgICByZXdhcmQ6IHsgeHA6IDE1MCB9LAogICAgICAgIGNoZWNrOiAoc3RhdHMsIGdhbWVTdGF0ZSkgPT4gZ2FtZVN0YXRlLm93bmVkVmVoaWNsZXMubGVuZ3RoID49IDMKICAgIH0sCiAgICBUWUNPT046IHsKICAgICAgICBuYW1lOiAnVHljb29uJywKICAgICAgICBkZXNjcmlwdGlvbjogJ0Vhcm4gYSB0b3RhbCBvZiAkMTAwLDAwMC4nLAogICAgICAgIHJld2FyZDogeyB4cDogNTAwLCBtb25leTogMjUwMDAgfSwKICAgICAgICBjaGVjazogKHN0YXRzLCBnYW1lU3RhdGUpID0+IHN0YXRzLnRvdGFsRWFybmluZ3MgPj0gMTAwMDAwCiAgICB9LAoKICAgIC8vIEV4cGxvcmF0aW9uIGJhc2VkCiAgICBXT1JMRF9UUkFWRUxFUjogewogICAgICAgIG5hbWU6ICdXb3JsZCBUcmF2ZWxlcicsCiAgICAgICAgZGVzY3JpcHRpb246ICdWaXNpdCA1IGRpZmZlcmVudCBjb3VudHJpZXMuJywKICAgICAgICByZXdhcmQ6IHsgeHA6IDMwMCB9LAogICAgICAgIGNoZWNrOiAoc3RhdHMsIGdhbWVTdGF0ZSkgPT4gbmV3IFNldChzdGF0cy5kaXN0aW5jdENvdW50cmllc1Zpc2l0ZWQpLnNpemUgPj0gNQogICAgfSwKICAgIEdMT0JFVFJPVFRFUjogewogICAgICAgIG5hbWU6ICdHbG9iZXRyb3R0ZXInLAogICAgICAgIGRlc2NyaXB0aW9uOiAnVmlzaXQgMTUgZGlmZmVyZW50IGNvdW50cmllcy4nLAogICAgICAgIHJld2FyZDogeyB4cDogMTAwMCwgbW9uZXk6IDUwMDAgfSwKICAgICAgICBjaGVjazogKHN0YXRzLCBnYW1lU3RhdGUpID0+IG5ldyBTZXQoc3RhdHMuZGlzdGluY3RDb3VudHJpZXNWaXNpdGVkKS5zaXplID49IDE1CiAgICB9LAoKICAgIC8vIFByb2dyZXNzaW9uIGJhc2VkCiAgICBMRVZFTF81OiB7CiAgICAgICAgbmFtZTogJ0xldmVsIDUnLAogICAgICAgIGRlc2NyaXB0aW9uOiAnUmVhY2ggbGV2ZWwgNS4nLAogICAgICAgIHJld2FyZDogeyB4cDogMTAwLCBtb25leTogMTAwMCB9LAogICAgICAgIGNoZWNrOiAoc3RhdHMsIGdhbWVTdGF0ZSkgPT4gZ2FtZVN0YXRlLmxldmVsID49IDUKICAgIH0sCiAgICBMRVZFTF8xMDogewogICAgICAgIG5hbWU6ICdMZXZlbCAxMCcsCiAgICAgICAgZGVzY3JpcHRpb246ICdSZWFjaCBsZXZlbCAxMC4nLAogICAgICAgIHJld2FyZDogeyB4cDogNTAwLCBtb25leTogNTAwMCB9LAogICAgICAgIGNoZWNrOiAoc3RhdHMsIGdhbWVTdGF0ZSkgPT4gZ2FtZVN0YXRlLmxldmVsID49IDEwCiAgICB9LAogICAgQ09NUEFOWV9GT1VOREVSOiB7CiAgICAgICAgbmFtZTogJ0NvbXBhbnkgRm91bmRlcicsCiAgICAgICAgZGVzY3JpcHRpb246ICdTdGFydCB5b3VyIG93biBjb21wYW55LicsCiAgICAgICAgcmV3YXJkOiB7IHhwOiAxMDAwLCBtb25leTogMTAwMDAgfSwKICAgICAgICBjaGVjazogKHN0YXRzLCBnYW1lU3RhdGUpID0+IGdhbWVTdGF0ZS5jb21wYW55U3RhcnRlZAogICAgfQp9OwoK'; // Need achievements for rewards

export class GameState {
    constructor(game) {
        this.game = game; // Store reference to game for callbacks (e.g. UI updates, achievement unlocks)
        this.selectedVehicle = 'truck';
        this.ownedVehicles = ['truck'];
        this.money = 5000;
        this.companyStarted = false;
        this.level = 1;
        this.xp = 0;
        this.achievementsUnlocked = [];
        this.vehicleUpgrades = {
            speed: 0
        };
        // Ensure stats structure is initialized correctly
        this.stats = { 
            missionsCompleted: 0, 
            totalEarnings: 0, 
            distinctCountriesVisited: [] 
        };
        this.radioEnabled = false;
        this.currentStation = null;
        this.radioVolume = 0.5;

        this.load(); // Load state on creation
        this.xpForNextLevel = this.calculateXpForNextLevel(); // Calculate initial XP requirement
    }

    load() {
        const savedData = localStorage.getItem(SAVE_KEY);
        if (savedData) {
            const state = JSON.parse(savedData);
            // Assign loaded properties, using defaults if save data is missing keys
            this.selectedVehicle = state.selectedVehicle !== undefined ? state.selectedVehicle : 'truck';
            this.ownedVehicles = state.ownedVehicles !== undefined ? state.ownedVehicles : ['truck'];
            this.money = state.money !== undefined ? state.money : 5000;
            this.companyStarted = state.companyStarted !== undefined ? state.companyStarted : false;
            this.level = state.level !== undefined ? state.level : 1;
            this.xp = state.xp !== undefined ? state.xp : 0;
            this.achievementsUnlocked = state.achievementsUnlocked !== undefined ? state.achievementsUnlocked : [];
            this.vehicleUpgrades = state.vehicleUpgrades !== undefined ? state.vehicleUpgrades : {
                speed: 0
            };
            
            // Handle potential missing stats object or keys in old saves
            this.stats = state.stats || {};
            this.stats.missionsCompleted = this.stats.missionsCompleted !== undefined ? this.stats.missionsCompleted : 0;
            this.stats.totalEarnings = this.stats.totalEarnings !== undefined ? this.stats.totalEarnings : 0;
            this.stats.distinctCountriesVisited = this.stats.distinctCountriesVisited !== undefined ? this.stats.distinctCountriesVisited : [];
            
            this.radioEnabled = state.radioEnabled !== undefined ? state.radioEnabled : false;
            this.currentStation = state.currentStation !== undefined ? state.currentStation : null;
            this.radioVolume = state.radioVolume !== undefined ? state.radioVolume : 0.5;
        } else {
            this.setDefaultState(); // Start with default if no save data
        }
    }
    
    setDefaultState() {
        this.selectedVehicle = 'truck';
        this.ownedVehicles = ['truck'];
        this.money = 5000;
        this.companyStarted = false;
        this.level = 1;
        this.xp = 0;
        this.achievementsUnlocked = [];
        this.stats = { missionsCompleted: 0, totalEarnings: 0, distinctCountriesVisited: [] };
        this.vehicleUpgrades = {
            speed: 0
        };
        this.radioEnabled = false;
        this.currentStation = null;
        this.radioVolume = 0.5;
    }

    save() {
        const stateToSave = {
            selectedVehicle: this.selectedVehicle,
            ownedVehicles: this.ownedVehicles,
            money: this.money,
            companyStarted: this.companyStarted,
            level: this.level,
            xp: this.xp,
            achievementsUnlocked: this.achievementsUnlocked,
            stats: this.stats,
            vehicleUpgrades: this.vehicleUpgrades,
            radioEnabled: this.radioEnabled,
            currentStation: this.currentStation,
            radioVolume: this.radioVolume
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
    }

    reset() {
        localStorage.removeItem(SAVE_KEY);
        this.setDefaultState();
        this.xpForNextLevel = this.calculateXpForNextLevel(); // Recalculate after reset
        // Trigger UI update after reset if game is running
        if (this.game && this.game.ui) {
            this.game.ui.updateAllUI();
        }
    }
    
    // --- XP & Leveling ---
    calculateXpForNextLevel() {
        // Base XP for level 1 is 100. Multiplies by 1.5 for each subsequent level.
        return Math.floor(100 * Math.pow(1.5, this.level - 1));
    }

    addXP(amount) {
        if (!amount || amount < 0) return { leveledUp: false };

        this.xp += amount;
        let leveledUp = false;
        let levelUpInfo = null;

        while (this.xp >= this.xpForNextLevel) {
            this.xp -= this.xpForNextLevel;
            this.level++;
            this.xpForNextLevel = this.calculateXpForNextLevel();
            const levelUpBonus = this.level * 1000; // Bonus scales with level
            this.money += levelUpBonus; // Grant bonus money

            leveledUp = true;
            levelUpInfo = { newLevel: this.level, bonus: levelUpBonus };

            // Notify the game/UI about the level up
            // Using a timeout to not block current execution flow, especially if called from addXP
            setTimeout(() => {
                 alert(`🎉 LEVEL UP! 🎉\nYou are now Level ${levelUpInfo.newLevel}.\nBonus: $${levelUpInfo.bonus.toLocaleString()}`);
                 // Optionally trigger UI update after level up alert closes
                 if (this.game && this.game.ui) {
                    this.game.ui.updateAllUI();
                 }
                 // Check for level-based achievements after leveling up
                 if (this.game) {
                     this.game.handleAchievementChecks();
                 }
            }, 50); // Small delay

        }
        // Always trigger UI update for XP bar and level number
        if (this.game && this.game.ui) {
             this.game.ui.updateLevelUI(this.level, this.xp, this.xpForNextLevel);
             this.game.ui.updateMoneyUI(this.money); // Money might change due to bonus
        }

        this.save(); // Save state after XP/level changes

        return { leveledUp, levelUpInfo }; // Return info if needed elsewhere
    }

    // --- Stats Management ---
    updateMissionStats(mission, reward, missionGenerator) {
        this.stats.missionsCompleted = (this.stats.missionsCompleted || 0) + 1;
        this.stats.totalEarnings = (this.stats.totalEarnings || 0) + reward;
        
        // Find the destination city data using the mission generator's city list
        const destCityData = missionGenerator.cities.find(c => c.name === mission.destination);
        if (destCityData && destCityData.country) { // Ensure country exists
            if (!this.stats.distinctCountriesVisited.includes(destCityData.country)) {
                this.stats.distinctCountriesVisited.push(destCityData.country);
            }
        }
        this.save(); // Save state after stats update
    }

    // --- Achievement State Management ---
    unlockAchievement(id) {
        if (!this.achievementsUnlocked.includes(id)) {
            this.achievementsUnlocked.push(id);
            // Achievement rewards (XP/Money) are handled in game.js's unlockAchievement
            // UI update for achievements panel is also in game.js (or delegated to UI Manager)
            this.save(); // Save state after unlocking
        }
    }

    // --- Vehicle Upgrade System ---
    upgradeVehicle(upgradeType) {
        const cost = WORKSHOP_UPGRADE_COSTS[upgradeType];
        
        if (!cost) {
            return { success: false, message: "Invalid upgrade type!" };
        }

        const currentLevel = this.vehicleUpgrades[upgradeType] || 0;
        
        // Maximum upgrade level is 5
        if (currentLevel >= 5) {
            return { success: false, message: `${upgradeType} is already at maximum level!` };
        }
        
        // Calculate cost with scaling (each level costs more)
        const scaledCost = Math.floor(cost * Math.pow(1.5, currentLevel));
        
        if (this.money >= scaledCost) {
            this.money -= scaledCost;
            this.vehicleUpgrades[upgradeType] = currentLevel + 1;
            this.save();
            return { success: true, cost: scaledCost };
        } else {
            return { success: false, message: `You need $${scaledCost} for this upgrade.` };
        }
    }
}