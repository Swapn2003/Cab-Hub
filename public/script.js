// ------------------------------------------------Setting Map------------------------------------------------
mapboxgl.accessToken = 'pk.eyJ1Ijoici1tYWhhcnNoIiwiYSI6ImNsanF4cDI4ZDA5Y2ozbG80MWplMW5tMmkifQ.a1bn9Rbia-YVClKGHN2N3g';

// Creating map object
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11'
});

// Adding zoom and rotation controls
map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

// Adding Directions control
let directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    unit: 'metric',
    profile: 'mapbox/driving'
});
map.addControl(directions, 'top-left');

let originInput = document.querySelector('#origin');
let destinationInput = document.querySelector('#destination');
let cabFares = document.querySelector('.cab-fares');
let data;
function searchLocation(modeId) {
    cabFares.innerHTML = "";
    let origin = originInput.value;
    let destination = destinationInput.value;
    directions.setOrigin(origin);
    directions.setDestination(destination);
    setTimeout(function () {
        let originCoordinates = directions.getOrigin().geometry.coordinates;
        let destinationCoordinates = directions.getDestination().geometry.coordinates;
        geocodeCoordinates(originCoordinates, function (originPlaceName) {
            geocodeCoordinates(destinationCoordinates, function (destinationPlaceName) {
                console.log('Origin:', originPlaceName);
                console.log('Destination:', destinationPlaceName);
                data = {
                    origincoord: { lat: originCoordinates[1], lng: originCoordinates[0] },
                    originPlaceName: originPlaceName,
                    destinationPlaceName: destinationPlaceName,
                    destinationcoord: { lat: destinationCoordinates[1], lng: destinationCoordinates[0] }
                };

                fetch('http://localhost:5000/Uberprice', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }).then(response => response.json())
                    .then(result => {
                        // Handle the response result
                        result.forEach(info => {
                            let fare = document.createElement('div');
                            if (modeId === 'bike') {
                                if (info.name.includes('Moto') == false) {
                                    fare.style.display = 'none';
                                }
                                else {
                                    fare.style.display = 'flex';
                                }
                            }
                            else if (modeId === 'Taxi') {
                                if (info.name.includes('XL') == true) {
                                    fare.style.display = 'none';
                                }
                                else {
                                    fare.style.display = 'flex';
                                }
                            }
                            else {
                                if (info.name.includes('XL') == false) {
                                    fare.style.display = 'none';
                                }
                                else {
                                    fare.style.display = 'flex';
                                }
                            }
                            let cab = document.createElement('h5');
                            let price = document.createElement('p');
                            let book = document.createElement('button');
                            book.innerText = 'Login to book';
                            book.addEventListener('click', () => {
                                window.location.href = info.url;
                            })
                            cab.innerText = info.name;
                            price.innerText = info.fare;
                            fare.appendChild(cab);
                            fare.appendChild(price);
                            fare.appendChild(book);
                            cabFares.appendChild(fare);
                        });
                        let isEmpty = true;
                        cabFares.querySelectorAll('div').forEach(x => {
                            if (x.style.display != 'none') {
                                isEmpty = false;
                            }
                        })
                        if (isEmpty) {
                            let emptymsg = document.createElement('p');
                            emptymsg.innerText = `No ${modeId} available now !`
                            emptymsg.style.textAlign = 'center';
                            emptymsg.style.margin = '30px auto';
                            emptymsg.style.fontSize = '18px';
                            emptymsg.style.fontWeight = '600';
                            cabFares.appendChild(emptymsg);
                        }
                        console.log(result);
                    })
                    .catch(error => {
                        // Handle any errors
                        console.error(error);
                    });

                    
            });
        });
    }, 2000);

    // ------------------------------------------------UI update------------------------------------------------

    const modes = document.querySelectorAll('.modes');
    for (let mode of modes) {
        mode.classList.remove('active');
    }
    document.querySelector(`#${modeId}`).classList.add('active');

};

function geocodeCoordinates(coordinates, callback) {
    let geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${mapboxgl.accessToken}`;
    fetch(geocodingUrl)
        .then(response => response.json())
        .then(data => {
            let placeName = data.features[0].place_name;
            callback(placeName);
        })
        .catch(error => {
            console.log('Error:', error);
        });
}
