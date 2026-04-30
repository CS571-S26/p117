import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { NavLink, useNavigate } from 'react-router-dom'
import { navItems } from '../data/siteContent'

function SiteNavbar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate()
  const visibleNavItems = isLoggedIn
    ? navItems.filter((item) => item.to !== '/login')
    : navItems

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  return (
    <Navbar expand="lg" className="site-navbar" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="brand-mark">
          AI Student Planner
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="site-navigation" />

        <Navbar.Collapse id="site-navigation">
          <Nav className="ms-auto align-items-lg-center gap-lg-2">
            {visibleNavItems.map((item) => (
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
            {isLoggedIn ? (
              <button
                type="button"
                className="nav-link app-nav-link border-0 bg-transparent"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : null}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default SiteNavbar
