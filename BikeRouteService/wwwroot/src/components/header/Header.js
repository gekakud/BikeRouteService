import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useState } from 'react'
import styles from './Header.module.scss'

const Header = ({uploadModalToggler, onSearch}) => {

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


  return (
    <header className={`${styles.mainHeader} ${styles.darkHeader} ${styles.fsHeader} ${styles.sticky}`}>
        <div className={`${styles.headerInner}`}>
            <div className={`${styles.logoHolder}`}>
                <a href="index.html"><img src="images/logo.png" alt="" /></a>
            </div>
            <div className={`${styles.headerSearch} ${styles.visHeaderSearch}`}>
              <form onSubmit={handleSearch} >
                <div className={`${styles.headerSearchInputItem}`}>
                    <input type="text" placeholder="Keywords" value={search}  onChange={handleSearchInput}/>
                </div>
                <button type="submit" className={`${styles.headerSearchButton}`}>Search</button>
              </form>
                
            </div>
            <div className={`${styles.showSearchButton}`}>
              <FontAwesomeIcon icon={faSearch} />
              {/* <i className={`${styles.fa} ${styles.faSearch}`}></i> */}
              <span>Search</span></div>
            <a href="dashboard-add-listing.html" className={`${styles.addList}`} onClick={handleAddRoute}>
              Add Bike Route
              <span>
                <FontAwesomeIcon icon={faPlus} />
                {/* <i className={`${styles.fa} ${styles.faPlus}`}></i> */}
              </span>
            </a>
        </div>
    </header>
  )
}

export default Header