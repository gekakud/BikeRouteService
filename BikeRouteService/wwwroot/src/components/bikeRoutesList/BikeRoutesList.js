import { useCallback } from 'react'
import { Collapse, Container } from "react-bootstrap"
import ListItem from "./listItem/ListItem"
import './index.scss'

const BikeRoutesList = ({ routes, routesListRef, freeListViewportHeight,setSelectedRouteListItem }) => {

  return (
    <Container
      fluid 
      className="feature-listing"
      ref={routesListRef}
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
          />
        })
      }
    </Container>
  )
}

export default BikeRoutesList