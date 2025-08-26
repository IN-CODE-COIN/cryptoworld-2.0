import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";
import "./index.css";
import "./App.css";
import { ThemeProvider } from "./context/ThemeProvider.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";
import App from "./App.tsx";
import { App as AntApp } from "antd";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AntApp>
            <App />
          </AntApp>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
