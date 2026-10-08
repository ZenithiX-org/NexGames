export function initMap() {
    const mapContainer = document.getElementById('map');
    
    // More aggressive cleanup
    if (mapContainer) {
        if (mapContainer._leaflet_map) {
            mapContainer._leaflet_map.remove();
        }
        mapContainer.innerHTML = '';
    }

    // Comprehensive map cleanup
    if (window.currentMap) {
        try {
            window.currentMap.remove();
        } catch (error) {
            console.warn("Error removing previous map:", error);
        }
    }
    window.currentMap = null;

    // Create map with more flexible settings
    const map = L.map('map', {
        center: [40.7128, -74.0060],
        zoom: 5,
        attributionControl: false,
        zoomControl: false,
        scrollWheelZoom: true,
        preferCanvas: true,
        maxZoom: 12,
        minZoom: 3
    });

    window.currentMap = map;

    // Use CartoDB Dark Matter - No API key required, fits the dark aesthetic perfectly
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 3
    }).addTo(map);

    // Add subtle zoom control bottom-right
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    return map;
}

export function createRoute(map, startCoords, endCoords) {
    // Remove previous route layers
    if (window.currentRouteGroup) {
        try {
            map.removeLayer(window.currentRouteGroup);
        } catch (error) {
            console.warn("Error removing previous route:", error);
        }
    }

    // Create a layerGroup for both lines
    const routeGroup = L.layerGroup();

    // Outer glow line
    L.polyline([startCoords, endCoords], {
        color: '#00d2ff',
        weight: 6,
        opacity: 0.15,
        lineCap: 'round',
        lineJoin: 'round'
    }).addTo(routeGroup);

    // Main dashed line
    L.polyline([startCoords, endCoords], {
        color: '#00d2ff',
        weight: 2,
        opacity: 0.7,
        dashArray: '8, 12',
        lineCap: 'round',
        lineJoin: 'round'
    }).addTo(routeGroup);

    // Destination marker (pulsing circle)
    L.circleMarker(endCoords, {
        radius: 8,
        fillColor: '#00d2ff',
        fillOpacity: 0.6,
        color: '#00d2ff',
        weight: 2,
        opacity: 0.8
    }).addTo(routeGroup);

    routeGroup.addTo(map);
    window.currentRouteGroup = routeGroup;

    return routeGroup;
}

export function addWorkshops(map) {
    const workshops = [
        // USA Workshops
        { coords: [34.0522, -118.2437], name: 'LA Auto Workshop' },
        { coords: [40.7128, -74.0060], name: 'NYC Garage' },
        { coords: [41.8781, -87.6298], name: 'Chicago Customs' },
        { coords: [29.7604, -95.3698], name: 'Houston Workshop' },
        // International Workshops (for planes)
        { coords: [52.5200, 13.4050], name: 'Berlin Workshop' },
        { coords: [35.6762, 139.6503], name: 'Tokyo Garage' }
    ];

    const workshopMarkers = [];
    
    workshops.forEach(workshop => {
        const marker = L.marker(workshop.coords, {
            icon: L.divIcon({
                className: 'workshop-icon',
                html: '<div class="workshop-icon-inner">🔧</div>',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        }).addTo(map);
        
        marker.bindPopup(`
            <div class="workshop-popup">
                <h4>${workshop.name}</h4>
                <p>Upgrade your vehicle</p>
                <button onclick="window.gameInstance.openWorkshop()">
                    Enter Workshop
                </button>
            </div>
        `);
        
        workshopMarkers.push(marker);
    });

    return workshopMarkers;
}

export function addCasinos(map) {
    const casinos = [
        { coords: [36.1699, -115.1398], name: 'The Golden Palace', description: 'Las Vegas, USA' },
        { coords: [43.7384, 7.4246], name: 'Monte Carlo Royale', description: 'Monaco' },
        { coords: [22.1977, 113.5439], name: 'Macau Star', description: 'Macau, China' },
        { coords: [1.2847, 103.8610], name: 'Sands of Singapore', description: 'Singapore' }
    ];

    const casinoMarkers = [];
    
    casinos.forEach(casino => {
        const marker = L.marker(casino.coords, {
            icon: L.divIcon({
                className: 'casino-icon',
                html: '<div class="casino-icon-inner">🎰</div>',
                iconSize: [35, 35],
                iconAnchor: [17, 17]
            })
        }).addTo(map);
        
        marker.casinoName = casino.name;
        
        marker.bindPopup(`
            <div class="casino-popup">
                <h4>${casino.name}</h4>
                <p>${casino.description}</p>
                <div class="casino-actions">
                    <button onclick="window.gameInstance.openCasino('${casino.name}')">
                        Enter Casino
                    </button>
                </div>
            </div>
        `);
        
        casinoMarkers.push(marker);
    });

    return casinoMarkers;
}