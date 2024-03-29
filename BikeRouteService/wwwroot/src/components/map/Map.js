import { useState, useRef, useEffect, useCallback } from 'react'
import { instance } from '../../api/api';
import { toast } from 'react-toastify'
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
import bbox from '@turf/bbox';
import Tooltip from './tooltip/Tooltip'
import axios from 'axios';


const routeDifficultyColors = { 
  0 : 'green' , 
  1 : 'orange' ,
  2 : 'red' ,
  3 : 'black' , 
};

const ICON = `M192 0C85.97 0 0 85.97 0 192c0 77.41 26.97 99.03 172.3 309.7c9.531 13.77 29.91 13.77 39.44 0C357 291 384 269.4 384 192C384 85.97 298 0 192 0zM192 271.1c-44.13 0-80-35.88-80-80S147.9 111.1 192 111.1s80 35.88 80 80S236.1 271.1 192 271.1z`;
const pinStyle = {
  cursor: 'pointer',
  stroke: 'none'
};

const markerSvgSize = 35

const initialMapParams = {
  latitude: 32.796048,
  longitude: 35.374668,
  zoom: 8,
}

const flyToSpeed = {
  speed: 1.2,
}

let cancelToken = undefined

const Map = ({routes, refreshMap, selectedLayer, setSelectedLayer, selectedRouteListItem, freeMapViewportHeight, setRefreshMap }) => {
  const map = useRef(null);

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

  const [popupPosition, setPopupPosition] = useState({
    offsetTop: -35,
    anchor: "bottom"
  })
 
  window.mapy = map.current;

  const [mapViewport, setMapViewport] = useState({
    ...initialMapParams,
    width: "100%",
    height: `${freeMapViewportHeight}px`,
    transitionDuration: 500,
    transitionInterpolator: new LinearInterpolator(),
    // transitionInterpolator: new FlyToInterpolator(),
  });

  const [selectedRoute, setSelectedRoute] = useState(null)
  // const [selectedLayer, setSelectedLayer] = useState(null)

  const popupPositioning = useCallback(
    (e) => {
      const marker = e.currentTarget.closest('.mapboxgl-marker'),
      transform = marker && marker.style.transform.match(/(\d+)/g),
      transformY = transform && transform.length > 1 && transform[1],
      mapContainerHeight =  map.current.getMap().getCanvas().clientHeight

      const popupHeight = 230
      const conditionToBottom = transformY < popupHeight
      const conditionToTop = transformY > mapContainerHeight - popupHeight

      // console.log(`conditionToBottom`, conditionToBottom)
      // console.log(`conditionToTop`, conditionToTop)

      if (conditionToBottom) {
        setPopupPosition({
          offsetTop: 10,
          anchor: "top"
        })
      }

      if (conditionToTop) {
        setPopupPosition({
          offsetTop: -35,
          anchor: "bottom"
        })
      }

      if (!conditionToTop && !conditionToBottom) {
        setPopupPosition({
          offsetTop: -35,
          anchor: "bottom"
        })
      }
    },
    []
  )


  const handleMarkerClick = useCallback(
    (route) => {
      // setSelectedRoute(route)

      if (cancelToken) {
        cancelToken.cancel("Operation canceled due to new request.")
      }

      cancelToken = axios.CancelToken.source();

      setMapViewport(prev => {
        return {
          ...prev, 
          transitionInterpolator: new FlyToInterpolator()
        }
      })

      instance.get('GetRouteGeoJsonByName', {
        params: {
          routeName: route.properties.RouteName
        },
        cancelToken: cancelToken.token
      })
      .then(response => {
        if (response.status === 200) {
          const data = JSON.parse(response.data)

          // console.log(`data`, data)

          setLayerOptions(prev => {
            return {
              ...prev, 
              paint : {
                ...prev.paint, 
                'line-color': routeDifficultyColors[route.properties.RouteDifficulty]
              }
            }
          })

          setSelectedLayer(data)

          const bounds = bbox(data)
          const mapCanvas = map.current.getMap()._canvas

          const routeViewport = new WebMercatorViewport({
            width: mapCanvas.clientWidth,
            height: mapCanvas.clientHeight,
          })
          
          const routeFittedViewport = routeViewport.fitBounds(
            [ 
              [bounds[0], bounds[1]],
              [bounds[2], bounds[3]],
            ],
            {
              padding: 50,
            }
          )

          // console.log(`routeFittedViewport`, routeFittedViewport)
          setMapViewport(prevView => {
            return {
              ...prevView, 
              ...routeFittedViewport,
              transitionInterpolator: new LinearInterpolator()
            }
          })
        }
      })
      .catch(e => {
        // toast.error(e.message)
      })

    },
    [setSelectedLayer],
  )

  const handleMarkerEnter = useCallback(
    (route, event) => {
      popupPositioning(event)
      setSelectedRoute(route)
    },
    [popupPositioning],
  )

  const handleMarkerLeave = useCallback(
    () => {
      setSelectedRoute(null)
    },
    [],
  )

  const handleMapViewportChange = useCallback(
    (viewport) => {
      setMapViewport(viewport)
    },
    [],
  )

  /** Update map size when needed  */
  useEffect(() => {

    if (refreshMap) {

      const newOptions = {
        width: "100%",
        height: `${freeMapViewportHeight}px`,
      }

      if (refreshMap === 1) {
        Object.assign(newOptions, initialMapParams)
      }

      setMapViewport(prev => {
        return {
          ...prev,
          ...newOptions,
        }
      })
      
      setRefreshMap(false)
    }

  }, [refreshMap, freeMapViewportHeight, setRefreshMap])

  /** Zoom Map To Selectted Route */
  useEffect(() => {
    
    if (selectedRouteListItem) {
      setSelectedRoute(selectedRouteListItem)
      
      setMapViewport(prevViewport => {
        return {
          ...prevViewport, 
          latitude: selectedRouteListItem.geometry.coordinates[1],
          longitude: selectedRouteListItem.geometry.coordinates[0],
          zoom: 11,  
          transitionInterpolator: new FlyToInterpolator()
        }
      })
      
    } else {
      setSelectedRoute(null)
      setMapViewport(prev => {
        return {
          ...prev,
          transitionInterpolator: new LinearInterpolator()
        }
      })
    }

  }, [selectedRouteListItem])

  return (
    <>
      <ReactMapGL
        mapboxApiAccessToken={`pk.eyJ1IjoiZ2VrYXBlayIsImEiOiJja3J3MDc5aDUwYnVtMnZuODI3bnN4bWo4In0.Y7ifVj3T99VpyiLNuLEVnQ`}
        {...mapViewport}
        mapStyle={`mapbox://styles/mapbox/streets-v11`}
        onViewportChange={handleMapViewportChange}
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
                offsetLeft={-13}
                offsetTop={-30}
              >
                <div
                  onClick={() => handleMarkerClick(route)}
                  onMouseEnter={(e) => handleMarkerEnter(route, e)}
                  onMouseLeave={(e) => handleMarkerLeave(route, e)}
                  style={{
                    filter: 'drop-shadow(1px 0px 2px rgba(106, 106, 106, 0.91))'
                  }}
                > 
                  <svg 
                    height={markerSvgSize}
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
            offsetLeft={0}
            {...popupPosition}
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
    </>
  )
}

export default Map