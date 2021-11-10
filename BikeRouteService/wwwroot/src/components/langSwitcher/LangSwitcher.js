import { useRef, useCallback } from 'react'
import { DropdownButton, Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const lngs = {
  en: { nativeName: 'English' },
  ru: { nativeName: 'Russian' },
  he: { nativeName: 'Hebrew' },
  ua: { nativeName: 'Ukrainian' }
}

const LangSwitcher = () => {

  const documentRootRef = useRef(document.querySelector('html'));

  const { i18n } = useTranslation()


  const handleLangChange = useCallback(
    (lng) => {
      i18n.changeLanguage(lng)
      documentRootRef.current.lang = lng
      documentRootRef.current.dir = i18n.dir(lng)
    }
    ,
    [i18n]
  )

  // useEffect(() => {
  //   documentRootRef.current.lang = i18n.resolvedLanguage
  //   documentRootRef.current.dir = i18n.dir(i18n.resolvedLanguage)
  //   // console.log(`init lang`)
  // }, [])

  return (
    <DropdownButton id="lang-switcher" title={i18n.resolvedLanguage} className={`lang-switcher`} >
      {
        Object
          .keys(lngs)
          .map( lng => <Dropdown.Item
              key={lng} 
              href={`/${lng}`}
              onClick={(e) => { e.preventDefault(); handleLangChange(lng) }}  
            >                      
              {lng}
              {/* <Icon icon={lng} /> */}
            </Dropdown.Item>
          )
      }
    </DropdownButton>
  )
}

export default LangSwitcher