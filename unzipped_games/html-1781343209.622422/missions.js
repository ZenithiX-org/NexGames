import { calculateDistance } from 'data:application/javascript;base64,ZXhwb3J0IGZ1bmN0aW9uIGNhbGN1bGF0ZURpc3RhbmNlKGNvb3JkczEsIGNvb3JkczIpIHsKICAgIGNvbnN0IFIgPSAzOTU4Ljg7IC8vIG1pbGVzCiAgICBjb25zdCBbbGF0MSwgbG9uMV0gPSBjb29yZHMxOwogICAgY29uc3QgW2xhdDIsIGxvbjJdID0gY29vcmRzMjsKICAgIAogICAgY29uc3Qgz4YxID0gbGF0MSAqIE1hdGguUEkvMTgwOwogICAgY29uc3Qgz4YyID0gbGF0MiAqIE1hdGguUEkvMTgwOwogICAgY29uc3QgzpTPhiA9IChsYXQyLWxhdDEpICogTWF0aC5QSS8xODA7CiAgICBjb25zdCDOlM67ID0gKGxvbjItbG9uMSkgKiBNYXRoLlBJLzE4MDsKCiAgICBjb25zdCBhID0gTWF0aC5zaW4ozpTPhi8yKSAqIE1hdGguc2luKM6Uz4YvMikgKwogICAgICAgICAgICAgIE1hdGguY29zKM+GMSkgKiBNYXRoLmNvcyjPhjIpICoKICAgICAgICAgICAgICBNYXRoLnNpbijOlM67LzIpICogTWF0aC5zaW4ozpTOuy8yKTsKICAgIGNvbnN0IGMgPSAyICogTWF0aC5hdGFuMihNYXRoLnNxcnQoYSksIE1hdGguc3FydCgxLWEpKTsKCiAgICByZXR1cm4gUiAqIGM7Cn0KCg==';

const CARGO_TYPES = [
    { name: 'Electronics', baseValue: 200, icon: '📦' },
    { name: 'Medical Supplies', baseValue: 350, icon: '⚕️' },
    { name: 'Fresh Produce', baseValue: 120, icon: '🍎' },
    { name: 'Heavy Machinery', baseValue: 500, icon: '🏗️' },
    { name: 'Luxury Goods', baseValue: 600, icon: '💎' },
    { name: 'Textiles', baseValue: 150, icon: '👕' },
    { name: 'Contraband Art', baseValue: 1500, icon: '🖼️', isSmuggler: true },
    { name: 'Classified Tech', baseValue: 2000, icon: '💾', isSmuggler: true },
    { name: 'Gold Bullion (Untaxed)', baseValue: 2500, icon: '💰', isSmuggler: true },
];

export class MissionGenerator {
    constructor(map) {
        this.map = map;
        this.cities = [
            // USA Cities
            { name: 'New York', coords: [40.7128, -74.0060], country: 'USA' },
            { name: 'Los Angeles', coords: [34.0522, -118.2437], country: 'USA' },
            { name: 'Chicago', coords: [41.8781, -87.6298], country: 'USA' },
            { name: 'Houston', coords: [29.7604, -95.3698], country: 'USA' },
            { name: 'Miami', coords: [25.7617, -80.1918], country: 'USA' },
            { name: 'San Francisco', coords: [37.7749, -122.4194], country: 'USA' },
            { name: 'Seattle', coords: [47.6062, -122.3321], country: 'USA' },
            { name: 'Denver', coords: [39.7392, -104.9903], country: 'USA' },
            
            // International Cities - Europe
            { name: 'London', coords: [51.5074, -0.1278], country: 'UK' },
            { name: 'Paris', coords: [48.8566, 2.3522], country: 'France' },
            { name: 'Berlin', coords: [52.5200, 13.4050], country: 'Germany' },
            { name: 'Rome', coords: [41.9028, 12.4964], country: 'Italy' },
            { name: 'Madrid', coords: [40.4168, -3.7038], country: 'Spain' },
            { name: 'Amsterdam', coords: [52.3676, 4.9041], country: 'Netherlands' },
            { name: 'Prague', coords: [50.0755, 14.4378], country: 'Czech Republic' },
            
            // International Cities - Asia
            { name: 'Tokyo', coords: [35.6762, 139.6503], country: 'Japan' },
            { name: 'Beijing', coords: [39.9042, 116.4074], country: 'China' },
            { name: 'Seoul', coords: [37.5665, 126.9780], country: 'South Korea' },
            { name: 'Shanghai', coords: [31.2304, 121.4737], country: 'China' },
            { name: 'Mumbai', coords: [19.0760, 72.8777], country: 'India' },
            { name: 'Singapore', coords: [1.3521, 103.8198], country: 'Singapore' },
            
            // International Cities - Australia and Oceania
            { name: 'Sydney', coords: [-33.8688, 151.2093], country: 'Australia' },
            { name: 'Melbourne', coords: [-37.8136, 144.9631], country: 'Australia' },
            { name: 'Auckland', coords: [-36.8485, 174.7633], country: 'New Zealand' },
            
            // International Cities - Middle East
            { name: 'Dubai', coords: [25.2048, 55.2708], country: 'UAE' },
            { name: 'Tel Aviv', coords: [32.0853, 34.7818], country: 'Israel' },
            { name: 'Istanbul', coords: [41.0082, 28.9784], country: 'Turkey' },
            
            // International Cities - South America
            { name: 'Rio de Janeiro', coords: [-22.9068, -43.1729], country: 'Brazil' },
            { name: 'São Paulo', coords: [-23.5505, -46.6333], country: 'Brazil' },
            { name: 'Buenos Aires', coords: [-34.6037, -58.3816], country: 'Argentina' },
            { name: 'Lima', coords: [-12.0464, -77.0428], country: 'Peru' },
            
            // International Cities - Africa
            { name: 'Cape Town', coords: [-33.9249, 18.4241], country: 'South Africa' },
            { name: 'Cairo', coords: [30.0444, 31.2357], country: 'Egypt' },
            { name: 'Nairobi', coords: [-1.2921, 36.8219], country: 'Kenya' }
        ];
    }

    createMission(vehicleType = 'truck') {
        // If it's a truck, only allow missions within USA
        const availableCities = vehicleType === 'truck' 
            ? this.cities.filter(city => city.country === 'USA')
            : this.cities; // Plane can go anywhere

        const startCity = this.getRandomCity(null, availableCities);
        const destinationCity = this.getRandomCity(startCity, availableCities);
        
        const cargo = CARGO_TYPES[Math.floor(Math.random() * CARGO_TYPES.length)];
        const distance = calculateDistance(startCity.coords, destinationCity.coords);
        
        // Value = base value + bonus per mile
        const value = Math.round(cargo.baseValue + distance * 0.5);

        return {
            start: startCity.name,
            destination: destinationCity.name,
            startCoords: startCity.coords,
            destinationCoords: destinationCity.coords,
            cargo: {
                name: cargo.name,
                value: value,
                icon: cargo.icon,
                isSmuggler: cargo.isSmuggler || false
            }
        };
    }

    getRandomCity(excludeCity = null, cityList = null) {
        const cities = cityList || this.cities;
        const availableCities = cities.filter(city => city !== excludeCity);
        return availableCities[Math.floor(Math.random() * availableCities.length)];
    }
}