import { useCallback, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const Search = ({onSearch}) => {
  
  const [search, setSearch] = useState('')
  
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
    }, 
    [onSearch, search]
  )

  return (
    <>
      <form onSubmit={handleSearch} >
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
    </>
  )
}

export default Search