import { Container, Nav, Navbar } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import LoginModalComponent from "./LoginModalComponent";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo-circle.png";

function NavbarComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Check if the user is not authenticated and trying to access a protected route
    if (!isAuthenticated && location.pathname.startsWith("/history")) {
      navigate("/");
    }

    if (!isAuthenticated && location.pathname.startsWith("/generate")) {
      // setShowLoginModal(true);
      navigate("/");
    }
  }, [isAuthenticated, location.pathname, navigate]);

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
            <Link to={"/"} className="text-decoration-none text-white d-flex">
              <img
                src={logo}
                style={{ height: 30, marginRight: "10px" }}
                alt={"Logo Img"}
              ></img>
              ReddReelStoryz
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto"></Nav>
            {isAuthenticated ? (
              <Nav>
                <Nav.Link as={NavLink} to={"/generate"}>
                  Generate
                </Nav.Link>
                <Nav.Link as={NavLink} to={"/history"}>
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
