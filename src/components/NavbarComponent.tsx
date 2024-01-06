import { Container, Nav, Navbar } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import LoginModalComponent from "./LoginModalComponent";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function NavbarComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Check if the user is not authenticated and trying to access a protected route
    // TODO: Fix this interaction with the authcontext sessionexpirationmodal
    if (!isAuthenticated && location.pathname.startsWith("/history")) {
      setShowLoginModal(true);
    }

    if (!isAuthenticated && location.pathname.startsWith("/generate")) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated, location.pathname]);

  const handleLoginButtonClick = () => {
    setShowLoginModal(true);
  };

  const handleClose = () => {
    setShowLoginModal(false);
  };

  const handleLogoutButtonClick = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="dark"
        variant="dark"
        className="bg-body-tertiary"
      >
        <Container>
          <Navbar.Brand>
            <Link to={"/"} className="text-decoration-none text-white">
              Ai-Content-Generator
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            {isAuthenticated ? (
              <Nav>
                <Nav.Link
                  as={Link}
                  to={"/generate"}
                  className="text-decoration-none text-white"
                >
                  Generate
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to={"/history"}
                  className="text-decoration-none text-white"
                >
                  History
                </Nav.Link>
                <Nav.Link onClick={handleLogoutButtonClick}>Logout</Nav.Link>
              </Nav>
            ) : (
              <Nav>
                <Nav.Link onClick={handleLoginButtonClick}>Login</Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {showLoginModal && (
        <LoginModalComponent handleClose={handleClose} open={showLoginModal} />
      )}
    </>
  );
}

export default NavbarComponent;
