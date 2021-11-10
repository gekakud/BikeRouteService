import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback } from 'react'
import styles from './index.module.scss';
import { Button } from 'react-bootstrap';

const FiltersToggler = ({setIsFiltersOpen, isFiltersOpen, isMapOpen, mobile}) => {  
  const handleToggle = useCallback(
    () => {
      setIsFiltersOpen(isOpen => !isOpen)
    },
    [setIsFiltersOpen],
  )

  return (
    <Button className={`${styles.toggler} ${mobile ? styles.mobile : null} ${isMapOpen ? 'd-none' : null} `} onClick={handleToggle}>
      { isFiltersOpen && <FontAwesomeIcon icon={ mobile ? `list` : `arrow-left`}  /> }
      { !isFiltersOpen && <FontAwesomeIcon icon={ mobile ? `filter` : `arrow-right` }  /> }
    </Button>
  )
}

export default FiltersToggler