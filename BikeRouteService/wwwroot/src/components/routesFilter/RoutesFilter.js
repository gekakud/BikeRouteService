import { useState, useCallback } from 'react'
import { Col, Container, Row, Button, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const RoutesFilter = ({onFilter, onClearMap, onShowAll, filtersRef}) => {

  const [routeDiff, setRouteDiff] = useState('-1')
  const [routeType, setRouteType] = useState('-1')

  const { t } = useTranslation()

  const handleRouteType = useCallback(
    (e) => {
      setRouteType(e.target.value)
    }, []
  )

  const handleRouteDiff = useCallback(
    (e) => {
      setRouteDiff(e.target.value)
    }, []
  )

  const handleFilterSubmit = useCallback(
    () => {
      console.log(`routeDiff`, routeDiff)
      console.log(`routeType`, routeType)
      onFilter && onFilter({routeType, routeDiff})
    },
    [routeDiff, routeType, onFilter]
  )

  return (
    <Container fluid ref={filtersRef} className={`py-4`}>
      <Row className="mb-3">
        <Col xl={6} xs={12} className="mb-xl-0 mb-2">
          <Button size={`lg`} style={{width: '100%'}} onClick={onShowAll}>
            { t('filters.showAllBtn') }
          </Button>
        </Col>
        <Col xl={6} xs={12}>
          <Button size={`lg`} style={{width: '100%'}} onClick={onClearMap}>
          { t('filters.clearMapBtn') }
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">


      <Form.Group as={Col} controlId="routeDiff">
        <Form.Label> { t('filters.diffSelectLabel') }</Form.Label>
        <Form.Select 
          name="routeDiff" 
          required 
          value={routeDiff}
          onChange={handleRouteDiff}  
        >
          <option value="-1"> { t('filters.diffSelect.key_0') } </option>
          <option value="0">  { t('filters.diffSelect.key_1') } </option>
          <option value="1">  { t('filters.diffSelect.key_2') } </option>
          <option value="2">  { t('filters.diffSelect.key_3') } </option>
          <option value="3">  { t('filters.diffSelect.key_4') } </option>
        </Form.Select>
      </Form.Group>
      <Form.Group as={Col} controlId="routeType">
        <Form.Label>{ t('filters.typeSelectLabel') }</Form.Label>
        <Form.Select 
          name="routeType" 
          required 
          value={routeType}
          onChange={handleRouteType}  
        >
          <option value="-1"> { t('filters.typeSelect.key_0') } </option>
          <option value="0">  { t('filters.typeSelect.key_1') } </option>
          <option value="1">  { t('filters.typeSelect.key_2') } </option>
          <option value="2">  { t('filters.typeSelect.key_3') } </option>
          <option value="3">  { t('filters.typeSelect.key_4') } </option>
        </Form.Select>
      </Form.Group>

      </Row>

      <Row className="">
        <Col xs={12}>
          <Button className="w-100" size={`lg`} onClick={handleFilterSubmit}>
          { t('filters.filterBtn') }
          </Button>
        </Col>
      </Row>

      </Container>
  )
}

export default RoutesFilter