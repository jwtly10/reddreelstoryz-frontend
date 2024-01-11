import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/override.css";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ConfigProvider, theme } from "antd";
import debug from "./utils/debug";

// Make debug globally accessible (in a browser environment)
if (typeof window !== "undefined") {
  (window as any).debug = debug;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </ConfigProvider>
  </React.StrictMode>,
);
