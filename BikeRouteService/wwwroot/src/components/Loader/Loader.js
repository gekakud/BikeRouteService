import { Container, Row, Spinner } from "react-bootstrap"
import styles from './index.module.scss'


const Loader = (props) => {
  return (
    <Container fluid  className={props.fullViewport ? styles.full : ''} >
      <Row className={`justify-content-center py-5 ${props.fullViewport ? `align-items-center ${styles.full}`: ''} `} >
        <Spinner role="status" animation="border" size="lg" />
      </Row>
    </Container>
  )
}


export default Loader