function initMap() {

    var markers = new Array(0);
    var dataPoints = new Array(0);
    var route = new Array(0);

    mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VrYXBlayIsImEiOiJja3J3MDc5aDUwYnVtMnZuODI3bnN4bWo4In0.Y7ifVj3T99VpyiLNuLEVnQ';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [12.550343, 55.665957],
        zoom: 4
    });

    map.on('load', () => {
        map.addSource('earthquakes', {
            type: 'geojson',
            // Use a URL for the value for the `data` property.
            data: 'https://datahub.io/examples/geojson-tutorial/r/0.geojson'
        });

        map.addLayer({
            'id': 'earthquakes-layer',
            'type': 'line',
            'source': 'earthquakes',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint':
                {
                    'line-color': '#222',
                    'line-width': 4
                }
        });
    });
    // Create a default Marker and add it to the map.
    /* const marker1 = new mapboxgl.Marker()
        .setLngLat([12.554729, 55.70651])
        .addTo(map); */

    markers[0]=new mapboxgl.Marker()
        .setLngLat([12.554729, 55.70651]);
    // Create a default Marker, colored black, rotated 45 degrees.
    /* const marker2 = new mapboxgl.Marker({ color: 'black', rotation: 45 })
        .setLngLat([12.65147, 55.608166])
        .addTo(map); */
    markers[1]=new mapboxgl.Marker({ color: 'black', rotation: 45 })
        .setLngLat([12.65147, 55.608166]).setPopup(new mapboxgl.Popup({offset: 25})
            .setText('Construction on the Washington Monument began in 1848.'));

    function clearAll() {
        for (var i = 0; i < markers.length; i++){
            markers[i].remove();
        }

        map.removeLayer("earthquakes-layer");
        map.removeSource("earthquakes");
    }

    function loadMapData(){
        //fetch
        for (var i = 0; i < markers.length; i++){
            markers[i].addTo(map);
        }
    }

    loadMapData();


    $(document).ready(function() {
        $("#clear_all").click(function () {
            clearAll();
        });

        $("#get_points").click(function () {
//{ version: "5", language: "php" }
            clearAll();
            $.get("https://datahub.io/examples/geojson-tutorial/r/0.geojson",{time:"2018-11-24T15:46:18.152Z"})
                .done(function (jsonResponse) {
                    dataPoints = [];

                    console.log(jsonResponse)
                })
                .fail(function (jqxhr, textStatus, error) {
                    var err = textStatus + ", " + error;
                    alert("Request Failed: " + err);
                });
        });

    });

}
