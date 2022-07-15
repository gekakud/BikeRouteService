// import { faArrowUp, faLongArrowAltRight, faSignal } from '@fortawesome/free-solid-svg-icons'
import { useState, useCallback } from 'react'
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Col, Collapse, Row, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import { routesApi } from '../../../api/api';


const ListItem = ({route, isFirst, setSelectedRouteListItem, onClick}) => {
  const [open, setOpen] = useState(false)

  const { t } = useTranslation()

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

  const handleRouteTypeBtn = useCallback(
    () => {
      onClick && onClick({routeType: route.properties.RouteType})
    }, 
    [onClick, route]
  )

  return (
    <Row className={`${ isFirst ? '' : 'mt-4'}`}>
      <Col xs={12}>
        <div
          className="list-item" 
          onMouseEnter={handleMouseOver}
          onMouseLeave={handleMouseOut}
        >

          <div>

            <Button variant="primary" style={{float: 'right'}} onClick={handleRouteTypeBtn}>
              {/* {routeType[route.properties.RouteType]} */}
              {t(`filters.typeSelect.key_${[+route.properties.RouteType + 1]}`)}
            </Button>

            <h3 onClick={handleCollapse} className="mb-2">{route.properties.RouteName} </h3>

            <p className="list-item__short-desc pb-2 m-0">
            {route.properties.RouteName} description
            </p>
          </div>

          

          <div className="list-item__info py-3 mt-2">
            <span className={`me-3 d-inline-flex align-items-center justify-content-start`}>
              <FontAwesomeIcon icon='signal' className={`me-1 blue-light`}/> &nbsp;
              {/* {routeDiff[route.properties.RouteDifficulty]} */}
              { t(`filters.diffSelect.key_${[+route.properties.RouteDifficulty + 1]}`) }

            </span>
            <span className={`me-3 d-inline-flex align-items-center justify-content-start`}>
              <FontAwesomeIcon icon='long-arrow-alt-right' className={`me-1 blue-light`}/> &nbsp;
                {route.properties.RouteLength.toFixed(2)} { t('distance') }
            </span>
            <span className={`me-3 d-inline-flex align-items-center justify-content-start`}>
              <FontAwesomeIcon icon='arrow-up' className={`me-1 blue-light`}/> &nbsp;
                {Math.round(route.properties.ElevationGain)} { t('elevation') }
            </span>
            <a download href={`${routesApi}DownloadRouteOriginalFile?routeName=${route.properties.RouteName}`} >
              <FontAwesomeIcon className={`blue-light download`} icon="file-download" />
            </a>
          </div>

          <Collapse in={open}>
            <div>...</div>
          </Collapse>
        </div>
      </Col>
    </Row>
    
  ) 
}

export default ListItem