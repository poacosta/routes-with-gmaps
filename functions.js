function initMap() {
    var markerArray = [];
    // Define center of the map
    var monterrey = new google.maps.LatLng(25.6707612, -100.3085279);

    //Create map
    map = new google.maps.Map(document.getElementById('map'), {
        center: monterrey,
        zoom: 17
    });
    // Or:
    // var mapOptions = { zoom: 17, center: { lat: 25.6707612, lng: -100.3085279 } };
    // map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Instantiate a directions service.
    var directionsService = new google.maps.DirectionsService();

    // Instantiate a distance matrix service.
    var directionsDistance = new google.maps.DistanceMatrixService();

    // Create a renderer for directions and bind it to the map.
    var directionsRenderer = new google.maps.DirectionsRenderer({
        map: map
    });

    // Instantiate an info window to hold step text.
    var stepDisplay = new google.maps.InfoWindow();

    // Display the route between the initial start and end selections.
    calculateAndDisplayRoute(directionsRenderer, directionsService, markerArray, stepDisplay, map);

    // Display the distance between the initial start and end selections.
    getDistance(directionsDistance);

    // Listen to change events from the start and end lists.
    var onChangeHandler = function () {
        calculateAndDisplayRoute(directionsRenderer, directionsService, markerArray, stepDisplay, map);
        getDistance(directionsDistance);
    };

    // Add listeners
    document.getElementById('start').addEventListener('change', onChangeHandler);
    document.getElementById('end').addEventListener('change', onChangeHandler);
}

function calculateAndDisplayRoute(directionsRenderer, directionsService,
    markerArray) {
    // First, remove any existing markers from the map.
    for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    }

    directionsService.route({
        origin: document.getElementById('start').value,
        destination: document.getElementById('end').value,
        travelMode: 'DRIVING'
    }, function (response, status) {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

function getDistance(directionsDistance) {
    directionsDistance.getDistanceMatrix({
        origins: [document.getElementById('start').value],
        destinations: [document.getElementById('end').value],
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.IMPERIAL
    }, function (response, status) {
        if (status == 'OK') {
            var origins = response.originAddresses;
            // var destinations = response.destinationAddresses;

            for (var i = 0; i < origins.length; i++) {
                var results = response.rows[i].elements;
                document.getElementById('distance').innerHTML = results[0].distance.text;
            }
        }
    });
}
