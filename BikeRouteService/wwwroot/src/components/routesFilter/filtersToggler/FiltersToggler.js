import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useCallback } from 'react'
import styles from './index.module.scss';

const FiltersToggler = ({setIsFiltersOpen, isFiltersOpen}) => {  
  const handleToggle = useCallback(
    () => {
      setIsFiltersOpen(isOpen => !isOpen)
    },
    [],
  )

  return (
    <div className={styles.toggler} onClick={handleToggle}>
      { isFiltersOpen && <FontAwesomeIcon icon={faArrowLeft}  /> }
      { !isFiltersOpen && <FontAwesomeIcon icon={faArrowRight}  /> }
    </div>
  )
}

export default FiltersToggler