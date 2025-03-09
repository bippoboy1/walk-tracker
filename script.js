let totalDistance = 0;
let lastPosition = null;
let watchId = null;
let map, routeLine, marker;
let selectedRoute = null;

// Predefined routes (replace with your coordinates)
const routes = {
    cornwall: {
        name: "Cornwall Coastal Path",
        totalDistance: 10, // km
        coords: [
  [28.367063928920288,-81.5562634479438],
  [28.36701200595337,-81.5564512279151],
  [28.36697424377963,-81.55660681703417],
  [28.366969523506977,-81.55672485015899],
  [28.36699312486818,-81.55695018612452],
  [
    28.367030887035177,
    -81.5570789495334
  ],
  [
    28.367063928920288,
    -81.55721307808433
  ],
  [
    28.367139453190443,
    -81.55737403234545
  ],
  [
    28.36722441793013,
    -81.5574867003282
  ],
  [
    28.367290501569542,
    -81.5575725426008
  ],
  [
    28.367403787712764,
    -81.55768521058359
  ],
  [
    28.367512353486493,
    -81.5577871482823
  ],
  [
    28.367498192739703,
    -81.55788372083893
  ],
  [
    28.36746043073901,
    -81.55796956311154
  ],
  [
    28.367408507966104,
    -81.55807686595229
  ],
  [
    28.367384906697264,
    -81.5581948990771
  ],
  [
    28.36730466234407,
    -81.5581948990771
  ],
  [
    28.367262180014844,
    -81.5582539156395
  ],
  [
    28.367257459754992,
    -81.55830756705986
  ],
  [
    28.36729522182792,
    -81.55838804419044
  ],
  [
    28.36722441793013,
    -81.55841486990062
  ],
  [
    28.367191376095022,
    -81.55838804419044
  ],
  [
    28.367111131595443,
    -81.55832902762803
  ],
  [
    28.36699312486818,
    -81.55825928078151
  ],
  [
    28.366960082961036,
    -81.55824318535544
  ],
  [
    28.366875118009673,
    -81.55807150081024
  ],
  [
    28.366700467618248,
    -81.55794810254339
  ],
  [
    28.366544698107724,
    -81.55782470427656
  ],
  [
    28.366426690750533,
    -81.55773886200396
  ],
  [
    28.366313403564163,
    -81.55763692430526
  ],
  [
    28.36619067564247,
    -81.55744377919194
  ],
  [
    28.366039625697802,
    -81.55731501578303
  ],
  [
    28.365841372319174,
    -81.55718088723212
  ],
  [
    28.36569032187732,
    -81.5570789495334
  ],
  [
    28.365558152564322,
    -81.55706285410729
  ],
  [
    28.365326855870453,
    -81.55703066325509
  ],
  [
    28.365208847158957,
    -81.557019932971
  ],
  [
    28.3649209053522,
    -81.55682678785769
  ],
  [
    28.364769853600134,
    -81.5567141198749
  ],
  [
    28.36461408125563,
    -81.55660681703417
  ],
  [
    28.36448663098553,
    -81.5565370701877
  ],
  [
    28.364396943666677,
    -81.5564512279151
  ],
  [
    28.364288374705573,
    -81.55640294163678
  ],
  [
    28.364156203646502,
    -81.55634929021639
  ],
  [
    28.363939065120682,
    -81.55632246450621
  ],
  [
    28.363721926150575,
    -81.55626881308585
  ],
  [
    28.363551990994516,
    -81.55617760567122
  ],
  [
    28.363396216862416,
    -81.55605420740436
  ],
  [
    28.363292367313996,
    -81.55591471371139
  ],
  [
    28.363160195014483,
    -81.55582350629678
  ],
  [
    28.362980818059015,
    -81.55570547317197
  ],
  [
    28.36279672034208,
    -81.55560890061528
  ],
  [
    28.362560697160934,
    -81.555565979479
  ],
  [
    28.362367157760715,
    -81.55550159777457
  ],
  [
    28.3621122516707,
    -81.5554103867399
  ],
  [
    28.361956475425412,
    -81.55532454446731
  ],
  [
    28.361819580960482,
    -81.55527625818897
  ],
  [
    28.361649642758394,
    -81.55531381418322
  ],
  [
    28.36146082221472,
    -81.55542111702398
  ],
  [
    28.361347529727286,
    -81.55554451529083
  ],
  [
    28.361224796062785,
    -81.55561962727933
  ],
  [
    28.36109262118842,
    -81.55569473926785
  ],
  [
    28.36088491748186,
    -81.55574302554619
  ],
  [
    28.360663051709984,
    -81.55579667696657
  ],
  [
    28.360540317253957,
    -81.55590934494931
  ],
  [
    28.360436464911103,
    -81.55607029921045
  ],
  [
    28.360393979832455,
    -81.55617223690915
  ],
  [
    28.360299568485708,
    -81.55626344432376
  ],
  [
    28.360124907272812,
    -81.55631709574413
  ],
  [
    28.359893598737717,
    -81.55641366830082
  ],
  [
    28.359723657451966,
    -81.55643512886896
  ],
  [
    28.359591480708275,
    -81.55637611230654
  ],
  [
    28.359350729787906,
    -81.55642976372691
  ],
  [
    28.359218552579804,
    -81.55649414543137
  ],
  [
    28.359072213336024,
    -81.55654779685172
  ],
  [
    28.35894003578111,
    -81.55656389227784
  ],
  [
    28.358878667574672,
    -81.55677313281727
  ],
  [
    28.35882201996802,
    -81.55697700821467
  ],
  [
    28.358741769140156,
    -81.55730428187893
  ],
  [
    28.358722886583614,
    -81.55755107841263
  ],
  [
    28.358746489778774,
    -81.55766374639539
  ],
  [
    28.358722886583614,
    -81.55778714466226
  ],
  [
    28.358708724663988,
    -81.55784616122466
  ],
  [
    28.35858598794819,
    -81.55785689150872
  ],
  [
    28.358482133693187,
    -81.55786225665078
  ],
  [
    28.358359396715386,
    -81.5579534640654
  ],
  [
    28.358255542238684,
    -81.55806076690612
  ],
  [
    28.358203614962243,
    -81.55812514861057
  ],
  [
    28.358293307514714,
    -81.55824318173539
  ],
  [
    28.358425485874914,
    -81.55838267542835
  ],
  [
    28.35847269239223,
    -81.5584631525589
  ],
  [
    28.358444368484356,
    -81.55853289940538
  ],
  [
    28.358416044568923,
    -81.55864020224612
  ],
  [
    28.35837827933658,
    -81.55867775824038
  ]
]
        
    },
    centralPark: {
        name: "Central Park Loop",
        totalDistance: 3, // km
        coords: [
            [40.7650, -73.9750], // SW Corner
            [40.7730, -73.9700], // Bethesda Terrace
            [40.7800, -73.9650]  // NE Corner
        ]
    },
    thames: {
        name: "Thames Path Snippet",
        totalDistance: 5, // km
        coords: [
            [51.5055, -0.0754], // Tower Bridge
            [51.5033, -0.1195], // London Eye
            [51.5007, -0.1357]  // Westminster
        ]
    }
};

