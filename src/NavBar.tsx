import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";

type NavBarProps = {
  loggedIn: boolean;
  onLogout: () => void;
};

const publicLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Login", to: "/login" },
];

const privateLinks = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Calendar", to: "/calendar" },
];

function NavBar({ loggedIn, onLogout }: NavBarProps) {
  const links = loggedIn ? privateLinks : publicLinks;

  return (
    <Navbar expand="md" sticky="top" className="app-navbar border-bottom bg-white">
      <Container fluid="xl" className="px-4 py-2">
        <Navbar.Brand
          as={NavLink}
          to="/"
          className="d-flex align-items-center gap-3 text-decoration-none"
        >
          <span className="app-navbar__badge">31</span>
          <span className="fs-5 fw-medium text-secondary-emphasis">Calendar</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="ms-auto align-items-md-center gap-2">
          {links.map((link) => (
            <Nav.Link
              key={link.to}
              as={NavLink}
              to={link.to}
              end={link.to === "/"}
              className="app-navbar__link rounded-pill px-3 py-2"
            >
              {link.label}
            </Nav.Link>
          ))}

          {loggedIn && (
            <Button
              type="button"
              variant="light"
              onClick={onLogout}
              className="app-navbar__logout rounded-pill border-0 px-3 py-2"
            >
              Logout
            </Button>
          )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
