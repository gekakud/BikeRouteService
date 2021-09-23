function initMap() {

    var markers = new Array(0);
    var dataPoints = new Array(0);
    const initialZoom = 7.5;
    const routesApi = "http://localhost:6002/api/Routes/";

    mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VrYXBlayIsImEiOiJja3J3MDc5aDUwYnVtMnZuODI3bnN4bWo4In0.Y7ifVj3T99VpyiLNuLEVnQ';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [35.374668, 32.796048],
        zoom: initialZoom
    });

    var currentZoom = document.getElementById('zoom_id');
    currentZoom.textContent = initialZoom;

    map.on('zoom', () => {
        currentZoom.textContent = map.getZoom();
    });

    var allRoutesInfoGeoJson = ""
    map.on('load', () => {
        $.get(routesApi + "GetAllRoutesInfo")
            .done(function (jsonResponse) {
                allRoutesInfoGeoJson = JSON.parse(jsonResponse);

                for (var i = 0; i < allRoutesInfoGeoJson.features.length; i++) {
                    var pointGeometry = allRoutesInfoGeoJson.features[i].geometry;
                    var pointProps = allRoutesInfoGeoJson.features[i].properties;
                    markers[i] = new mapboxgl.Marker({
                            color: 'green'
                        })
                        .setLngLat([pointGeometry.coordinates[0], pointGeometry.coordinates[1]])
                        .setPopup(new mapboxgl.Popup({
                                offset: 25
                            })
                            .setText(pointProps.RouteName + " Route length:" + pointProps.RouteLength +
                                " Route type:" + pointProps.RouteType +
                                " Route difficulty:" + pointProps.RouteDifficulty
                            ));

                    markers[i].getElement().addEventListener('click', () => {
                        map.flyTo({center: pointGeometry.coordinates});
                    });
                }
                map.flyTo({center: allRoutesInfoGeoJson.features[0].geometry.coordinates});

                // map.addSource('points', {
                //     'type': 'geojson',
                //     'data': allRoutesInfoGeoJson
                // });

                // // Add a circle layer
                // map.addLayer({
                //     'id': 'circle',
                //     'type': 'circle',
                //     'source': 'points',
                //     'paint': {
                //         'circle-color': '#4264fb',
                //         'circle-radius': 8,
                //         'circle-stroke-width': 2,
                //         'circle-stroke-color': '#ffffff'
                //     }
                // });
                // // Center the map on the coordinates of any clicked circle from the 'circle' layer.
                // map.on('click', 'circle', (e) => {
                //     map.flyTo({
                //         center: e.features[0].geometry.coordinates
                //     });
                //     // map.fitBounds([
                //     //     [32.958984, -5.353521], // southwestern corner of the bounds
                //     //     [43.50585, 5.615985] // northeastern corner of the bounds
                //     //     ]);
                // });

                // // Change the cursor to a pointer when the it enters a feature in the 'circle' layer.
                // map.on('mouseenter', 'circle', () => {
                //     map.getCanvas().style.cursor = 'pointer';
                // });

                // // Change it back to a pointer when it leaves.
                // map.on('mouseleave', 'circle', () => {
                //     map.getCanvas().style.cursor = '';
                // });
                loadMarkersData();
            })
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                alert("Request Failed: " + err);
            });
    });

    function loadMarkersData() {
        //fetch
        for (var i = 0; i < markers.length; i++) {
            markers[i].addTo(map);
        }
    }

    function clearAll() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].remove();
        }

        map.removeLayer("earthquakes-layer");
        map.removeSource("earthquakes");
    }

    loadMarkersData();


    $(document).ready(function () {
        $("#clear_all").click(function () {
            clearAll();
        });

        $("#get_points").click(function () {
            //{ version: "5", language: "php" }
            clearAll();
            $.get("https://datahub.io/examples/geojson-tutorial/r/0.geojson", {
                    time: "2018-11-24T15:46:18.152Z"
                })
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