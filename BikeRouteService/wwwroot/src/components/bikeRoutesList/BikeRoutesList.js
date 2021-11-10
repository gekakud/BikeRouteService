import './index.scss'
import { Container } from "react-bootstrap"
import ListItem from "./listItem/ListItem"

const BikeRoutesList = ({ routes, freeListViewportHeight,setSelectedRouteListItem, onFilter, hideFiltersCondition, windowWidth }) => {

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
    </Container>
  )
}

export default BikeRoutesList