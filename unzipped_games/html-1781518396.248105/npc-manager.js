import { VEHICLE_CATALOG } from 'data:application/javascript;base64,ZXhwb3J0IGNvbnN0IFZFSElDTEVfQ0FUQUxPRyA9IHsKICAgICd0cnVjayc6IHsgbmFtZTogJ0Jhc2ljIFRydWNrJywgcHJpY2U6IDAsIGNhdGVnb3J5OiAndHJ1Y2snLCBpY29uOiAndHJ1Y2sucG5nJywgc3RhdHM6ICdTcGVlZDogTWVkaXVtJyB9LAogICAgJ3BsYW5lJzogeyBuYW1lOiAnU21hbGwgUGxhbmUnLCBwcmljZTogMjUwMCwgY2F0ZWdvcnk6ICdwbGFuZScsIGljb246ICdwbGFuZS5wbmcnLCBzdGF0czogJ1NwZWVkOiBMdWRpY3JvdXMnIH0sCiAgICAnYWR2YW5jZWQtdHJ1Y2snOiB7IG5hbWU6ICdBZHZhbmNlZCBUcnVjaycsIHByaWNlOiA1MDAwLCBjYXRlZ29yeTogJ3RydWNrJywgaWNvbjogJ2FkdmFuY2VkX3RydWNrLnBuZycsIHN0YXRzOiAnU3BlZWQ6IEZhc3QnIH0sCiAgICAnbW9uc3Rlci10cnVjayc6IHsgbmFtZTogJ01vbnN0ZXIgVHJ1Y2snLCBwcmljZTogNzUwMCwgY2F0ZWdvcnk6ICd0cnVjaycsIGljb246ICdtb25zdGVyX3RydWNrLnBuZycsIHN0YXRzOiAnU3BlZWQ6IFNsb3cnIH0sCiAgICAnY3liZXItdHJ1Y2snOiB7IG5hbWU6ICdDeWJlciBUcnVjaycsIHByaWNlOiAxNTAwMCwgY2F0ZWdvcnk6ICd0cnVjaycsIGljb246ICdjeWJlcl90cnVjay5wbmcnLCBzdGF0czogJ1NwZWVkOiBWZXJ5IEZhc3QnIH0sCiAgICAnc2VtaS10cnVjayc6IHsgbmFtZTogJ1NlbWktVHJ1Y2snLCBwcmljZTogMTAwMDAsIGNhdGVnb3J5OiAndHJ1Y2snLCBpY29uOiAnc2VtaV90cnVjay5wbmcnLCBzdGF0czogJ1NwZWVkOiBTbG93JyB9LAogICAgJ2hvdmVyY3JhZnQnOiB7IG5hbWU6ICdIb3ZlcmNyYWZ0JywgcHJpY2U6IDI1MDAwLCBjYXRlZ29yeTogJ3RydWNrJywgaWNvbjogJ2hvdmVyY3JhZnQucG5nJywgc3RhdHM6ICdTcGVlZDogRmFzdCwgQWxsIHRlcnJhaW4nIH0sCiAgICAndWZvJzogeyBuYW1lOiAnVUZPJywgcHJpY2U6IDc1MDAwLCBjYXRlZ29yeTogJ3BsYW5lJywgaWNvbjogJ3Vmby5wbmcnLCBzdGF0czogJ1NwZWVkOiBJbnNhbmUnIH0KfTsKCmV4cG9ydCBjb25zdCBDT01QQU5ZX0ZPVU5ESU5HX0NPU1QgPSA1MDAwMDsKZXhwb3J0IGNvbnN0IFNBVkVfS0VZID0gJ2dsb2JhbFRydWNrZXJTYXZlRGF0YSc7CgpleHBvcnQgY29uc3QgV09SS1NIT1BfVVBHUkFERV9DT1NUUyA9IHsKICAgIHNwZWVkOiAyMDAwCn07CgpleHBvcnQgY29uc3QgUkFESU9fU1RBVElPTlMgPSB7CiAgICAnVVNBJzogWwogICAgICAgIHsgbmFtZTogJ0NsYXNzaWMgUm9jayAxMDEnLCBnZW5yZTogJ1JvY2snLCB1cmw6ICdodHRwczovL3N0cmVhbXMuaWxvdmVtdXNpYy5kZS9pbG92ZXJhZGlvMi5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnQ291bnRyeSBSb2FkcyBGTScsIGdlbnJlOiAnQ291bnRyeScsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8xNy5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnSmF6eiBDYWbDqScsIGdlbnJlOiAnSmF6eicsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW82Lm1wMycgfQogICAgXSwKICAgICdVSyc6IFsKICAgICAgICB7IG5hbWU6ICdCQkMgUm9jaycsIGdlbnJlOiAnUm9jaycsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8yLm1wMycgfSwKICAgICAgICB7IG5hbWU6ICdMb25kb24gQmVhdHMnLCBnZW5yZTogJ0VsZWN0cm9uaWMnLCB1cmw6ICdodHRwczovL3N0cmVhbXMuaWxvdmVtdXNpYy5kZS9pbG92ZXJhZGlvMy5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnQ2xhc3NpY2FsIEJyaXRhaW4nLCBnZW5yZTogJ0NsYXNzaWNhbCcsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW83Lm1wMycgfQogICAgXSwKICAgICdGcmFuY2UnOiBbCiAgICAgICAgeyBuYW1lOiAnUmFkaW8gUGFyaXMnLCBnZW5yZTogJ1BvcCcsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8xLm1wMycgfSwKICAgICAgICB7IG5hbWU6ICdKYXp6IGRlIEZyYW5jZScsIGdlbnJlOiAnSmF6eicsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW82Lm1wMycgfSwKICAgICAgICB7IG5hbWU6ICfDiWxlY3Ryb25pcXVlIEZNJywgZ2VucmU6ICdFbGVjdHJvbmljJywgdXJsOiAnaHR0cHM6Ly9zdHJlYW1zLmlsb3ZlbXVzaWMuZGUvaWxvdmVyYWRpbzMubXAzJyB9CiAgICBdLAogICAgJ0dlcm1hbnknOiBbCiAgICAgICAgeyBuYW1lOiAnRGV1dHNjaGUgV2VsbGUnLCBnZW5yZTogJ1BvcCcsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8xLm1wMycgfSwKICAgICAgICB7IG5hbWU6ICdCZXJsaW4gQmVhdCcsIGdlbnJlOiAnRWxlY3Ryb25pYycsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8zLm1wMycgfSwKICAgICAgICB7IG5hbWU6ICdDbGFzc2ljYWwgR2VybWFuaWEnLCBnZW5yZTogJ0NsYXNzaWNhbCcsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW83Lm1wMycgfQogICAgXSwKICAgICdKYXBhbic6IFsKICAgICAgICB7IG5hbWU6ICdUb2t5byBGTScsIGdlbnJlOiAnSi1Qb3AnLCB1cmw6ICdodHRwczovL3N0cmVhbXMuaWxvdmVtdXNpYy5kZS9pbG92ZXJhZGlvMS5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnQW5pbWUgUmFkaW8nLCBnZW5yZTogJ1NvdW5kdHJhY2snLCB1cmw6ICdodHRwczovL3N0cmVhbXMuaWxvdmVtdXNpYy5kZS9pbG92ZXJhZGlvOC5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnSmF6eiBUb2t5bycsIGdlbnJlOiAnSmF6eicsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW82Lm1wMycgfQogICAgXSwKICAgICdBdXN0cmFsaWEnOiBbCiAgICAgICAgeyBuYW1lOiAnQXVzc2llIFJvY2snLCBnZW5yZTogJ1JvY2snLCB1cmw6ICdodHRwczovL3N0cmVhbXMuaWxvdmVtdXNpYy5kZS9pbG92ZXJhZGlvMi5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnU3lkbmV5IFNvdW5kcycsIGdlbnJlOiAnUG9wJywgdXJsOiAnaHR0cHM6Ly9zdHJlYW1zLmlsb3ZlbXVzaWMuZGUvaWxvdmVyYWRpbzEubXAzJyB9LAogICAgICAgIHsgbmFtZTogJ091dGJhY2sgQ291bnRyeScsIGdlbnJlOiAnQ291bnRyeScsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8xNy5tcDMnIH0KICAgIF0sCiAgICAnQnJhemlsJzogWwogICAgICAgIHsgbmFtZTogJ1JhZGlvIEJyYXNpbCcsIGdlbnJlOiAnU2FtYmEnLCB1cmw6ICdodHRwczovL3N0cmVhbXMuaWxvdmVtdXNpYy5kZS9pbG92ZXJhZGlvMS5tcDMnIH0sCiAgICAgICAgeyBuYW1lOiAnQm9zc2EgTm92YSBGTScsIGdlbnJlOiAnQm9zc2EgTm92YScsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW82Lm1wMycgfSwKICAgICAgICB7IG5hbWU6ICdSaW8gQmVhdCcsIGdlbnJlOiAnRWxlY3Ryb25pYycsIHVybDogJ2h0dHBzOi8vc3RyZWFtcy5pbG92ZW11c2ljLmRlL2lsb3ZlcmFkaW8zLm1wMycgfQogICAgXQp9Ow==';

