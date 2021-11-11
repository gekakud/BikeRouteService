import './index.scss'
import { 
  Container, 
  // Row, 
  // Button, 
  // Col 
} from "react-bootstrap"
import ListItem from "./listItem/ListItem"
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const BikeRoutesList = ({ 
  routes, 
  freeListViewportHeight, 
  setSelectedRouteListItem, 
  onFilter, 
  hideFiltersCondition, 
  windowWidth, 
  // handleLoadMore, 
  // isLoadingMore 
}) => {

  return (
    <Container
      fluid 
      className={`feature-listing ${ windowWidth < 992 && !hideFiltersCondition ? 'd-none' : null}`}
      // ref={routesListRef}
      style={{maxHeight: `${freeListViewportHeight}px`}}  
    >
      { 
        routes && routes.map( (route, i) => { 
          const isFirst = i === 0 ? true : null
          return <ListItem 
            key={route.properties.RouteName} 
            route={route} 
            isFirst={isFirst}
            setSelectedRouteListItem={setSelectedRouteListItem}
            onClick={onFilter}
          />
        })
      }

      {/* <Row className={`py-5 mt-2 justify-content-center`}>
        <Col xs="auto">
          <Button onClick={handleLoadMore} className={`load-more`} size="lg">
            Load more &nbsp;
            { isLoadingMore && <FontAwesomeIcon icon="circle-notch" /> }
          </Button>
        </Col>
      </Row> */}

    </Container>
  )
}

export default BikeRoutesList