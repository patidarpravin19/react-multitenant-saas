import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { TenantProvider } from "./context/TenantContext";
import { ThemeProvider } from "./context/ThemeContext";
import { defaultTenant } from "./config/tenant";
import "./styles/index.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element was not found.");
}

createRoot(root).render(
  <StrictMode>
    <ThemeProvider>
      <TenantProvider tenant={defaultTenant}>
        <App />
      </TenantProvider>
    </ThemeProvider>
  </StrictMode>,
);
