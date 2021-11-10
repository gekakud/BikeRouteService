import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback } from 'react'
import styles from './index.module.scss';
import { Button } from 'react-bootstrap';

const MapToggler = ({setIsMapOpen, isMapOpen, mobile}) => {  
  const handleToggle = useCallback(
    () => {
      setIsMapOpen(isOpen => !isOpen)
    },
    [setIsMapOpen],
  )

  return (
    <Button className={`${styles.toggler} ${mobile ? styles.mobile : null}`} onClick={handleToggle}>
      { !isMapOpen && <FontAwesomeIcon icon={ mobile ? `map` : `arrow-left`}  /> }
      { isMapOpen && <FontAwesomeIcon icon={ mobile ? `list` : `arrow-right` }  /> }
    </Button>
  )
}

export default MapToggler