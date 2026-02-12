import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext.jsx";
import { VendorProvider } from "./context/VendorContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <VendorProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </VendorProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
