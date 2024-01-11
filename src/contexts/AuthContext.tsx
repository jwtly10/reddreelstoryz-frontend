import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import axios, { AxiosError } from "axios";
import AuthError from "../exceptions/AuthError.ts";
import SessionExpiredModalComponent from "../components/SessionExpiredModalComponent.tsx";
import { jwtDecode } from "jwt-decode";
import debug from "../utils/debug.ts";

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
  setAuthToken: (token: string | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setShowSessionsExpiredModal?: (showSessionsExpiredModal: boolean) => void;
}

const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

const removeAuthToken = () => {
  delete axios.defaults.headers.common["Authorization"];
};

const apiBaseUrl = import.meta.env.VITE_SERVER_URL as string;

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSessionsExpiredModal, setShowSessionsExpiredModal] =
    useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      debug("No token stored, no current session");
    } else {
      if (validateTokenLocally(storedToken)) {
        setIsAuthenticated(true);
      } else {
        console.error("Token is not valid, please log out");
        logout();
        setShowSessionsExpiredModal(true);
      }
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    debug("Logging in");
    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/v1/auth/authenticate`,
        {
          email,
          password,
        },
      );

      const token: string = response.data.token;
      localStorage.setItem("token", token);
      setAuthToken(token);
      setIsAuthenticated(true);
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const signup = async (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ) => {
    debug("Signing up");
    try {
      const response = await axios.post(`${apiBaseUrl}/api/v1/auth/register`, {
        firstname,
        lastname,
        email,
        password,
      });
      const token: string = response.data.token;
      localStorage.setItem("token", token);
      setAuthToken(token);
      setIsAuthenticated(true);
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const logout = () => {
    debug("Logging out");
    // Delete local storage token
    localStorage.removeItem("token");
    // Remove token from axios
    removeAuthToken();
    setIsAuthenticated(false);
  };

  // const validateToken = async (token: string | null): Promise<boolean> => {
  //   if (!token) {
  //     // No token, consider it invalid
  //     return false;
  //   }
  //
  //   try {
  //     const response = await axios.post(`${apiBaseUrl}/api/v1/auth/validate`, {
  //       token,
  //     });
  //
  //     return response.status === 200;
  //
  //   } catch (error) {
  //     console.error('Token validation failed:', error);
  //     return false; // Consider it invalid in case of any error
  //   }
  // };

  const validateTokenLocally = (token: string) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp) {
        return decodedToken.exp > currentTime;
      }

      return false;
    } catch (error) {
      console.error("Token validation failed:", error);
      return false;
    }
  };

  const handleAuthError = (error: AxiosError) => {
    if (error.response?.status === 401 || error.response?.status === 409) {
      const errorResponse = error.response.data as
        | { error: string }
        | undefined;
      if (errorResponse) {
        const errorMessage = errorResponse.error;
        console.error(`Login failed: ${errorMessage}}`);
        throw new AuthError(errorMessage);
      } else {
        console.error(`Login failed: Unknown Error`);
        throw new Error("Unknown Error");
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        signup,
        logout,
        setAuthToken,
        setIsAuthenticated,
      }}
    >
      {loading ? null : (
        <>
          {children}
          <SessionExpiredModalComponent
            showModal={showSessionsExpiredModal}
            handleOk={() => {
              setShowSessionsExpiredModal(false);
              logout();
            }}
          />
        </>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