const PLAYER_NAMES = [
    "TruckerJoe", "BigRig99", "HighwayKing", "RoadWarrior", "FastFreight",
    "DieselDan", "SpeedyG", "CargoMaster", "LogisticsLord", "TruckingPro",
    "NightDriver", "GearShifter", "UrbanHauler", "GlobeTrotter", "SteelWhale",
    "HaulAway", "SkyHigh", "AeroTrucker", "UFORider", "ContrabandKid",
    "SmugglerOne", "CargoCaptain", "FreightFiend", "RoadRunner", "AsphaltNinja"
];

export class NPCManager {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.map = gameInstance.map;
        this.npcs = [];
        this.maxNPCs = 15;
    }

    init() {
        // Initial spawn
        for (let i = 0; i < this.maxNPCs; i++) {
            this.spawnNPC();
        }

        // Movement loop
        setInterval(() => this.updateNPCs(), 100);
    }

    spawnNPC() {
        const name = PLAYER_NAMES[Math.floor(Math.random() * PLAYER_NAMES.length)];
        const vehicleIds = Object.keys(VEHICLE_CATALOG);
        const vehicleId = vehicleIds[Math.floor(Math.random() * vehicleIds.length)];
        const vehicle = VEHICLE_CATALOG[vehicleId];

        // Random starting position near current view or random major city
        // Let's pick a random city from mission generator cities if possible
        const cities = this.game.missionGenerator ? this.game.missionGenerator.cities : [
            { coords: [40.7128, -74.0060] }, { coords: [34.0522, -118.2437] }, { coords: [51.5074, -0.1278] }
        ];
        const startCity = cities[Math.floor(Math.random() * cities.length)];
        const destCity = cities[Math.floor(Math.random() * cities.length)];

        // Jitter starting position slightly
        const startCoords = [
            startCity.coords[0] + (Math.random() - 0.5) * 5,
            startCity.coords[1] + (Math.random() - 0.5) * 5
        ];

        const npcIcon = L.divIcon({
            className: 'npc-vehicle-icon',
            html: `
                <div class="npc-container">
                    <span class="npc-name">${name}</span>
                    <img src="${vehicle.icon}" style="width: 40px; height: 40px; opacity: 0.8;">
                </div>
            `,
            iconSize: [60, 60],
            iconAnchor: [30, 45]
        });

        const marker = L.marker(startCoords, { icon: npcIcon }).addTo(this.map);

        const npc = {
            name: name,
            marker: marker,
            vehicleId: vehicleId,
            currentPos: { lat: startCoords[0], lng: startCoords[1] },
            targetPos: { lat: destCity.coords[0], lng: destCity.coords[1] },
            speed: 0.01 + Math.random() * 0.02
        };

        this.npcs.push(npc);
    }

    updateNPCs() {
        this.npcs.forEach(npc => {
            const latDiff = npc.targetPos.lat - npc.currentPos.lat;
            const lngDiff = npc.targetPos.lng - npc.currentPos.lng;
            const dist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

            if (dist < 0.1) {
                // Pick new target
                const cities = this.game.missionGenerator.cities;
                const newDest = cities[Math.floor(Math.random() * cities.length)];
                npc.targetPos = { lat: newDest.coords[0], lng: newDest.coords[1] };
            } else {
                // Move towards target
                const moveLat = (latDiff / dist) * npc.speed;
                const moveLng = (lngDiff / dist) * npc.speed;

                npc.currentPos.lat += moveLat;
                npc.currentPos.lng += moveLng;

                npc.marker.setLatLng(npc.currentPos);
            }
        });
    }
}
