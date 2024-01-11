import { useAuth } from "./contexts/AuthContext";
import { useEffect } from "react";
import AppRouter from "./router/AppRouter.tsx";
import LandingPage from "./pages/LandingPage.tsx";

function App() {
  const { login, setAuthToken, setIsAuthenticated, isAuthenticated } =
    useAuth();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setAuthToken(storedToken);
      setIsAuthenticated(true);
    }
  }, [login, isAuthenticated]);

  // Hide the site and just show the landing page
  const getSecretAccessKey = () => {
    const accessKey = localStorage.getItem("accessKey");
    if (accessKey) {
      return accessKey;
    }
  };

  const KEY = import.meta.env.VITE_ACCESS_KEY as string;
  const urlParams = new URLSearchParams(window.location.search);
  const myParam = urlParams.get("accessKey");

  if (getSecretAccessKey() == KEY) {
    return (
      <>
        <AppRouter />
      </>
    );
  } else {
    if (myParam === KEY) {
      // Store token in local storage
      localStorage.setItem("accessKey", myParam);
      return (
        <>
          <AppRouter />
        </>
      );
    } else {
      return (
        <div>
          <LandingPage />
        </div>
      );
    }
  }
}

export default App;
