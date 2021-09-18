function initMap() {

    var markers = new Array(0);
    var dataPoints = new Array(0);

    mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VrYXBlayIsImEiOiJja3J3MDc5aDUwYnVtMnZuODI3bnN4bWo4In0.Y7ifVj3T99VpyiLNuLEVnQ';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [35.374668, 32.796048],
        zoom: 6
    });

    function loadMarkersData(){
        //fetch
        for (var i = 0; i < markers.length; i++){
            markers[i].addTo(map);
        }
    }

    map.on('load', () => {
        $.get("http://localhost:6002/api/Routes/GetAllRoutesInfo",{time:"2018-11-24T15:46:18.152Z"})
        .done(function (jsonResponse) {
          for (var i = 0; i < jsonResponse.length; i++) 
          {
              markers[i]=new mapboxgl.Marker({ color: 'green' })
                                    .setLngLat([jsonResponse[i].StartLng, jsonResponse[i].StartLat])
                                    .setPopup(new mapboxgl.Popup({offset: 25})
                                    .setText(jsonResponse[i].RouteName + " Route length:" + jsonResponse[i].RouteLength
                                    + " Route type:" + jsonResponse[i].RouteType
                                    + " Route difficulty:" + jsonResponse[i].RouteDifficulty
                                    ));
          }
          loadMarkersData();
        })
        .fail(function (jqxhr, textStatus, error) {
          var err = textStatus + ", " + error;
          alert("Request Failed: " + err);
        });

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

    function clearAll() {
        for (var i = 0; i < markers.length; i++){
            markers[i].remove();
        }

        map.removeLayer("earthquakes-layer");
        map.removeSource("earthquakes");
    }

    loadMarkersData();


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
