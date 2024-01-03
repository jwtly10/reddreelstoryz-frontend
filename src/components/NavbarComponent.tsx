import { Container, Nav, Navbar } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import LoginModalComponent from './LoginModalComponent'
import { useState } from 'react'

function NavbarComponent() {
  const { isAuthenticated, logout } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleLoginButtonClick = () => {
    setShowLoginModal(true)
  }

  const handleClose = () => {
    setShowLoginModal(false)
  }

  const handleLogoutButtonClick = () => {
    logout()
  }

  return (
    <>
      <Navbar
        collapseOnSelect
        expand='lg'
        bg='dark'
        variant='dark'
        className='bg-body-tertiary'
      >
        <Container>
          <Navbar.Brand href='#home'>Ai-Content-Generator</Navbar.Brand>
          <Navbar.Toggle aria-controls='responsive-navbar-nav' />
          <Navbar.Collapse id='responsive-navbar-nav'>
            <Nav className='me-auto'></Nav>
            {isAuthenticated ? (
              <Nav>
                <Nav.Link href='#dashboard'>Dashboard</Nav.Link>
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
  )
}

export default NavbarComponent
