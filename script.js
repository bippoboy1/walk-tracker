let totalDistance = 0;
let lastPosition = null;
let watchId = null;
let map, routeLine, marker;
let customRoute = { coords: [], totalDistance: 5 }; // Default route

// Starting points (updated to your coordinates)
const startPoints = {
    boardwalk: { name: "Boardwalk Resort", coord: [28.367049768113652, -81.55626872475698] },
    contemporary: { name: "Contemporary", coord: [28.41536015750347, -81.57481301542497] },
    grandFloridian: { name: "Grand Floridian", coord: [28.41201873329078, -81.58744656089249] }
};

// Waypoints (unchanged for now—update these if you want Disney-themed ones)
const waypoints = [
    { name: "Big Ben", coord: [51.5007, -0.1246] },
    { name: "Statue of Liberty", coord: [40.6892, -74.0445] },
    { name: "Louvre", coord: [48.8606, 2.3376] },
    { name: "Times Square", coord: [40.7580, -73.9855] },
    { name: "Notre-Dame", coord: [48.8529, 2.3500] },
    { name: "Buckingham Palace", coord: [51.5014, -0.1419] }
];

function initMap() {
    map = L.map('map').setView(startPoints.boardwalk.coord, 13); // Default to Boardwalk
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    customRoute.coords = [startPoints.boardwalk.coord];
    routeLine = L.polyline(customRoute.coords, { color: 'blue' }).addTo(map);
    marker = L.marker(customRoute.coords[0]).addTo(map);
    map.fitBounds(routeLine.getBounds());
    updateProgressDisplay();
}

function populateWaypoints() {
    const ul = document.getElementById('waypoints');
    waypoints.forEach((waypoint, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <label>
                <input type="checkbox" value="${index}" onchange="updateRoute()">
                ${waypoint.name}
            </label>
            <div>
                <button onclick="moveWaypoint(${index}, -1)">↑</button>
                <button onclick="moveWaypoint(${index}, 1)">↓</button>
            </div>
        `;
        ul.appendChild(li);
    });
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
    const startCoord = startPoints[startKey].coord;
    customRoute.coords = [startCoord];

    const checkboxes = document.querySelectorAll('#waypoints input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        const index = parseInt(checkbox.value);
        customRoute.coords.push(waypoints[index].coord);
    });

    // Recalculate total distance
    customRoute.totalDistance = 0;
    for (let i = 1; i < customRoute.coords.length; i++) {
        customRoute.totalDistance += L.latLng(customRoute.coords[i-1]).distanceTo(L.latLng(customRoute.coords[i])) / 1000;
    }

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

function moveWaypoint(index, direction) {
    const liElements = Array.from(document.querySelectorAll('#waypoints li'));
    const currentIndex = liElements.findIndex(li => li.querySelector(`input[value="${index}"]`));
    const newIndex = currentIndex + direction;

    if (newIndex >= 0 && newIndex < liElements.length) {
        const currentLi = liElements[currentIndex];
        const targetLi = liElements[newIndex];
        if (direction > 0) {
            targetLi.after(currentLi);
        } else {
            targetLi.before(currentLi);
        }
        updateRoute();
    }
}

initMap();
populateWaypoints();
document.getElementById('startButton').addEventListener('click', startTracking);
document.getElementById('stopButton').addEventListener('click', stopTracking);
document.getElementById('startSelect').addEventListener('change', updateRoute);
document.getElementById('updateRouteButton').addEventListener('click', updateRoute);
document.getElementById('stopButton').disabled = true;