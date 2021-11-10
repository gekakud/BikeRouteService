import { useCallback, useState, useEffect, useRef, useMemo, useLayoutEffect } from 'react'
import { instance } from './api/api';
import './App.scss';
import { Col, Container, Row } from 'react-bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons'

import Map from './components/map/Map';
import RoutesFilter from './components/routesFilter/RoutesFilter';
import BikeRoutesList from './components/bikeRoutesList/BikeRoutesList';
import UploadBikeRoute from './components/uploadBikeRoute/UploadBikeRoute';
import Header from './components/header/Header';
import Loader from './components/Loader/Loader';
import Footer from './components/footer/Footer';
import MapToggler from './components/toggler/mapToggler/MapToggler';
import FiltersToggler from './components/toggler/filterToggler/FilterToggler';

import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { faPlus, faSearch, faArrowUp, faLongArrowAltRight, faSignal,faArrowLeft, faArrowRight, faMap, faFilter, faList } from '@fortawesome/free-solid-svg-icons'

library.add(fab, faPlus, faSearch, faArrowUp, faLongArrowAltRight, faSignal, faArrowLeft, faArrowRight, faMap, faFilter, faList)

function App() {

  const [routes, setRoutes] = useState(null)
  const [filteredRoutes, setFilteredRoutes] = useState(null)
  const [requestAllRoutes, setRequestAllRoutes] = useState(false)

  // const [selectedRoute, setSelectedRoute] = useState(null)
  const [selectedRouteListItem, setSelectedRouteListItem] = useState(null)
  const [selectedLayer, setSelectedLayer] = useState(null)
  const [routesLoading, setRoutesLoading] = useState(false)

  const [isMapOpen, setIsMapOpen] = useState(window.innerWidth < 992)
  const [isFiltersOpen, setIsFiltersOpen] = useState(true)

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [refreshMap, setRefreshMap] = useState(false)
  const [freeViewportHeight, setFreeViewportHeight] = useState( (window.innerHeight - 80) )
  const [filtersHeight, setFiltersHeight] = useState(null)

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)


  const hideFiltersCondition = useMemo(
    () => {
      if (windowWidth < 992) {
        return (!isMapOpen && !isFiltersOpen)
      }

      return false;
    },
    [isMapOpen, isFiltersOpen, windowWidth]
  )

  const listFreeViewportHeight = useMemo(() => {
    return freeViewportHeight - 50 - filtersHeight
  }, [freeViewportHeight, filtersHeight])

  const toggleUploadModal =  useCallback(( show = null ) => {
      setIsUploadModalOpen(prev => ( show !== null ? show : !prev ))
    },
    [setIsUploadModalOpen],
  )

  const onClearMap = useCallback(
    () => {
      setFilteredRoutes(null)
      setSelectedLayer(null)
      setRefreshMap(1) //1 for update map viewport to inital
    },
    []
  )

  const onShowAll = useCallback(
    () => {
      setRequestAllRoutes(true)
    },
    [],
  )

  const onFilter = useCallback(
    ({routeType, routeDiff = '-1'}) => {
      setFilteredRoutes(null)
      setSelectedLayer(null)
      setRoutesLoading(true)

      const filtered = routes.filter(route => {
        const {RouteType, RouteDifficulty} = route.properties
        return ( (+RouteType === +routeType || +routeType === -1  ) && ( +RouteDifficulty === +routeDiff || +routeDiff === -1) )
      })

      // TODO: COMPARE new filtered with old one

      setFilteredRoutes(filtered)
      setRefreshMap(1) //1 for update map viewport to inital
      setRoutesLoading(false)
    },
    [routes],
  )

  const onSearch = useCallback(
    (search) => {
      setFilteredRoutes(null)
      setRoutesLoading(true)

      if (search) {
        const filtered = routes.filter(route => {
          const {RouteName} = route.properties
          return (
            RouteName.toLowerCase().trim() === search.toLowerCase().trim() ||
            RouteName.toLowerCase().trim().includes(search.toLowerCase().trim())
          )
        })

        setFilteredRoutes(filtered)
        setRefreshMap(1)
        setSelectedLayer(null)

        if (windowWidth < 992) {
          setIsFiltersOpen(false)
        }
      }

      setRoutesLoading(false)
    },
    [routes, windowWidth]
  )

  useEffect(() => {
      setRefreshMap(true)
  }, [isMapOpen])
 
  /** window resize map sizes handler  */
  useEffect(() => {

    const handleWindowResize = () => {
      const currentFreeVieportHeight = window.innerHeight - 80;

      if (currentFreeVieportHeight !== freeViewportHeight) {
        setFreeViewportHeight(currentFreeVieportHeight)
      }

      setWindowWidth(window.innerWidth)
      setRefreshMap(true)
    }

    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize) 
    }
  }, [])

  /** Sync filtered routes state with general routes state */
  useEffect(() => {
    setFilteredRoutes(routes)
  }, [routes])


  /** IRequest to get all routes */
  useEffect(() => {
    if (!routes || requestAllRoutes ) {
      setRoutesLoading(true)
      setRoutes(null)

      instance.get('GetAllRoutesInfo')
        .then( response => {

          if (response.status === 200) {
            const data = JSON.parse(response.data)

            if (data.type === "FeatureCollection"){
              setRoutes(data.features)
              // setFilteredRoutes(data.features)
              setRoutesLoading(false)
              setRequestAllRoutes(false)
              setRefreshMap(1) //1 for update map viewport to inital
            }
          }

        })
        .catch( err => {
          toast.error(err.message)
          setRoutesLoading(false)
          setRequestAllRoutes(false)
        })
    }
  }, [requestAllRoutes, routes])

  return (
    <>
      <Container fluid>
        <Row>
          <Header uploadModalToggler={toggleUploadModal} onSearch={onSearch} />
        </Row>
        <Row className="content-main align-items-start" style={{position: 'relative'}}>
          {
            windowWidth < 992 ? 
              (
                <>
                  <MapToggler mobile setIsMapOpen={setIsMapOpen} isMapOpen={isMapOpen} /> 
                  <FiltersToggler mobile isFiltersOpen={isFiltersOpen} isMapOpen={isMapOpen} setIsFiltersOpen={setIsFiltersOpen} />
                </>
              ) : null
          }
          <Col 
            xs={12} lg={5} 
            className={`${isMapOpen ? 'd-none' : null } ${windowWidth < 992 ? 'ps-5' : null} `} 
            style={{maxHeight: `${freeViewportHeight}px`, overflow: 'hidden', position: 'relative'}}
          >
            {/* <div ref={filtersRef} /> */}
              <RoutesFilter
                setFiltersHeight={setFiltersHeight}
                onFilter={onFilter}
                onClearMap={onClearMap}
                onShowAll={onShowAll}
                hideFiltersCondition={hideFiltersCondition}
              />
            { filteredRoutes && <BikeRoutesList
                routes={filteredRoutes} 
                onFilter={onFilter}
                freeListViewportHeight={listFreeViewportHeight}
                setSelectedRouteListItem={setSelectedRouteListItem}
                hideFiltersCondition={hideFiltersCondition}
                windowWidth={windowWidth}
              />
            }
            { 
              routesLoading && <Loader/>
            }
          </Col>
          <Col 
            xs={12} lg={isMapOpen ? 12 : 7} 
            style={{position: 'relative'}} 
            className={`gx-0 ${!isMapOpen && windowWidth < 992 ? 'd-none' : null}`}
          >
            <Row className="gx-0">
              <Col xs={12}>
                <Map
                    freeMapViewportHeight={freeViewportHeight}
                    routes={filteredRoutes}
                    refreshMap={refreshMap}
                    setRefreshMap={setRefreshMap}
                    selectedRouteListItem={selectedRouteListItem}
                    setSelectedLayer={setSelectedLayer}
                    selectedLayer={selectedLayer}
                />

                { 
                  windowWidth >= 992 ? 
                    <MapToggler setIsMapOpen={setIsMapOpen} isMapOpen={isMapOpen} /> : null
                }

              </Col>
            </Row>
              
          </Col>

          <UploadBikeRoute 
            show={isUploadModalOpen} 
            uploadModalToggler={toggleUploadModal} 
          />
        </Row>
        <Row>
          <Footer />
        </Row>
      </Container>
      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        pauseOnFocusLoss={false}
        hideProgressBar={true}
      />
    </>
  );
}

export default App;
