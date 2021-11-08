import { useCallback, useState, useEffect, useRef } from "react"
import { Modal, Form, Row, Col, Button } from "react-bootstrap"
import { toast } from "react-toastify"
import { instance } from "../../api/api"

const UploadBikeRoute = ({show, uploadModalToggler, handleRefreshMap}) => {
  const [upload, setUpload] = useState(false)
  const [formData, setFormData] = useState(null)
  const formRef = useRef(null)

  const [routeName, setRouteName] = useState('')
  const [routeDiff, setRouteDiff] = useState('Beginner')
  const [routeType, setRouteType] = useState('Mixed')

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
        <Modal.Title>Want to add a bike route?</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleUpload} ref={formRef}>
          <Form.Group as={Col} className="mb-3"controlId="formRouteName">
            <Form.Label>Route Name</Form.Label>
            <Form.Control placeholder="Route Name" name="routeName" required 
              onChange={e => setRouteName(e.currentTarget.value)}
              value={routeName} 
            />
          </Form.Group>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridDiff">
              <Form.Label>Route Difficulty</Form.Label>
              <Form.Select 
                defaultValue="Begginer" 
                name="routeDiff" 
                required 
                onChange={e => setRouteDiff(e.currentTarget.value)}
                value={routeDiff} 
              >

                <option>Begginer</option>
                <option>Intermediate</option>
                <option>Proficient</option>
                <option>Beast</option>
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridType">
              <Form.Label>Route Type</Form.Label>
              <Form.Select 
                defaultValue="Mixed" 
                name="routeType" 
                required 
                onChange={e => setRouteType(e.currentTarget.value)}
                value={routeType}
              >
                <option>Mtb</option>
                <option>Gravel</option>
                <option>Road</option>
                <option>Mixed</option>
              </Form.Select>
            </Form.Group>
          </Row>
          <Form.Group className="position-relative mb-3">
            <Form.Label>File</Form.Label>
            <Form.Control
              type="file"
              required
              name="file"
              // onChange={handleChange}
              // isInvalid={!!errors.file}
            />

          </Form.Group>
    
          <Button className="w-100" variant="primary" type="submit" size="lg">
            Upload
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default UploadBikeRoute