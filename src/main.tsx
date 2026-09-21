import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { TenantProvider } from "./context/TenantContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { defaultTenant } from "./config/tenant";
import "./styles/index.css";
import { BrowserRouter } from "react-router-dom";
import { ApiLoadingProvider } from "./context/ApiLoadingContext";
import { AuthProvider } from "./features/auth/AuthContext";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element was not found.");
}

createRoot(root).render(
  <StrictMode>
    <ThemeProvider>
      <NotificationProvider position="top-right" maxToasts={5}>
        <TenantProvider tenant={defaultTenant}>
          <ApiLoadingProvider>
            <BrowserRouter>
              <AuthProvider>
                <App />
              </AuthProvider>
            </BrowserRouter>
          </ApiLoadingProvider>
        </TenantProvider>
      </NotificationProvider>
    </ThemeProvider>
  </StrictMode>,
);
