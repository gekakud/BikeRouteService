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

function App() {

  const [routes, setRoutes] = useState(null)
  const [currentRoute, setCurrentRoute] = useState(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [refreshMap, setRefreshMap] = useState(false)
  const [freeViewportHeight, setFreeViewportHeight] = useState( (window.innerHeight - 80) )
  const [selectedRouteListItem, setSelectedRouteListItem] = useState(null)
  const [routesLoading, setRoutesLoading] = useState(false)

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
      setRoutes(null)
      setRoutesLoading(true)

      instance.get('GetRoute', {
        params: {
          routeType,
          routeDiff
        }
      })
      .then( response => {
        console.log(`response`, response)
        if (response.status === 200) {
          const data = JSON.parse(response.data)

          if (data.type === "FeatureCollection"){
            setRoutes(data.features)
            setRoutesLoading(false)
          }
        }
      })
      .catch( err => {
        toast.error(err.message)
        setRoutesLoading(false)
      })
    },
    [],
  )


  useEffect(() => {

    const handleWindowResize = () => {
      const currentFreeVieportHeight = window.innerHeight - 80;

      if (currentFreeVieportHeight !== freeViewportHeight) {
        setFreeViewportHeight(currentFreeVieportHeight)
      }
    }

    window.addEventListener('resize', handleWindowResize)
    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])


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
            setRoutesLoading(false)
          }
        }
      })
      .catch( err => {
        toast.error(err.message)
        const json = "{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"geometry\":{\"type\":\"Point\",\"coordinates\":[35.221484,32.763777]},\"properties\":{\"RouteName\":\"Alon\",\"RouteType\":3,\"RouteDifficulty\":3,\"RouteLength\":10.03973388671875,\"ElevationGain\":216.00000000000003}},{\"type\":\"Feature\",\"geometry\":{\"type\":\"Point\",\"coordinates\":[35.374668,32.796048]},\"properties\":{\"RouteName\":\"Turan\",\"RouteType\":3,\"RouteDifficulty\":1,\"RouteLength\":18.14175033569336,\"ElevationGain\":492.10000000000025}},{\"type\":\"Feature\",\"geometry\":{\"type\":\"Point\",\"coordinates\":[35.157723,33.063706]},\"properties\":{\"RouteName\":\"mezuba\",\"RouteType\":2,\"RouteDifficulty\":2,\"RouteLength\":11.60865306854248,\"ElevationGain\":278.6000000000001}},{\"type\":\"Feature\",\"geometry\":{\"type\":\"Point\",\"coordinates\":[34.959657,32.651168]},\"properties\":{\"RouteName\":\"shluha\",\"RouteType\":0,\"RouteDifficulty\":1,\"RouteLength\":21.178760528564453,\"ElevationGain\":811.0000000000026}}]}";
        setRoutes(JSON.parse(json).features)
        setRoutesLoading(false)
      })
    }
  }, [])


  return (
    <>
      <Container fluid>
        <Row>
          <Header uploadModalToggler={toggleUploadModal} />
        </Row>
        <Row className="content-main align-items-start">
          <Col xs={6} xl={5} style={{maxHeight: `${freeViewportHeight}px`, overflow: 'hidden', }}>
            <RoutesFilter  
              routesListRef={routesListRef} 
              handleRefreshMap={handleRefreshMap}
              filtersRef={filtersRef}
              setRoutes={setRoutes}
              setRoutesLoading={setRoutesLoading}
              onFilter={onFilter}
            />
            { routes && <BikeRoutesList 
                routes={routes} 
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
          <Col xs={6} xl={7} style={{position: 'relative'}} className="gx-0">
            <Row className="gx-0">
              <Col xs={12}>
                <Map
                    freeMapViewportHeight={freeViewportHeight}
                    routes={routes} 
                    routesListRef={routesListRef} 
                    handleRefreshMap={handleRefreshMap}
                    refreshMap={refreshMap}
                    selectedRouteListItem={selectedRouteListItem}
                    setRoutes={setRoutes}
                />
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
