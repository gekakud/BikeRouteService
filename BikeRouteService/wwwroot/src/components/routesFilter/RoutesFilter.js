import { useState, useCallback } from 'react'
import { Col, Container, Dropdown, DropdownButton, Row, Button, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { instance } from '../../api/api'
import styles from './index.scss'

const RoutesFilter = ({onFilter, filtersRef, setFilteredRoutes, setRoutes, setRoutesLoading}) => {

  const [routeDiff, setRouteDiff] = useState('-1')
  const [routeType, setRouteType] = useState('-1')

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
    setFilteredRoutes(null)
  }, [setFilteredRoutes])

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


      <Form.Group as={Col} controlId="routeDiff">
        <Form.Label>Route Difficulty</Form.Label>
        <Form.Select 
          name="routeDiff" 
          required 
          value={routeDiff}
          onChange={handleRouteDiff}  
        >
          <option value="-1">All</option>
          <option value="0">Begginer</option>
          <option value="1">Intermediate</option>
          <option value="2">Proficient</option>
          <option value="3">Beast</option>
        </Form.Select>
      </Form.Group>
      <Form.Group as={Col} controlId="routeType">
        <Form.Label>Route Type</Form.Label>
        <Form.Select 
          name="routeType" 
          required 
          value={routeType}
          onChange={handleRouteType}  
        >
          <option value="-1">All</option>
          <option value="0">Mtb</option>
          <option value="1">Gravel</option>
          <option value="2">Road</option>
          <option value="3">Mixed</option>
        </Form.Select>
      </Form.Group>

      </Row>

      <Row className="">
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