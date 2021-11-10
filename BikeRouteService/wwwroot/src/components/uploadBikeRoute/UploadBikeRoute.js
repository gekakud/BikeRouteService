import { useCallback, useState, useEffect, useRef } from "react"
import "./index.scss"
import { Modal, Form, Row, Col, Button } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import { instance } from "../../api/api"

const UploadBikeRoute = ({show, uploadModalToggler, handleRefreshMap}) => {
  const [upload, setUpload] = useState(false)
  const [formData, setFormData] = useState(null)
  const formRef = useRef(null)

  const [routeName, setRouteName] = useState('')
  const [routeDiff, setRouteDiff] = useState('Beginner')
  const [routeType, setRouteType] = useState('Mixed')

  const { t } = useTranslation()

  const handleClose = useCallback(() => {
    uploadModalToggler(false)
  }, [uploadModalToggler])

  const handleUpload = useCallback((e) => {
    console.log(`e`, e)
    e.preventDefault();

    console.log(`formRef.current`, formRef.current)

    const formData = new FormData(formRef.current)

    const data = Object.fromEntries(formData.entries())
    setUpload(true)
    setFormData(data)
  }, [])

  useEffect(() => {

    console.log(`formData`, formData)

    if (upload && formData) {
      const { file, routeDiff, routeName, routeType } = formData

      instance
        .post(`UploadFile?routeName=${routeName}&difficulty=${routeDiff}&routeType=${routeType}`, {
          data: file,
        })
        .then(response => {
          if (response.status === 200) {
            toast.success('File is uploaded successfully')

            handleRefreshMap()

            uploadModalToggler(false)
          }
        })
        .catch(e => {
          toast.error(e.message)

          uploadModalToggler(false)

        })
    }
  }, [upload, formData, handleRefreshMap, uploadModalToggler])

  return (
    <Modal 
      show={show}
      backdrop="static"
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{ t('uploadFormTitle') }</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleUpload} ref={formRef}>
          <Form.Group as={Col} className="mb-3"controlId="formRouteName">
            <Form.Label>{ t('routeName') }</Form.Label>
            <Form.Control placeholder={ t('routeName') } name="routeName" required 
              onChange={e => setRouteName(e.currentTarget.value)}
              value={routeName} 
            />
          </Form.Group>

          <Row className="mb-3">
            <Col sm xs={12} className="mb-sm-0 mb-3" >
              <Form.Group as={Col} controlId="routeDiff">
                <Form.Label>{ t('filters.diffSelectLabel') }</Form.Label>
                <Form.Select 
                  name="routeDiff" 
                  required 
                  onChange={e => setRouteDiff(e.currentTarget.value)}
                  value={routeDiff} 
                >

                  <option value="Beginner">     { t('filters.diffSelect.key_1') } </option>
                  <option value="Intermediate"> { t('filters.diffSelect.key_2') } </option>
                  <option value="Proficient">   { t('filters.diffSelect.key_3') } </option>
                  <option value="Beast">        { t('filters.diffSelect.key_4') } </option>
                </Form.Select>
              </Form.Group>
            </Col>
           
            <Col sm xs={12}>
              <Form.Group as={Col} controlId="routeType">
                <Form.Label>{ t('filters.typeSelectLabel') }</Form.Label>
                <Form.Select 
                  name="routeType" 
                  required 
                  onChange={e => setRouteType(e.currentTarget.value)}
                  value={routeType}
                >
                  <option value="Mtb">    { t('filters.typeSelect.key_1') } </option>
                  <option value="Gravel"> { t('filters.typeSelect.key_2') } </option>
                  <option value="Road">   { t('filters.typeSelect.key_3') } </option>
                  <option value="Mixed">  { t('filters.typeSelect.key_4') } </option>
                </Form.Select>
              </Form.Group>
            </Col>

          </Row>

          <Form.Group className="position-relative mb-3">
            <Form.Label> { t('file') } </Form.Label>
            <Form.Control
              type="file"
              required
              name="file"
              accept=".gpx, .geojson, .kml"
              // onChange={handleChange}
              // isInvalid={!!errors.file}
            />

          </Form.Group>
    
          <Button className="w-100" variant="primary" type="submit" size="lg">
            { t('uploadBtn') }
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default UploadBikeRoute