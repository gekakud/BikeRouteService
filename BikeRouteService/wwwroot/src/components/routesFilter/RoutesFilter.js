import { useState, useCallback, useRef, useEffect } from 'react'
import { Col, Container, Row, Button, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const RoutesFilter = ({onFilter, onClearMap, onShowAll, hideFiltersCondition, setFiltersHeight}) => {

  const [routeDiff, setRouteDiff] = useState('-1')
  const [routeType, setRouteType] = useState('-1')

  const ref = useRef()

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
      onFilter && onFilter({routeType, routeDiff})
    },
    [routeDiff, routeType, onFilter]
  )

  useEffect(() => {

    if(!ref.current) return

    setFiltersHeight(ref.current.clientHeight)
    
    const config = {
      attributes: true,
      childList: false,
      subtree: false
    }

    const callback = function(mutationsList) {

      const { target: { clientHeight } } = mutationsList[0]

      setFiltersHeight && setFiltersHeight(clientHeight)
    };
      
    const observer = new MutationObserver(callback);
         
    observer.observe(ref.current, config);

    return () => {
      if (observer)
        observer.disconnect()
    }

  }, [])

  return (
    <Container fluid ref={ref} className={`py-4 ${hideFiltersCondition ? 'd-none' : null}`}>
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

      <Col lg xs={12} className="mb-lg-0 mb-3">
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
      </Col>
      <Col lg xs={12}>
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
      </Col>
      

      

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