let totalDistance = 0;
let lastPosition = null;
let watchId = null;
let map, routeLine, marker;
let customRoute = { coords: [], totalDistance: 0 };

const startPoints = {
    boardwalk: { name: "Boardwalk Resort", coord: [28.367035, -81.556312] },
    contemporary: { name: "Contemporary", coord: [28.41536015750347, -81.57481301542497] },
    grandFloridian: { name: "Grand Floridian", coord: [28.41201873329078, -81.58744656089249] }
};

const endPoints = {
    boardwalk: [
        { name: "Hollywood Studios", coord: [28.358273, -81.558855] },
        { name: "Epcot", coord: [28.3747, -81.5494] },
        { name: "Lake", coord: [28.367035, -81.556312] }
    ],
    contemporary: [
        { name: "Magic Kingdom", coord: [28.4177, -81.5812] }
    ],
    grandFloridian: [
        { name: "Magic Kingdom", coord: [28.4177, -81.5812] }
    ]
};

// Predefined routes
const predefinedRoutes = {
    "boardwalk-hollywoodstudios": {
        coords: [
            [28.367035, -81.556312],
            [28.367002, -81.556457],
            [28.366973, -81.556596],
            [28.366978, -81.556762],
            [28.367006, -81.556988],
            [28.367049, -81.557186],
            [28.367105, -81.557310],
            [28.367186, -81.557428],
            [28.367285, -81.557535],
            [28.367370, -81.557610],
            [28.367459, -81.557696],
            [28.367540, -81.557782],
            [28.367493, -81.557878],
            [28.367450, -81.558007],
            [28.367408, -81.558125],
            [28.367375, -81.558195],
            [28.367294, -81.558211],
            [28.367257, -81.558275],
            [28.367266, -81.558361],
            [28.367242, -81.558420],
            [28.367157, -81.558367],
            [28.366936, -81.558238],
            [28.366884, -81.558104],
            [28.366789, -81.558018],
            [28.366605, -81.557868],
            [28.366331, -81.557648],
            [28.366265, -81.557508],
            [28.366025, -81.557326],
            [28.365722, -81.557100],
            [28.365586, -81.557063],
            [28.365434, -81.557063],
            [28.365241, -81.557025],
            [28.364490, -81.556537],
            [28.364448, -81.556467],
            [28.364287, -81.556403],
            [28.364122, -81.556349],
            [28.363858, -81.556317],
            [28.363645, -81.556237],
            [28.363447, -81.556097],
            [28.363258, -81.555872],
            [28.362819, -81.555609],
            [28.362357, -81.555496],
            [28.362173, -81.555442],
            [28.361913, -81.555303],
            [28.361786, -81.555271],
            [28.361672, -81.555314],
            [28.361554, -81.555378],
            [28.361436, -81.555485],
            [28.361280, -81.555598],
            [28.361172, -81.555662],
            [28.361059, -81.555705],
            [28.360889, -81.555743],
            [28.360738, -81.555770],
            [28.360601, -81.555807],
            [28.360511, -81.555936],
            [28.360436, -81.556086],
            [28.360355, -81.556210],
            [28.360209, -81.556301],
            [28.360077, -81.556349],
            [28.359926, -81.556408],
            [28.359765, -81.556440],
            [28.359614, -81.556392],
            [28.359430, -81.556424],
            [28.359312, -81.556430],
            [28.359203, -81.556499],
            [28.359029, -81.556542],
            [28.358944, -81.556564],
            [28.358873, -81.556805],
            [28.358769, -81.557272],
            [28.358708, -81.557492],
            [28.358736, -81.557642],
            [28.358694, -81.557868],
            [28.358543, -81.557873],
            [28.358401, -81.557916],
            [28.358292, -81.558023],
            [28.358189, -81.558206],
            [28.358354, -81.558356],
            [28.358410, -81.558447],
            [28.358358, -81.558603],
            [28.358273, -81.558855],
        ],
        totalDistance: 1.36
    },
    "boardwalk-lake": {
        coords: [
            [28.367035, -81.556312],
            [28.367257, -81.555872],
            [28.367366, -81.555770],
            [28.367564, -81.555652],
            [28.367814, -81.555566],
            [28.368065, -81.555555],
            [28.368296, -81.555587],
            [28.368489, -81.555668],
            [28.368716, -81.555716],
            [28.368985, -81.555662],
            [28.369122, -81.555534],
            [28.369202, -81.555389],
            [28.369249, -81.555223],
            [28.369287, -81.555051],
            [28.369363, -81.554938],
            [28.369608, -81.554933],
            [28.369849, -81.554927],
            [28.369849, -81.555029],
            [28.369830, -81.555206],
            [28.369816, -81.555405],
            [28.369830, -81.555485],
            [28.369854, -81.555614],
            [28.369905, -81.555754],
            [28.369962, -81.555872],
            [28.370028, -81.555974],
            [28.370127, -81.556097],
            [28.370222, -81.556204],
            [28.370283, -81.556317],
            [28.370359, -81.556473],
            [28.370401, -81.556596],
            [28.370425, -81.556757],
            [28.370448, -81.556896],
            [28.370472, -81.557047],
            [28.370472, -81.557159],
            [28.370453, -81.557299],
            [28.370415, -81.557465],
            [28.370387, -81.557594],
            [28.370330, -81.557744],
            [28.370264, -81.557851],
            [28.370184, -81.557969],
            [28.370108, -81.558066],
            [28.369943, -81.558248],
            [28.369811, -81.558420],
            [28.369547, -81.558195],
            [28.369264, -81.558479],
            [28.369032, -81.558281],
            [28.368900, -81.558367],
            [28.368593, -81.558726],
            [28.368499, -81.558930],
            [28.368409, -81.558914],
            [28.368282, -81.558844],
            [28.368183, -81.558790],
            [28.368017, -81.558731],
            [28.367819, -81.558672],
            [28.367597, -81.558629],
            [28.367545, -81.558624],
            [28.367536, -81.558527],
            [28.367489, -81.558425],
            [28.367446, -81.558366],
            [28.367451, -81.558259],
            [28.367409, -81.558205],
            [28.367404, -81.558114],
            [28.367451, -81.557921],
            [28.367484, -81.557744],
            [28.367404, -81.557647],
            [28.367309, -81.557556],
            [28.367206, -81.557444],
            [28.367130, -81.557299],
            [28.367092, -81.557186],
            [28.367054, -81.557063],
            [28.367017, -81.556912],
            [28.366998, -81.556714],
            [28.367035, -81.556312],
        ],
        totalDistance: 0.58
    },
    "boardwalk-epcot": {
        coords: [
            [28.367035, -81.556312],
            [28.374700, -81.549400],
        ],
        totalDistance: 0.8
    },
    "contemporary-magickingdom": {
        coords: [
            [28.415360, -81.574813],
            [28.417700, -81.581200],
        ],
        totalDistance: 0.5
    },
    "grandfloridian-magickingdom": {
        coords: [
            [28.412019, -81.587447],
            [28.417700, -81.581200],
        ],
        totalDistance: 1.0
    }
};

