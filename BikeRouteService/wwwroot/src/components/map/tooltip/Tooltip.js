import "./index.scss"
import { Col, Container, Row } from "react-bootstrap"
import { faArrowUp, faLongArrowAltRight, faSignal } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useTranslation } from "react-i18next"

// const routeDiff = [
//   'Begginer',
//   'Intermediate',
//   'Proficient',
//   'Beast'
// ]

// const routeType = [
//   'Mtb',
//   'Gravel',
//   'Road',
//   'Mixed'
// ]

const Tooltip = ({ pointProps: { RouteName, RouteType, RouteLength, RouteDifficulty, ElevationGain}  }) => {
  
    const { t } = useTranslation()

  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
          <h3 className="text-center py-2"> {RouteName} </h3> 
        </Col>
      </Row>
      <Row className="mb-3">
        <Col className="justify-content-center d-flex align-items-center">
          { t('filters.typeSelectLabel') }: {t(`filters.typeSelect.key_${RouteType + 1}`)}
        </Col>
        </Row>
        <Row className="my-3">
        <Col className="justify-content-center d-flex align-items-center">
          <FontAwesomeIcon icon={faSignal} className={`me-1 blue-dark`}/> &nbsp;
          { t(`filters.diffSelect.key_${RouteDifficulty + 1}`) }
        </Col>
      </Row>
      <Row className="my-3">
        <Col className="justify-content-center d-flex align-items-center">
          <FontAwesomeIcon icon={faLongArrowAltRight} className={`me-1 blue-dark`}/> &nbsp;
          {RouteLength.toFixed(2)} { t('distance') }
        </Col>
        </Row>
        <Row className="my-3">
        <Col className="justify-content-center d-flex align-items-center">
            <FontAwesomeIcon icon={faArrowUp} className={`me-1 blue-dark`}/> &nbsp;
            {Math.round(ElevationGain)} { t('elevation') }
        </Col>
      </Row>
    </Container>
  )
}

export default Tooltip