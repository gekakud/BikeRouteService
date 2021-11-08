import { useCallback, useState, useEffect, useRef, useMemo } from 'react'
import logo from './logo.svg';
import './App.scss';
import Map from './components/map/Map';
import RoutesFilter from './components/routesFilter/RoutesFilter';
import BikeRoutesList from './components/bikeRoutesList/BikeRoutesList';
import UploadBikeRoute from './components/uploadBikeRoute/UploadBikeRoute';
import Header from './components/header/Header';
import { instance } from './api/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import FiltersToggler from './components/routesFilter/filtersToggler/FiltersToggler';

function App() {

  const [routes, setRoutes] = useState(null)
  const [filteredRoutes, setFilteredRoutes] = useState(null)
  const [currentRoute, setCurrentRoute] = useState(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [refreshMap, setRefreshMap] = useState(false)
  const [freeViewportHeight, setFreeViewportHeight] = useState( (window.innerHeight - 80) )
  const [selectedRouteListItem, setSelectedRouteListItem] = useState(null)
  const [routesLoading, setRoutesLoading] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(true)

  const routesListRef = useRef(null)
  const filtersRef = useRef(null)


  const toggleUploadModal =  useCallback(( show = null ) => {
      setIsUploadModalOpen(prev => ( show !== null ? show : !prev ))
    },
    [setIsUploadModalOpen],
  )

  const handleRefreshMap = useCallback((refresh = true) => {
    setRefreshMap(refresh)
  }, [])

  const onFilter = useCallback(
    ({routeType, routeDiff}) => {
      // setRoutes(null)
      setFilteredRoutes(null)
      setRoutesLoading(true)

      console.log(`routeType, routeDiff`, routeType, routeDiff)



      const filtered = routes.filter(route => {
        const {RouteType, RouteDifficulty} = route.properties
        return ( (RouteType == routeType || routeType == '-1'  ) && ( RouteDifficulty == routeDiff || routeDiff == '-1') )
      })

      setFilteredRoutes(filtered)
      setRoutesLoading(false)

      // instance.get('GetRoute', {
      //   params: {
      //     routeType,
      //     routeDiff
      //   }
      // })
      // .then( response => {
      //   console.log(`response`, response)
      //   if (response.status === 200) {
      //     const data = JSON.parse(response.data)

      //     if (data.type === "FeatureCollection"){
      //       setRoutes(data.features)
      //       setRoutesLoading(false)
      //     }
      //   }
      // })
      // .catch( err => {
      //   toast.error(err.message)
      //   setRoutesLoading(false)
      // })
    },
    [routes],
  )

  const onSearch = useCallback(
    (search) => {
      setFilteredRoutes(null)
      setRoutesLoading(true)

      if(search) {
        const filtered = routes.filter(route => {
          const {RouteName} = route.properties
          return ( RouteName.toLowerCase().trim() === search.toLowerCase().trim() )
        })

        setFilteredRoutes(filtered)
      }

      setRoutesLoading(false)
    },
    [routes]
  )

  useEffect(() => {
      setRefreshMap(true)
  }, [isFiltersOpen])

  // window resize map sizes handler 
  useEffect(() => {

    const handleWindowResize = () => {
      const currentFreeVieportHeight = window.innerHeight - 80;

      if (currentFreeVieportHeight !== freeViewportHeight) {
        setFreeViewportHeight(currentFreeVieportHeight)
      }

      setRefreshMap(true)
    }

    window.addEventListener('resize', handleWindowResize)
    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  // Sync filtered routes state with general routes state
  useEffect(() => {
    setFilteredRoutes(routes)
  }, [routes])


  // initial request for get routes
  useEffect(() => {
    if (!routes) {
      setRoutesLoading(true)
      instance.get('GetAllRoutesInfo')
      .then( response => {
        console.log(`response`, response)
        if (response.status === 200) {
          const data = JSON.parse(response.data)

          if (data.type === "FeatureCollection"){
            setRoutes(data.features)
            setFilteredRoutes(data.features)
            setRoutesLoading(false)
          }
        }
      })
      .catch( err => {
        toast.error(err.message)
        setRoutesLoading(false)
      })
    }
  }, [])


  return (
    <>
      <Container fluid>
        <Row>
          <Header uploadModalToggler={toggleUploadModal} onSearch={onSearch} />
        </Row>
        <Row className="content-main align-items-start">
          <Col xs={6} xl={5} className={isFiltersOpen ? null : 'd-none'} style={{maxHeight: `${freeViewportHeight}px`, overflow: 'hidden', }}>
            <RoutesFilter  
              routesListRef={routesListRef} 
              handleRefreshMap={handleRefreshMap}
              filtersRef={filtersRef}
              setRoutes={setRoutes}
              // setFilteredRoutes={setFilteredRoutes}
              setRoutesLoading={setRoutesLoading}
              onFilter={onFilter}
            />
            { filteredRoutes && <BikeRoutesList 
                routes={filteredRoutes} 
                routesListRef={routesListRef} 
                handleRefreshMap={handleRefreshMap}
                freeListViewportHeight={freeViewportHeight - 20 - filtersRef?.current?.clientHeight}
                setSelectedRouteListItem={setSelectedRouteListItem}
              />
            }
            { 
              routesLoading && <Row className="justify-content-center py-5">
                <Spinner role="status" animation="border" size="lg" />
              </Row>
            }
          </Col>
          <Col xs={isFiltersOpen ? 6 : 12} xl={isFiltersOpen ? 7 : 12} style={{position: 'relative'}} className="gx-0">
            <Row className="gx-0">
              <Col xs={12}>
                <Map
                    freeMapViewportHeight={freeViewportHeight}
                    routes={filteredRoutes}
                    routesListRef={routesListRef} 
                    handleRefreshMap={handleRefreshMap}
                    refreshMap={refreshMap}
                    setRefreshMap={setRefreshMap}
                    selectedRouteListItem={selectedRouteListItem}
                    setRoutes={setRoutes}
                />
                <FiltersToggler setIsFiltersOpen={setIsFiltersOpen} isFiltersOpen={isFiltersOpen} />
              </Col>
            </Row>
              
          </Col>

          <UploadBikeRoute 
            show={isUploadModalOpen} 
            uploadModalToggler={toggleUploadModal} 
            handleRefreshMap={handleRefreshMap}
          />
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
