import { useCallback } from "react"
import "./index.scss"
import { Modal, Form, Row, Col, Button, FloatingLabel } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import { instance } from "../../api/api"
import { Formik } from "formik"
import * as yup from 'yup'

const acceptedExt = ['.gpx', '.geojson', '.kml']

const schema = yup.object().shape({
  routeName: yup.string().required('Name is required').min(2, 'Too short for name'),
  routeDiff: yup.string().required('Type is required'),
  routeType: yup.string().required('Difficulty is required'),
  routeFile: yup.mixed().required('File is required').test('routeFileFormat', `Allowed extrensions: ${acceptedExt.join(', ')}`, value => {
    // console.log('value', value);
    const ext = value && value.name.match(/\..*$/)

    if (ext) {
        return value && acceptedExt.includes(ext[0])
    }
  }),
  routeDescription: yup.string()
});

const UploadBikeRoute = ({show, uploadModalToggler}) => {
  const { t } = useTranslation()

  const handleClose = useCallback(() => {
    uploadModalToggler(false)
  }, [uploadModalToggler])

  const onSubmit = useCallback(
    (values, {resetForm, setFieldValue}) => {

      const data = new FormData();

      for ( const [key, value] of Object.entries(values) ) {
        data.append(key, value)
      }

      instance
        // .post(`UploadFile?`, 
        .post(`UploadFile?routeName=${values.routeName}&difficulty=${values.routeDiff}&routeType=${values.routeType}`, 
          {
            data,
          },
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )

        .then(response => {
          if (response.status === 200) {
            toast.success('File is uploaded successfully')

            resetForm()
            setFieldValue('routeFile', null)

            toast.success('File successfuly uploaded')
            // uploadModalToggler(false)
          }
        })
        .catch(e => {
          toast.error(e.message)

          // uploadModalToggler(false)

        })
    },
    [],
  )

    // const handleFileChange = useCallback(
    //   (e) => {
    //     setFieldValue('routeFile', e.currentTarget.files[0])
    //   },
    //   [],
    // )

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
        <Formik 
          validationSchema={schema}
          onSubmit={onSubmit}
          validateOnChange
          initialValues={{
            routeName: '',
            routeDiff: 'Beginner',
            routeType: 'Mixed',
            routeFile: '',
            routeDescription: ''
          }}
        >
          {
            ({
              handleSubmit,
              handleChange,
              // handleBlur,
              values,
              touched,
              // isValid,
              errors,
              setFieldValue
            }) => (
              <Form onSubmit={handleSubmit} >
                <Form.Group as={Col} className="mb-3"controlId="formRouteName">
                  <Form.Label>{ t('routeName') }</Form.Label>
                  <Form.Control 
                    placeholder={ t('routeName') } 
                    name="routeName" 
                    onChange={handleChange}
                    // onBlur={handleBlur}
                    value={values.routeName}
                    isValid={touched.routeName && !errors.routeName}
                    isInvalid={touched.routeName && errors.routeName}
                  />

                  <Form.Control.Feedback type={ touched.routeName && errors.routeName ? 'invalid' : 'valid'  }>
                    {errors.routeName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row className="mb-3">
                  <Col sm xs={12} className="mb-sm-0 mb-3" >
                    <Form.Group as={Col} controlId="routeDiff">
                      <Form.Label>{ t('filters.diffSelectLabel') }</Form.Label>
                      <Form.Select 
                        name="routeDiff" 
                        onChange={handleChange}
                        value={values.routeDiff} 
                      >

                        <option value="Beginner">     { t('filters.diffSelect.key_1') } </option>
                        <option value="Intermediate"> { t('filters.diffSelect.key_2') } </option>
                        <option value="Proficient">   { t('filters.diffSelect.key_3') } </option>
                        <option value="Beast">        { t('filters.diffSelect.key_4') } </option>
                      </Form.Select>

                      <Form.Control.Feedback type={ touched.routeDiff && errors.routeDiff ? 'invalid' : 'valid'  }>
                        {errors.routeDiff}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                
                  <Col sm xs={12}>
                    <Form.Group as={Col} controlId="routeType">
                      <Form.Label>{ t('filters.typeSelectLabel') }</Form.Label>
                      <Form.Select 
                        name="routeType" 
                        onChange={handleChange}
                        value={values.routeType}
                      >
                        <option value="Mtb">    { t('filters.typeSelect.key_1') } </option>
                        <option value="Gravel"> { t('filters.typeSelect.key_2') } </option>
                        <option value="Road">   { t('filters.typeSelect.key_3') } </option>
                        <option value="Mixed">  { t('filters.typeSelect.key_4') } </option>
                      </Form.Select>

                      <Form.Control.Feedback type={ touched.routeType && errors.routeType ? 'invalid' : 'valid'  }>
                        {errors.routeType}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                </Row>

                <Form.Group className="position-relative mb-3">
                  <Form.Label> { t('file') } </Form.Label>
                  <Form.Control
                    type="file"
                    name="routeFile"
                    // value={values.routeFile}
                    // accept=".gpx, .geojson, .kml"
                    onChange={(e) => setFieldValue('routeFile', e.currentTarget.files[0])}
                    // isInvalid={!!errors.file}
                    isValid={touched.routeFile && !errors.routeFile}
                    isInvalid={touched.routeFile && errors.routeFile}
                  />
                  <Form.Control.Feedback type={ touched.routeFile && errors.routeFile ? 'invalid' : 'valid'  }>
                    {errors.routeFile}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <FloatingLabel controlId="routeDescription" label={t('description')} >
                    <Form.Control
                      as="textarea"
                      placeholder="Leave a comment here"
                      style={{ height: '100px' }}
                      onChange={handleChange}
                      name="routeDescription"
                      value={values.routeDescription}
                    />
                  </FloatingLabel>
                </Form.Group>
          
                <Button className="w-100" variant="primary" type="submit" size="lg">
                  { t('uploadBtn') }
                </Button>
              </Form>
            )
          }

        </Formik>
      </Modal.Body>
    </Modal>
  )
}

export default UploadBikeRoute