import Container from 'react-bootstrap/Container'
import { useLocation } from 'react-router-dom'

function SiteFooter() {
  const location = useLocation()

  if (location.pathname.startsWith('/calendar')) {
    return null
  }

  return (
    <footer className="site-footer">
      <Container>
        <p className="footer-copy">AI Student Planner milestone project</p>
      </Container>
    </footer>
  )
}

export default SiteFooter
