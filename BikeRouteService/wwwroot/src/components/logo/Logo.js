const homeUrl = window.location.origin

const Logo = props => {
  return (
    <a href={homeUrl}>
      <img src="logo.png" alt="Citybook" />
    </a>
  )
}

export default Logo