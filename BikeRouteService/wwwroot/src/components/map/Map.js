import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import ReactDOM from 'react-dom'
import { instance } from '../../api/api';
import Tooltip from './tooltip/Tooltip'
import { toast } from 'react-toastify'
// import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { Spinner } from 'react-bootstrap';
import ReactMapGL, { 
  Marker,
  NavigationControl,
  Popup,
  FlyToInterpolator,
  LinearInterpolator,
  Layer,
  Source,
  WebMercatorViewport,
} from 'react-map-gl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import bbox from '@turf/bbox';
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

const routeLayer = {
  'id': 'route-layer',
  'type': 'line',
  'source': 'route',
  'layout': {
      'line-join': 'round',
      'line-cap': 'round'
  },
  'paint': {
      'line-color': 'green',
      'line-width': 5
  }
}

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
  const [layerOptions, setLayerOptions] = useState({
    'id': 'route-layer',
    'type': 'line',
    // 'source': 'route',
    'layout': {
        'line-join': 'round',
        'line-cap': 'round'
    },
    'paint': {
        'line-color': 'green',
        'line-width': 5
    }
  })

  const [size, setSize] = useState(38)
  const [loading, setLoading] = useState(false)

  const [viewport, setViewport] = useState({
    latitude: 32.796048,
    longitude: 35.374668,
    zoom: 8,
    width: "100%",
    height: `${freeMapViewportHeight}px`,
    transitionDuration: 800,
    transitionInterpolator: new LinearInterpolator(),
    // transitionInterpolator: new FlyToInterpolator(),
  });

  const [selectedRoute, setSelectedRoute] = useState(null)
  const [selectedLayer, setSelectedLayer] = useState(null)

  const handleMarkerClick = useCallback(
    (route) => {
      // setSelectedRoute(route)

      setViewport(prev => {
        return {
          ...prev, 
          transitionInterpolator: new FlyToInterpolator()
        }
      })

      instance.get('GetRouteGeoJsonByName', {
        params: {
          routeName: route.properties.RouteName
        }
      })
      .then(response => {
        if (response.status === 200) {
          const data = JSON.parse(response.data)

          console.log(`data`, data)

          setLayerOptions(prev => {
            return {
              ...prev, 
              paint : {
                ...prev.paint, 
                'line-color': routeDifficultyColors[route.properties.RouteDifficulty]
              }
            }
          })

          // layerRef.current.paint['line-color'] = routeDifficultyColors[route.properties.RouteDifficulty]

          setSelectedLayer(data)

          const { coordinates } = data.features[0].geometry

          const bounds = bbox(data)

          console.log(`bounds`, bounds)

          const mapCanvas = map.current.getMap()._canvas

          console.log(`mapCanvas`, mapCanvas)

          console.log(`viewport`, viewport)
          console.log(`map.current.getMap()`, map.current.getMap())
          console.log(`map.current.getMap().getStyle()`, map.current.getMap().getStyle())
          // console.log(`map.current.queryRenderedFeatures()`, map.current.queryRenderedFeatures())

          const routeViewport = new WebMercatorViewport({
            width: mapCanvas.clientWidth,
            height: mapCanvas.clientHeight,
          })
          
          console.log(`routeViewport`, routeViewport)

          const t = routeViewport.fitBounds(
            [ 
              [bounds[0], bounds[1]],
              [bounds[2], bounds[3]],
            ],
            {
              padding: 45,
            }
          )

          console.log(`t`, t)

          setViewport(prevView => {
            return {
              ...prevView, 
              // latitude: route.geometry.coordinates[1],
              // longitude: route.geometry.coordinates[0],
              // zoom: 15,
              ...t,
              transitionInterpolator: new LinearInterpolator()
            }
          })
    
          setTimeout(() => {
            setSelectedRoute(route)
          }, 300)

        }
      })
      .catch(e => {
        toast.error(e.message)
      })

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

  const handleViewportChange = useCallback(
    (viewport) => {
      setViewport(viewport)
    },
    [],
  )
  
  const handleZoomChange = useCallback(
    (interactionState) => {
      console.log(`interactionState`, interactionState)
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

  // zoomMapToRoute
  useEffect(() => {
    
    if (selectedRouteListItem) {
      setViewport(prev => {
        return {
          ...prev,
          transitionInterpolator: new FlyToInterpolator()
        }
      })

      setTimeout(() => {
        setViewport(prevViewport => {
          return {
            ...prevViewport, 
            latitude: selectedRouteListItem.geometry.coordinates[1],
            longitude: selectedRouteListItem.geometry.coordinates[0],
            zoom: 15,
            transitionInterpolator: new LinearInterpolator()
  
          }
        })
      }, 0)
      
    }

  }, [selectedRouteListItem])

  return (
    <>
      <ReactMapGL
        mapboxApiAccessToken={`pk.eyJ1IjoiZ2VrYXBlayIsImEiOiJja3J3MDc5aDUwYnVtMnZuODI3bnN4bWo4In0.Y7ifVj3T99VpyiLNuLEVnQ`}
        {...viewport}
        mapStyle={`mapbox://styles/mapbox/streets-v11`}
        onViewportChange={handleViewportChange}
        onInteractionStateChange={handleZoomChange}
        // transitionDuration={800}
        // transitionInterpolator={new FlyToInterpolator()}
        ref={map}
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
        
        {
          selectedLayer && <Source id="route" type="geojson" data={selectedLayer}>
            <Layer 
            {...layerOptions }
          />
          </Source>
        }
          
      </ReactMapGL>
      {/* { loading && <Spinner animation="border" variant="primary" style={{position: 'absolute', left: '50%', top: '50%'}} /> } */}
    </>
  )
}

export default Map