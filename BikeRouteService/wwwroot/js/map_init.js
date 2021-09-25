function initMap() {

    var markers = new Array(0);
    const initialZoom = 7.5;
    const routesApi = "http://localhost:6002/api/Routes/";

    mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VrYXBlayIsImEiOiJja3J3MDc5aDUwYnVtMnZuODI3bnN4bWo4In0.Y7ifVj3T99VpyiLNuLEVnQ';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [35.374668, 32.796048],
        zoom: initialZoom
    });
    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());
    
    var currentZoom = document.getElementById('zoom_id');
    currentZoom.textContent = initialZoom;

    map.on('zoom', () => {
        currentZoom.textContent = map.getZoom();
    });

    map.on('load', () => {
        initializeMap();
    });
    
    var allRoutesInfoGeoJson = ""
    function initializeMap(){
        $.get(routesApi + "GetAllRoutesInfo")
            .done(function (jsonResponse) {
                allRoutesInfoGeoJson = JSON.parse(jsonResponse);

                for (let i = 0; i < allRoutesInfoGeoJson.features.length; i++) {
                    const pointGeometry = allRoutesInfoGeoJson.features[i].geometry;
                    const pointProps = allRoutesInfoGeoJson.features[i].properties;

                    const popup = new mapboxgl.Popup({
                        closeButton: false,
                        closeOnClick: false,
                        offset: 25
                    }).setHTML(`<h3>${pointProps.RouteName}</h3> <p>${pointProps.RouteType}</p> <p>${pointProps.RouteLength}</p><p>${pointProps.RouteDifficulty}</p>`);

                    markers[i] = new mapboxgl.Marker({color: 'green'})
                        .setLngLat([pointGeometry.coordinates[0], pointGeometry.coordinates[1]])
                        .setPopup(popup);

                    const markerDiv = markers[i].getElement();

                    markerDiv.addEventListener('mouseenter', () => markers[i].togglePopup());
                    markerDiv.addEventListener('mouseleave', () => markers[i].togglePopup());

                    markerDiv.addEventListener('click', () => {
                        map.flyTo({center: pointGeometry.coordinates, zoom: 14});
                        markers[i].togglePopup();
                        $.get(routesApi + "GetRouteGeoJsonByName", {routeName:pointProps.RouteName})
                            .done(function (jsonResponse) {
                                var opapa = JSON.parse(jsonResponse);

                                clearRouteLayer();

                                map.addSource('route', {
                                    'type': 'geojson',
                                    'data':opapa});

                                map.addLayer({
                                    'id': 'route-layer',
                                    'type': 'line',
                                    'source': 'route',
                                    'layout': {
                                        'line-join': 'round',
                                        'line-cap': 'round'
                                    },
                                    'paint': {
                                        'line-color': '#d43811',
                                        'line-width': 8
                                    }
                                });
                            });
                    });
                }

                map.flyTo({center: allRoutesInfoGeoJson.features[0].geometry.coordinates});
                loadMarkersData();
            })
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                alert("Request Failed: " + err);
            });
    }
    
    function clearRouteLayer(){
        var all_layers = new Array(0);
        for(let j=0;j<map.getStyle().layers.length;j++){
            all_layers.push(map.getStyle().layers[j].id)
        }
        if(all_layers.includes("route-layer")){
            map.removeLayer("route-layer");
            map.removeSource("route");
        }
    }
    
    function loadMarkersData() {
        //fetch
        for (let i = 0; i < markers.length; i++) {
            markers[i].addTo(map);
        }
    }

    function clearAll() {
        for (let i = 0; i < markers.length; i++) {
            markers[i].remove();
        }

        clearRouteLayer();
    }
    
    $(document).ready(function () {
        $("#clear_all").click(function () {
            clearAll();
        });

        $("#get_points").click(function () {
            clearAll();
            initializeMap();
        });
    });
}