function initMap() {
    map = L.map('map').setView(startPoints.boardwalk.coord, 13);
    // Use Esri World Imagery (satellite) tiles
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(map);

    customRoute = predefinedRoutes["boardwalk-hollywoodstudios"];
    routeLine = L.polyline(customRoute.coords, { color: 'blue' }).addTo(map);
    marker = L.marker(customRoute.coords[0]).addTo(map);
    map.fitBounds(routeLine.getBounds());
    updateProgressDisplay();
}

function populateEndPoints() {
    const startKey = document.getElementById('startSelect').value;
    const endSelect = document.getElementById('endSelect');
    endSelect.innerHTML = '';

    endPoints[startKey].forEach((endpoint, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = endpoint.name;
        endSelect.appendChild(option);
    });
    updateRoute();
}

function calculateDistance(pos1, pos2) {
    const R = 6371;
    const dLat = (pos2.lat - pos1.lat) * Math.PI / 180;
    const dLng = (pos2.lng - pos1.lng) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) * 
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function getPositionOnRoute(distance) {
    let totalRouteLength = 0;
    let segmentDistances = [];
    
    for (let i = 1; i < customRoute.coords.length; i++) {
        const segmentLength = L.latLng(customRoute.coords[i-1]).distanceTo(L.latLng(customRoute.coords[i])) / 1000;
        segmentDistances.push(segmentLength);
        totalRouteLength += segmentLength;
    }

    const progressRatio = Math.min(distance / customRoute.totalDistance, 1);
    let distanceAlongRoute = progressRatio * totalRouteLength;
    
    let accumulatedDistance = 0;
    for (let i = 0; i < segmentDistances.length; i++) {
        if (accumulatedDistance + segmentDistances[i] >= distanceAlongRoute) {
            const segmentProgress = (distanceAlongRoute - accumulatedDistance) / segmentDistances[i];
            const lat = customRoute.coords[i][0] + (customRoute.coords[i+1][0] - customRoute.coords[i][0]) * segmentProgress;
            const lng = customRoute.coords[i][1] + (customRoute.coords[i+1][1] - customRoute.coords[i][1]) * segmentProgress;
            return [lat, lng];
        }
        accumulatedDistance += segmentDistances[i];
    }
    return customRoute.coords[customRoute.coords.length - 1];
}

