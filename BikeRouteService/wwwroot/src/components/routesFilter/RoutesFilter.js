import { useState, useCallback } from 'react'
import { Col, Container, Dropdown, DropdownButton, Row, Button, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { instance } from '../../api/api'
import styles from './index.scss'

const RoutesFilter = ({onFilter, filtersRef, setRoutes, setRoutesLoading}) => {

  const [routeDiff, setRouteDiff] = useState('All')
  const [routeType, setRouteType] = useState('All')

  const handleRouteType = useCallback(
    (e) => {
      console.log(`e`, e)
      console.log(`e currentTarget`, e.currentTarget.value)
      console.log(`e target`, e.target.value)
      setRouteType(e.target.value)
    },
    [],
  )

  const handleRouteDiff = useCallback(
    (e) => {
      console.log(`e`, e)
      setRouteDiff(e.target.value)

    },
    [],
  )

  const handleFilterSubmit = useCallback(
    () => {
      console.log(`routeDiff`, routeDiff)
      console.log(`routeType`, routeType)
      onFilter && onFilter({routeType, routeDiff})
    },
    [routeDiff, routeType, onFilter]
  )

  const handleClearMap = useCallback(() => {
    setRoutes(null)
  }, [setRoutes])

  const handleShowAll = useCallback(() => {
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
  }, [setRoutes,setRoutesLoading])

  return (
    <Container fluid ref={filtersRef} className={`py-4`}>
      <Row className="mb-3">
        <Col xl={6} xs={12} className="mb-xl-0 mb-2">
          <Button size={`lg`} style={{width: '100%'}} onClick={handleShowAll}>
            Show all routes
          </Button>
        </Col>
        <Col xl={6} xs={12}>
          <Button size={`lg`} style={{width: '100%'}} onClick={handleClearMap}>
            Clear Map
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">


      <Form.Group as={Col} controlId="formGridDiff">
        <Form.Label>Route Difficulty</Form.Label>
        <Form.Select 
          defaultValue="Begginer" 
          name="routeDiff" 
          required 
          value={routeDiff}
          onChange={handleRouteDiff}  
        >
          <option>All</option>
          <option>Begginer</option>
          <option>Intermediate</option>
          <option>Proficient</option>
          <option>Beast</option>
        </Form.Select>
      </Form.Group>
      <Form.Group as={Col} controlId="formGridType">
        <Form.Label>Route Type</Form.Label>
        <Form.Select 
          defaultValue="Mixed" 
          name="routeType" 
          required 
          value={routeType}
          onChange={handleRouteType}  
        >
          <option>All</option>
          <option>Mtb</option>
          <option>Gravel</option>
          <option>Road</option>
          <option>Mixed</option>
        </Form.Select>
      </Form.Group>

      </Row>

      <Row>
        <Col xs={12}>
          <Button className="w-100" size={`lg`} onClick={handleFilterSubmit}>
            Filter
          </Button>
        </Col>
      </Row>

      </Container>
  )
}

export default RoutesFilter