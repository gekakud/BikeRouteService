import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Col, Container, Row } from "react-bootstrap"
import Logo from "../logo/Logo"

const Footer = () => {
  return (
    <footer className="main-footer dark-footer  ">
      <div className="sub-footer">
        <Container >
          <Row className="align-items-center">
            <Col md={4} className="d-md-block d-flex justify-content-center">
              <Logo />
            </Col>
            <Col md={4} className="d-md-block py-md-0 py-4 d-flex justify-content-center">
              <div className="copyright"> &#169; IsraBike 2021.</div>
            </Col>
            <Col md={4} className="ms-md-auto d-md-block d-flex justify-content-center">
              <Row className="footer-social">
                <Col>
                  <a href="/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon className="blue-light" icon={["fab", "facebook"]} />
                  </a>
                </Col>
                <Col>
                  <a href="/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon className="blue-light" icon={["fab", "twitter"]} />
                  </a>
                </Col>
                <Col>
                  <a href="/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon className="blue-light" icon={["fab", "chrome"]} />
                  </a>
                </Col>
                <Col>
                  <a href="/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon className="blue-light" icon={["fab", "vk"]} />
                  </a>
                </Col>
                <Col>
                  <a href="/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon className="blue-light" icon={["fab", "whatsapp"]} />
                  </a>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  )
}

export default Footer