import { useRef } from "react"
import ReactHtmlParser from 'react-html-parser'

const Icon = (icon) => {
  const icons = useRef({
    he: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 800">
      <path d="M0 0h1100v800H0z" fill="#fff"/><path d="M0 75h1100v125H0zm0 525h1100v125H0z" fill="#0038b8"/>
      <path d="M423.816 472.853h252.368L550 254.295zM550 545.705l126.184-218.558H423.816z" fill="none" stroke="#0038b8" stroke-width="27.5"/>
    </svg>`,
    ru: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6">
      <path fill="#fff" d="M0 0h9v3H0z"/>
      <path fill="#DA291C" d="M0 3h9v3H0z"/>
      <path fill="#0032A0" d="M0 2h9v2H0z"/>
    </svg>`,
    en: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
      <clipPath id="a">
        <path d="M0 0v30h60V0z"/>
      </clipPath>
      <clipPath id="b">
        <path d="M30 15h30v15zv15H0zH0V0zV0h30z"/>
      </clipPath>
      <g clip-path="url(#a)">
        <path d="M0 0v30h60V0z" fill="#012169"/>
        <path d="M0 0l60 30m0-30L0 30" stroke="#fff" stroke-width="6"/>
        <path d="M0 0l60 30m0-30L0 30" clip-path="url(#b)" stroke="#C8102E" stroke-width="4"/>
        <path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/>
        <path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/>
      </g>
    </svg>`,
  })

  console.log(`icons.current`, icons.current)

  return <>
    {/* <svg viewBox={icons.current[icon].props.viewBox} xmlns={icons.current[icon].props.xmlns} >
      { icons.current[icon].props.children }
    </svg> */}
    { ReactHtmlParser(icons.current[icon]) }
  </>
}

export default Icon