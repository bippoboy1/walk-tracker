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

// Predefined routes using external coordinate files
const predefinedRoutes = {
    "boardwalk-hollywoodstudios": {
        coords: boardwalkHollywoodStudiosCoords, // Imported from routes/boardwalk-hollywoodstudios.js
        totalDistance: 1.36
    },
    "boardwalk-lake": {
        coords: boardwalkLakeCoords, // Imported from routes/boardwalk-lake.js
        totalDistance: 0.58
    },
    "boardwalk-epcot": {
    coords: boardwalkEpcotCoords,
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
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
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