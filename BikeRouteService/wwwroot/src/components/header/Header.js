// import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import LangSwitcher from '../langSwitcher/LangSwitcher'
import Logo from '../logo/Logo'
import Search from '../search/Search'
import SearchModal from '../search/searchModal/SearchModal'
// import Icon from '../Icon/Icon'

import './Header.scss'

const Header = ({uploadModalToggler, onSearch}) => {

  const { t } = useTranslation()

  const handleAddRoute = useCallback((e)=>{
    e.preventDefault()
    
    uploadModalToggler()
  }, [uploadModalToggler])  

  return (
    <Container as="header" fluid className={`main-header dark-header fs-header`} >
      <Row className={`header-inner align-items-center`}>
            <Col xl="auto" md={3} sm={4} xs={3} className={`logo-holder`}>
              <Logo />
            </Col>

            <Col xs="auto" className={`header-search vis-header-search ms-3 d-lg-block d-none`}>
              <Search onSearch={onSearch} />
            </Col>

            <Col className="d-lg-none d-block" xs="auto">
              <SearchModal onSearch={onSearch} />
            </Col>
            
            <Col  xs={ {span: 'auto'} } className={`ms-auto`} >
              <LangSwitcher />
            </Col>
            
            <Col xs={ {span: 'auto'} }>
              <Button onClick={handleAddRoute}  className={`add-list py-md-3 px-md-4 py-2 px-2`}>
                <span className={`d-md-inline d-none`}>
                  {t('addRoute')} &nbsp;
                </span>
                <span className={`add-icon`}>
                  <FontAwesomeIcon icon='plus' />
                </span>
              </Button>
            </Col>
      </Row>
    </Container>
    
  )
}

export default Header