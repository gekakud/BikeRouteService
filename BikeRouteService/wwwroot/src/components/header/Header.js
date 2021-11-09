// import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useState, useRef, useEffect } from 'react'
import { Container, Dropdown, DropdownButton, Row, Col, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
// import Icon from '../Icon/Icon'

import styles from './Header.module.scss'

const lngs = {
  en: { nativeName: 'English' },
  ru: { nativeName: 'Russian' },
  he: { nativeName: 'Hebrew' }
}

const homeUrl = window.location.origin

const Header = ({uploadModalToggler, onSearch}) => {

  const [isSearchModal, setIsSearchModal] = useState(false)

  const documentRootRef = useRef(document.querySelector('html'));

  const { t, i18n } = useTranslation()

  const handleAddRoute = useCallback((e)=>{
    e.preventDefault()
    
    uploadModalToggler()
  }, [uploadModalToggler])

  const [search, setSearch] = useState('')

  const handleSearchInput = useCallback(
    (e) => {
      setSearch(e.target.value)
    }, 
    []
  )
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault()
      onSearch && onSearch(search)
    }, 
    [onSearch, search]
  )

  const handleLangChange = useCallback(
    (lng) => {
      i18n.changeLanguage(lng)
      documentRootRef.current.lang = lng
      documentRootRef.current.dir = i18n.dir(lng)
    }
    ,
    [i18n]
  )

  useEffect(() => {
    documentRootRef.current.lang = i18n.resolvedLanguage
    documentRootRef.current.dir = i18n.dir(i18n.resolvedLanguage)
    // console.log(`init lang`)
  }, [])

  useEffect(() => {
    const handleWindowResize = () => {
      if (window.innerWidth <= 992) {
        setIsSearchModal(true)
      }
    }

    handleWindowResize();

    window.removeEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, )

  return (
    <Container as="header" fluid className={`${styles.mainHeader} ${styles.darkHeader} ${styles.fsHeader} `} >
      <Row className={`${styles.headerInner} align-items-center`}>
            <Col lg="auto" xs={3} className={`${styles.logoHolder}`}>
                <a href={homeUrl}>
                  <img src="logo.png" alt="" />
                </a>
            </Col>

            <Col xs="auto" className={`${styles.headerSearch} ${styles.visHeaderSearch} ms-3`}>
              <form onSubmit={handleSearch} >
                <div className={`${styles.headerSearchInputItem}`}>
                    <input type="text" placeholder={t('routeName')} value={search}  onChange={handleSearchInput}/>
                </div>
                <Button type="submit" className={`${styles.headerSearchButton}`} >
                  {t('search')}
                </Button>
                {/* <button type="submit" className={`${styles.headerSearchButton}`}>{t('search')}</button> */}
              </form>
                
            </Col>

            <div className={`${styles.showSearchButton}`}>
              <FontAwesomeIcon icon='search' />
              {/* <i className={`${styles.fa} ${styles.faSearch}`}></i> */}
              <span>{t('search')}</span>
            </div>
            
            <Col  xs={ {span: 'auto'} } className={`ms-auto`} >
              <DropdownButton id="lang-switcher" title={i18n.resolvedLanguage} >
                {
                Object.keys(lngs).map( (lng, i) => (<Dropdown.Item 
                      key={lng} 
                      href={`/${lng}`}
                      // style={{ fontWeight: i18n.resolvedLanguage === lng ? 'bold' : 'normal' }} 
                      onClick={(e) => { e.preventDefault(); handleLangChange(lng) }}  
                    >
                      
                      {lng}
                      {/* <Icon icon={lng} /> */}
                    </Dropdown.Item>)
                  )
                }
              </DropdownButton>
            
            </Col>
            
            <Col xs="auto">
              <Button onClick={handleAddRoute}  className={`${styles.addList}`}>
                {t('addRoute')}
                <span>
                  <FontAwesomeIcon icon='plus' />
                </span>
              </Button>
              {/* <a href="/" className={`${styles.addList}`} onClick={handleAddRoute}>
                {t('addRoute')}
                <span>
                  <FontAwesomeIcon icon='plus' />
                </span>
              </a> */}
            </Col>
      </Row>
    </Container>
    
  )
}

export default Header