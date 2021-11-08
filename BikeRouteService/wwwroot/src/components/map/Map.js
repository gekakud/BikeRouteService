import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import ReactDOM from 'react-dom'
import { instance } from '../../api/api';
import Tooltip from './tooltip/Tooltip'
import { toast } from 'react-toastify'
// import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { Spinner } from 'react-bootstrap';
import ReactMapGL, { Marker, NavigationControl, Popup } from 'react-map-gl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
// mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VrYXBlayIsImEiOiJja3J3MDc5aDUwYnVtMnZuODI3bnN4bWo4In0.Y7ifVj3T99VpyiLNuLEVnQ';


const routeDifficultyColors = { 
  0 : 'green' , 
  1 : 'blue' ,
  2 : 'red' ,
  3 : 'black' , 
};
const routeTypeColors = { 
  //   mtb, gravel, road, mixed
  0 : 'green' , 
  1 : 'red' ,
  2 : 'black' ,
  3 : 'orange' , 
};

// const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
//   c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
//   C20.1,15.8,20.2,15.8,20.2,15.7z`;

const ICON = `M192 0C85.97 0 0 85.97 0 192c0 77.41 26.97 99.03 172.3 309.7c9.531 13.77 29.91 13.77 39.44 0C357 291 384 269.4 384 192C384 85.97 298 0 192 0zM192 271.1c-44.13 0-80-35.88-80-80S147.9 111.1 192 111.1s80 35.88 80 80S236.1 271.1 192 271.1z`;

  const pinStyle = {
    cursor: 'pointer',
    // fill: '#d00',
    stroke: 'none'
  };

const Map = ({routes, refreshMap, selectedRouteListItem, freeMapViewportHeight, setRefreshMap }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

  const [size, setSize] = useState(38)

  const [lng, setLng] = useState(35.374668);
  const [lat, setLat] = useState(32.796048);
  const [zoom, setZoom] = useState(8);
  const [loading, setLoading] = useState(false)

  const [viewport, setViewport] = useState({
    latitude: 32.796048,
    longitude: 35.374668,
    zoom: 8,
    width: "100%",
    height: `${freeMapViewportHeight}px`,
    transitionDuration: 800,
  });

  const [selectedRoute, setSelectedRoute] = useState(null)

  // const tooltipRef = useRef(new mapboxgl.Popup({
  //   closeButton: false,
  //   closeOnClick: false,
  //   offset: 25
  // }));


  const handleMarkerClick = useCallback(
    (route) => {
      setViewport(prevView => {
        return {
          ...prevView, 
          latitude: route.geometry.coordinates[1],
          longitude: route.geometry.coordinates[0],
          zoom: 15,
        }
      })

      setTimeout(() => {
        setSelectedRoute(route)
      }, 300)
      

    },
    [],
  )
  const handleMarkerEnter = useCallback(
    (route) => {
      console.log(`event enter`, route)
      setSelectedRoute(route)
    },
    [],
  )
  const handleMarkerLeave = useCallback(
    () => {
      console.log(`event leave`)
      setSelectedRoute(null)
    },
    [],
  )

  useEffect(() => {

    if (refreshMap) {
      setViewport(prev => {
        return {
          ...prev,
          width: "100%",
          height: `${freeMapViewportHeight}px`,
        }
      })

      setRefreshMap(false)
    }

  }, [refreshMap, freeMapViewportHeight, setRefreshMap])

  // useEffect(() => {
  //   setViewport(prev => {
  //     return {
  //       ...prev,
  //       width: '100%',
  //       height: `${freeMapViewportHeight}px`
  //     }
  //   })
  // }, [freeMapViewportHeight])


  function clearRouteLayer() {
    const all_layers = [];

    if (!map.current) return null

    for (let j = 0; j < map.current.getStyle().layers.length; j++) {
        all_layers.push(map.current.getStyle().layers[j].id)
    }

    if (all_layers.includes("route-layer")) {
        map.current.removeLayer("route-layer");
        map.current.removeSource("route");
    }
  }

  const handleClearMap = useCallback(() => {
    if(markers.current.length) {
      markers.current.forEach(marker => {
        marker.remove()
      })

      markers.current.length = 0

      // clearRouteLayer
      // clearAllRoutesList -> doesnt need
    }
  }, []);


  // zoomMapToRoute
  useEffect(() => {
    
    if (selectedRouteListItem) {
      setViewport(prevViewport => {
        return {
          ...prevViewport, 
          latitude: selectedRouteListItem.geometry.coordinates[1],
          longitude: selectedRouteListItem.geometry.coordinates[0],
          zoom: 15,
        }
      })
    }

  }, [selectedRouteListItem])

  return (
    <>
      <ReactMapGL
        mapboxApiAccessToken={`pk.eyJ1IjoiZ2VrYXBlayIsImEiOiJja3J3MDc5aDUwYnVtMnZuODI3bnN4bWo4In0.Y7ifVj3T99VpyiLNuLEVnQ`}
        {...viewport}
        mapStyle={`mapbox://styles/mapbox/streets-v11`}
        onViewportChange={(viewport) => setViewport(viewport)}
      >
        <NavigationControl style={{right: 10, top: 10}} />

        {
          routes && routes.map(route => {
            const { geometry: { coordinates } , properties } = route

            return (
              <Marker
                key={properties.RouteName}
                latitude={coordinates[1]}
                longitude={coordinates[0]}
                className={`marker-custom`}     
              >
                <div
                  onClick={() => handleMarkerClick(route)}
                  onMouseEnter={() => handleMarkerEnter(route)}
                  onMouseLeave={() => handleMarkerLeave(route)}
                > 
                  <svg 
                    height={viewport.zoom * 4}
                    // height={size}
                    viewBox="0 0 384 512"
                    style={{...pinStyle, fill: `${ routeDifficultyColors[properties.RouteDifficulty] }`}}
                  >
                    <path d={ICON}/>
                  </svg>
                </div>
              </Marker>
            )
          })
        }

        {
          selectedRoute && <Popup
            latitude={selectedRoute.geometry.coordinates[1]}
            longitude={selectedRoute.geometry.coordinates[0]}
            offsetTop={-5}
            offsetLeft={viewport.zoom * 4 / 2.5}
            closeButton={false}
          >
            <Tooltip pointProps={selectedRoute.properties} />
          </Popup>
        }
        
          
      </ReactMapGL>
      { loading && <Spinner animation="border" variant="primary" style={{position: 'absolute', left: '50%', top: '50%'}} /> }
    </>
  )
}

export default Map