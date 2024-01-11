import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home.tsx";
import History from "../pages/History.tsx";
import NavbarComponent from "../components/NavbarComponent.tsx";
import { useAuth } from "../contexts/AuthContext.tsx";
import Generate from "../pages/Generate.tsx";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import SessionExpiredModalComponent from "../components/SessionExpiredModalComponent.tsx";
import debug from "../utils/debug.ts";
import LoginModalComponent from "../components/LoginModalComponent.tsx";
import { Footer } from "antd/es/layout/layout";

export default function AppRouter() {
  const { isAuthenticated, logout } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const checkTokenExpiration = () => {
      debug("Checking session expiration");
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp) {
          const expirationTimestamp = decodedToken.exp;
          const expirationDate = new Date(expirationTimestamp * 1000);
          const expirationDateString = expirationDate.toLocaleString(); // Adjust format as needed
          debug("Token expiration date:" + expirationDateString);
          const currentDate = new Date();
          const currentDateString = currentDate.toLocaleString(); // Adjust format as needed
          debug("Current date:" + currentDateString);

          if (decodedToken.exp * 1000 < Date.now()) {
            logout();
            setShowPopup(true);
          }
        }
      } else {
        // We have no auth token. just ensure they are logged out
        logout();
      }

      // If no token. Assume user is not logged in
    };

    const secondsToCheck = 10;
    const expirationCheckInterval = setInterval(
      checkTokenExpiration,
      secondsToCheck * 1000,
    );

    return () => {
      clearInterval(expirationCheckInterval);
    };
  }, [logout]);

  const handleClose = () => {
    setShowLoginModal(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <BrowserRouter>
        <NavbarComponent />
        <Routes>
          <Route path="/" element={<Home />} />
          {isAuthenticated ? (
            <>
              <Route path="/generate" element={<Generate />} />
              <Route path="/history" element={<History />} />
            </>
          ) : (
            <>
              <Route path="/generate" element={<Navigate to="/" />} />
              <Route path="/history" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>

        <SessionExpiredModalComponent
          showModal={showPopup}
          handleOk={() => {
            setShowPopup(false);
            logout();
            setShowLoginModal(true);
          }}
        />
        <LoginModalComponent handleClose={handleClose} open={showLoginModal} />
        <div style={{ textAlign: "center", marginTop: "auto" }}>
          <Footer style={{ marginTop: "5rem" }}>
            ai-content-generator ©{new Date().getFullYear()}{" "}
          </Footer>
        </div>
      </BrowserRouter>
    </div>
  );
}
