import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { NavLink } from 'react-router-dom'
import { navItems } from '../data/siteContent'

function SiteNavbar() {
  return (
    <Navbar expand="lg" className="site-navbar" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="brand-mark">
          AI Smart Planner
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="site-navigation" />

        <Navbar.Collapse id="site-navigation">
          <Nav className="ms-auto align-items-lg-center gap-lg-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `nav-link app-nav-link${isActive ? ' active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default SiteNavbar
