let viewPort;

function initMap() {

    var markers = new Map();
    const initialZoom = 8;
    const routeListZoom = 11;
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
    viewPort = new ViewPort(map);
    var currentZoom = document.getElementById('zoom_id');
    currentZoom.textContent = initialZoom;

    map.on('zoom', () => {
        currentZoom.textContent = map.getZoom();
    });

    map.on('load', () => {
        initializeMap();
    });

    var allRoutesInfoGeoJson = ""

    function initializeMap() {
        $.get(routesApi + "GetAllRoutesInfo")
            .done(function (jsonResponse) {
                allRoutesInfoGeoJson = JSON.parse(jsonResponse);

                for (let i = 0; i < allRoutesInfoGeoJson.features.length; i++) {
                    const pointGeometry = allRoutesInfoGeoJson.features[i].geometry;
                    const pointProps = allRoutesInfoGeoJson.features[i].properties;
                    createAllRoutesMarkers(pointGeometry, pointProps, i);
                }

                map.flyTo({
                    center: allRoutesInfoGeoJson.features[0].geometry.coordinates,
                    zoom: initialZoom
                });
                loadMarkersData();
                showAllRoutesList();
            })
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                alert("Request Failed: " + err);
            });
    }

    function createAllRoutesMarkers(pointGeometry, pointProps) {
        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            offset: 25
        }).setHTML(`<h3>Name: ${pointProps.RouteName}</h3> 
                    <p>Type:${pointProps.RouteType}</p> 
                    <p>Length:${pointProps.RouteLength}</p>
                    <p>Difficulty:${pointProps.RouteDifficulty}</p>
                    <p>Elevation gain:${pointProps.ElevationGain}</p>`);


        const routeMarker = new mapboxgl.Marker({
                color: 'green'
            })
            .setLngLat([pointGeometry.coordinates[0], pointGeometry.coordinates[1]])
            .setPopup(popup);

        const markerDiv = routeMarker.getElement();

        markerDiv.addEventListener('mouseenter', () => routeMarker.togglePopup());
        markerDiv.addEventListener('mouseleave', () => routeMarker.togglePopup());

        markerDiv.addEventListener('click', () => {
            routeMarker.togglePopup();
            $.get(routesApi + "GetRouteGeoJsonByName", {
                    routeName: pointProps.RouteName
                })
                .done(function (jsonResponse) {
                    var geoJsonStr = JSON.parse(jsonResponse);

                    viewPort.updateView(geoJsonStr);
                    clearRouteLayer();
                    clearAllRoutesList();

                    map.addSource('route', {
                        'type': 'geojson',
                        'data': geoJsonStr
                    });

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
                            'line-width': 5
                        }
                    });
                });
        });

        markers.set(pointProps.RouteName, routeMarker);
    }

    function clearRouteLayer() {
        var all_layers = new Array(0);
        for (let j = 0; j < map.getStyle().layers.length; j++) {
            all_layers.push(map.getStyle().layers[j].id)
        }
        if (all_layers.includes("route-layer")) {
            map.removeLayer("route-layer");
            map.removeSource("route");
        }
    }

    function loadMarkersData() {
        for (const value of markers.values()) {
            value.addTo(map);
        }
    }

    function clearAll() {
        for (const value of markers.values()) {
            value.remove();
        }

        clearRouteLayer();
        markers.clear();
        clearAllRoutesList();
    }

    function showAllRoutesList() {
        let list = document.getElementById("all_routes_list");

        for (const [key, value] of markers) {
            let li = document.createElement("li");
            li.innerText = key;

            li.addEventListener('mouseover', () => {
                // Highlight corresponding feature on the map
                map.flyTo({
                    center: value.getLngLat(),
                    zoom: routeListZoom
                });
                value.togglePopup();
            });

            li.addEventListener('mouseout', () => {
                // Highlight corresponding feature on the map
                value.togglePopup();
            });

            list.appendChild(li);
        }
    }

    function clearAllRoutesList() {
        document.getElementById("all_routes_list").innerHTML = '';
    }

    $(document).ready(function () {
        $("#fileUpload").on('change', function () {
            var files = $('#fileUpload').prop("files");                
            var url = routesApi + "UploadRouteFile?" + "routeName=justname" + "&" + "difficulty=2" + "&" + "routeType=2";
            formData = new FormData();
            formData.append("routeFile", files[0]);

            jQuery.ajax({
                type: 'POST',
                url: url,
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                success: function (repo) {
                    if (repo.status == "success") {
                        alert("File : " + repo.filename + " is uploaded successfully");
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                  }
            });
        }); 

        $("#clear_all").click(function () {
            clearAll();
        });

        $("#show_all_routes_markers").click(function () {
            clearAll();
            initializeMap();
        });
    });
}