// Initialize the map with the default route
function initMap() {
    selectedRoute = routes.cornwall; // Default route
    map = L.map('map').setView(selectedRoute.coords[0], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    routeLine = L.polyline(selectedRoute.coords, { color: 'blue' }).addTo(map);
    marker = L.marker(selectedRoute.coords[0]).addTo(map);
    map.fitBounds(routeLine.getBounds());

    updateProgressDisplay(); // Show initial progress
}

// Calculate distance between two points (Haversine formula)
function calculateDistance(pos1, pos2) {
    const R = 6371; // Earth's radius in km
    const dLat = (pos2.lat - pos1.lat) * Math.PI / 180;
    const dLng = (pos2.lng - pos1.lng) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) * 
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Interpolate position along the route based on distance walked
function getPositionOnRoute(distance) {
    let totalRouteLength = 0;
    let segmentDistances = [];
    
    for (let i = 1; i < selectedRoute.coords.length; i++) {
        const segmentLength = L.latLng(selectedRoute.coords[i-1]).distanceTo(L.latLng(selectedRoute.coords[i])) / 1000; // km
        segmentDistances.push(segmentLength);
        totalRouteLength += segmentLength;
    }

    const progressRatio = Math.min(distance / selectedRoute.totalDistance, 1);
    let distanceAlongRoute = progressRatio * totalRouteLength;
    
    let accumulatedDistance = 0;
    for (let i = 0; i < segmentDistances.length; i++) {
        if (accumulatedDistance + segmentDistances[i] >= distanceAlongRoute) {
            const segmentProgress = (distanceAlongRoute - accumulatedDistance) / segmentDistances[i];
            const lat = selectedRoute.coords[i][0] + (selectedRoute.coords[i+1][0] - selectedRoute.coords[i][0]) * segmentProgress;
            const lng = selectedRoute.coords[i][1] + (selectedRoute.coords[i+1][1] - selectedRoute.coords[i][1]) * segmentProgress;
            return [lat, lng];
        }
        accumulatedDistance += segmentDistances[i];
    }
    return selectedRoute.coords[selectedRoute.coords.length - 1];
}

// Update progress text and bar
function updateProgressDisplay() {
    const progressKm = Math.min(totalDistance, selectedRoute.totalDistance);
    const progressPercent = (progressKm / selectedRoute.totalDistance) * 100;
    document.getElementById("progress").innerText = 
        `Progress on ${selectedRoute.name} (${selectedRoute.totalDistance} km): ${progressKm.toFixed(2)} km / ${progressPercent.toFixed(1)}%`;
    document.getElementById("progressBar").value = progressPercent;

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
        document.getElementById("distance").innerText = `Distance: ${totalDistance.toFixed(2)} km`;
        updateProgressDisplay();
    }
    lastPosition = currentPosition;
}

function startTracking() {
    if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
            updateDistance,
            (error) => {
                alert("Error getting location: " + error.message);
            },
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

// Handle route selection
function changeRoute() {
    const routeKey = document.getElementById("routeSelect").value;
    selectedRoute = routes[routeKey];
    
    // Update map
    routeLine.setLatLngs(selectedRoute.coords);
    marker.setLatLng(selectedRoute.coords[0]);
    map.fitBounds(routeLine.getBounds());
    
    // Reset progress if tracking hasn’t started
    if (!watchId) {
        totalDistance = 0;
        lastPosition = null;
        document.getElementById("distance").innerText = `Distance: 0.00 km`;
    }
    updateProgressDisplay();
}

// Initialize map and event listeners
initMap();
document.getElementById("startButton").addEventListener("click", startTracking);
document.getElementById("stopButton").addEventListener("click", stopTracking);
document.getElementById("routeSelect").addEventListener("change", changeRoute);
document.getElementById("stopButton").disabled = true;