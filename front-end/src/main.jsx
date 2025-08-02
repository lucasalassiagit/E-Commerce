import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Registro } from "./Routes/Registro.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { NavBar } from "./Components/NavBar.jsx";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { Ecommerce } from "./Ecommerce.jsx";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <AuthProvider>
        <Ecommerce></Ecommerce>
      </AuthProvider>
    </StrictMode>
  </BrowserRouter>
);