function updateProgressDisplay() {
    const progressKm = Math.min(totalDistance, customRoute.totalDistance);
    const progressPercent = (progressKm / customRoute.totalDistance) * 100;
    document.getElementById('progress').innerText = 
        `Progress on Custom Route (${customRoute.totalDistance.toFixed(2)} km): ${progressKm.toFixed(2)} km / ${progressPercent.toFixed(1)}%`;
    document.getElementById('progressBar').value = progressPercent;

    const newPosition = getPositionOnRoute(totalDistance);
    marker.setLatLng(newPosition);
    map.panTo(newPosition);
}

function updateDistance(position) {
    const { latitude, longitude } = position.coords;
    const currentPosition = { lat: latitude, lng: longitude };

    if (lastPosition) {
        const distance = calculateDistance(lastPosition, currentPosition);
        totalDistance += distance;
        document.getElementById('distance').innerText = `Distance: ${totalDistance.toFixed(2)} km`;
        updateProgressDisplay();
    }
    lastPosition = currentPosition;
}

function startTracking() {
    if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
            updateDistance,
            (error) => alert("Error getting location: " + error.message),
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
        document.getElementById("startButton").disabled = true;
        document.getElementById("stopButton").disabled = false;
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

function stopTracking() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
        document.getElementById("startButton").disabled = false;
        document.getElementById("stopButton").disabled = true;
    }
}

function updateRoute() {
    const startKey = document.getElementById('startSelect').value;
    const endIndex = document.getElementById('endSelect').value;
    const routeKey = `${startKey}-${endPoints[startKey][endIndex].name.toLowerCase().replace(" ", "")}`;
    customRoute = predefinedRoutes[routeKey] || { 
        coords: [startPoints[startKey].coord, endPoints[startKey][endIndex].coord], 
        totalDistance: L.latLng(startPoints[startKey].coord).distanceTo(L.latLng(endPoints[startKey][endIndex].coord)) / 1000 
    };

    routeLine.setLatLngs(customRoute.coords);
    marker.setLatLng(customRoute.coords[0]);
    map.fitBounds(routeLine.getBounds());

    if (!watchId) {
        totalDistance = 0;
        lastPosition = null;
        document.getElementById('distance').innerText = `Distance: 0.00 km`;
    }
    updateProgressDisplay();
}

initMap();
populateEndPoints();
document.getElementById('startButton').addEventListener('click', startTracking);
document.getElementById('stopButton').addEventListener('click', stopTracking);
document.getElementById('startSelect').addEventListener('change', populateEndPoints);
document.getElementById('endSelect').addEventListener('change', updateRoute);
document.getElementById('updateRouteButton').addEventListener('click', updateRoute);
document.getElementById('stopButton').disabled = true;