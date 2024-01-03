import {useAuth} from './contexts/AuthContext'
import NavbarComponent from './components/NavbarComponent'
import {useEffect} from "react";

function App() {
    const {login, setAuthToken, setIsAuthenticated, isAuthenticated} = useAuth()

    useEffect(() => {
        const storedToken = localStorage.getItem('token');

        if (storedToken) {
            setAuthToken(storedToken);
            setIsAuthenticated(true);
        }
    }, [login, isAuthenticated]);

  return (
      <NavbarComponent />
  )
}

export default App
