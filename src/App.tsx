import {useAuth} from './contexts/AuthContext'
import  {useEffect} from "react";
import AppRouter from "./router/AppRouter.tsx";

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
      <AppRouter />
  )
}

export default App
