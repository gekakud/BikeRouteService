import { faArrowUp, faLongArrowAltRight, faSignal } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useCallback } from 'react'
import { Col, Collapse, Row, Button } from 'react-bootstrap'
import './index.scss';

const routeDiff = [
  'Begginer',
  'Intermediate',
  'Proficient',
  'Beast'
]

const routeType = [
  'Mtb',
  'Gravel',
  'Road',
  'Mixed'
]


const ListItem = ({route, isFirst, setSelectedRouteListItem}) => {
  const [open, setOpen] = useState(false)

  const handleCollapse = useCallback(
    () => {
      setOpen(prev => (!prev))
    },
    [],
  )

  const handleMouseOver = useCallback(
    () => {
      setSelectedRouteListItem(route)
    },
    [setSelectedRouteListItem, route],
  )

  const handleMouseOut = useCallback(
    () => {
      setSelectedRouteListItem(null)
    },
    [setSelectedRouteListItem],
  )

  return (
    <Row className={`${ isFirst ? '' : 'mt-4'}`}>
      <Col xs={12}>
        <div
          className="list-item" 
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >

          <div>

            <Button variant="primary" style={{float: 'right'}}>
              {routeType[route.properties.RouteType]}
            </Button>

            <h3 onClick={handleCollapse} className="mb-2">{route.properties.RouteName} </h3>

            <p className="list-item__short-desc pb-2 m-0">
              Sed interdum metus at nisi tempor laoreet. Integer gravida orci a justo sodales,
              sed lobortis est placerat.
            </p>
          </div>

          

          <div className="list-item__info py-3 mt-2">
            <span className={`me-3 d-inline-flex align-items-center justify-content-start`}>
              <FontAwesomeIcon icon={faSignal} className={`me-1 blue-light`}/>
              {routeDiff[route.properties.RouteDifficulty]}

            </span>
            <span className={`me-3 d-inline-flex align-items-center justify-content-start`}>
              <FontAwesomeIcon icon={faLongArrowAltRight} className={`me-1 blue-light`}/>
                {route.properties.RouteLength.toFixed(2)} km
            </span>
            <span className={`me-3 d-inline-flex align-items-center justify-content-start`}>
              <FontAwesomeIcon icon={faArrowUp} className={`me-1 blue-light`}/>
                {Math.round(route.properties.ElevationGain)} meters
            </span>
          </div>

          <Collapse in={open}>
            <div>Lorem ipsum dolor sit amet...</div>
          </Collapse>
        </div>
      </Col>
    </Row>
    
  ) 
}

export default ListItem