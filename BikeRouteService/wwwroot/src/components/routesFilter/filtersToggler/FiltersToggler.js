// import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback } from 'react'
import { Button } from 'react-bootstrap';
import styles from './index.module.scss';

const FiltersToggler = ({setIsFiltersOpen, isFiltersOpen}) => {  
  const handleToggle = useCallback(
    () => {
      setIsFiltersOpen(isOpen => !isOpen)
    },
    [setIsFiltersOpen],
  )

  return (
    <Button className={styles.toggler} onClick={handleToggle}>
      { isFiltersOpen && <FontAwesomeIcon icon='arrow-left'  /> }
      { !isFiltersOpen && <FontAwesomeIcon icon='arrow-right'  /> }
    </Button>
  )
}

export default FiltersToggler