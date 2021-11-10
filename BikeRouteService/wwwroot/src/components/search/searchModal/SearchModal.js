import { useCallback, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import { Modal, Button } from 'react-bootstrap'
import "./index.scss"

const SearchModal = ({onSearch}) => {
  
  const [search, setSearch] = useState('')
  const [ showModal, setShowModal ] = useState(false)
  
  const { t } = useTranslation()

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
      setSearch('')
      setShowModal(false)
    }, 
    [onSearch, search]
  )

  const handleSearchModalShow = useCallback(
    () => {
      setShowModal(true)
    },
    [],
  )
  const handleSearchModalClose = useCallback(
    () => {
      setShowModal(false)
    },
    [],
  )

  return (
    <>
      <div className={`show-search-button`} onClick={handleSearchModalShow}>
        <FontAwesomeIcon icon='search' /> &nbsp;
        {/* <i className={`${styles.fa} ${styles.faSearch}`}></i> */}
        <span>{t('search')}</span>
      </div>

      <Modal
        show={showModal}
        backdrop={true}
        onHide={handleSearchModalClose}
        centered
        className="search-modal"
      >
        {/* <Modal.Header closeButton>
          <Modal.Title>{ t('uploadFormTitle') }</Modal.Title>
        </Modal.Header> */}
        <Modal.Body className="d-flex justify-content-center">
          <form className="d-flex justify-content-center" onSubmit={handleSearch} >
            <div className={`header-search-input-item`}>
              <input
                type="text" 
                placeholder={t('routeName')}
                value={search}
                onChange={handleSearchInput}/>
            </div>
            <Button type="submit" className={`header-search-button`} >
              {t('search')}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default SearchModal