import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "../pages/Home.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import NavbarComponent from "../components/NavbarComponent.tsx";
import {useAuth} from "../contexts/AuthContext.tsx";
import Generate from "../pages/Generate.tsx";

export default function AppRouter() {
    const { isAuthenticated} = useAuth()
  return (
    <BrowserRouter>
        <NavbarComponent />
      <Routes>
          <Route path="/" element={<Home />} />
          {isAuthenticated ? (
              <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/generate" element={<Generate />} />
              </>
          ): (
              <Route path="/dashboard" element={<Navigate to="/"/>}/>
          )}
      </Routes>
    </BrowserRouter>
  );
}