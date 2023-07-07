// ------------------------------------------------Setting Map------------------------------------------------
mapboxgl.accessToken = 'pk.eyJ1Ijoici1tYWhhcnNoIiwiYSI6ImNsanF4cDI4ZDA5Y2ozbG80MWplMW5tMmkifQ.a1bn9Rbia-YVClKGHN2N3g';

// Creating map object
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11'
});

// Adding zoom and rotation controls
map.addControl(new mapboxgl.NavigationControl(),'bottom-right');

// Adding Directions control
var directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    unit: 'metric',
    profile: 'mapbox/driving'
});
map.addControl(directions, 'top-left');

var originInput = document.getElementById('origin');
var destinationInput = document.getElementById('destination');

function searchLocation(modeId) {
    var origin = originInput.value;
    var destination = destinationInput.value;
    directions.setOrigin(origin);
    directions.setDestination(destination);
    setTimeout(function () {
        var originCoordinates = directions.getOrigin().geometry.coordinates;
        var destinationCoordinates = directions.getDestination().geometry.coordinates;
        geocodeCoordinates(originCoordinates, function (originPlaceName) {
            geocodeCoordinates(destinationCoordinates, function (destinationPlaceName) {
                console.log('Origin:', originPlaceName);
                console.log('Destination:', destinationPlaceName);
            });
        });
    }, 2000);
    
    // ------------------------------------------------UI update------------------------------------------------
    
    const modes=document.querySelectorAll('.modes');
    for(let mode of modes){
        mode.classList.remove('active');
    }
    document.querySelector(`#${modeId}`).classList.add('active');
    
};

function geocodeCoordinates(coordinates, callback) {
    var geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${mapboxgl.accessToken}`;
    fetch(geocodingUrl)
        .then(response => response.json())
        .then(data => {
            var placeName = data.features[0].place_name;
            callback(placeName);
        })
        .catch(error => {
            console.log('Error:', error);
        });
}
