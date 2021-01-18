var InforObj = [];

function initMap() {

    var markersOnMap = [{
        placeName: 'Acuario Gijón',
        LatLng: [{
            lat: 43.542194,
            lng: -5.676875
        }],
        desc: 'Descripción del acuario'

    }, {
        placeName: 'Barcelona',
        LatLng: [{
            lat: 41.390205,
            lng: 2.154007
        }],
        desc: 'Welcome to BCN'

    }];

    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 40.4115686, lng: -3.7062537 },
        zoom: 6,
    });
    addMarkerInfo();


    function addMarkerInfo() {
        for (var i = 0; i < markersOnMap.length; i++) {
            var contentString =
                "<div><strong>" +
                markersOnMap[i].placeName +
                "</strong><br>" +
                markersOnMap[i].desc +
                "</div>"

            const marker = new google.maps.Marker({
                position: markersOnMap[i].LatLng[0],
                map: map
            });

            const infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            marker.addListener('click', function() {
                closeOtherInfo();
                infowindow.open(map, marker);
                InforObj[0] = infowindow;
            });
        }
    }

    function closeOtherInfo() {
        if (InforObj.length > 0) {
            InforObj[0].set('marker', null);
            InforObj[0].close();
            InforObj[0].length = 0;
        }
    }

    // Create the search box and link it to the UI element.
    const input = document.getElementById("pac-input");
    const searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
    });
    let markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }
        // Clear out the old markers.
        markers.forEach((marker) => {
            marker.setMap(null);
        });
        markers = [];
        // For each place, get the icon, name and location.
        const bounds = new google.maps.LatLngBounds();
        places.forEach((place) => {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            const icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25),
            };
            // Create a marker for each place.
            markers.push(
                new google.maps.Marker({
                    map,
                    icon,
                    title: place.name,
                    position: place.geometry.location,
                })
            );

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });

}