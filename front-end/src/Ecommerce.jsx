import React from "react";
import { Registro } from "./Routes/Registro.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { NavBar } from "./Components/NavBar.jsx";
import { Routes, Route } from "react-router-dom";
import { Home } from "./Routes/Home.jsx";
import { Login } from "./Routes/Login.jsx";
import { CrearProducto } from "./Routes/CrearProducto.jsx";
import { SearchProvider } from "./context/SearchProvider.jsx";
import { CarritoProvider } from "./context/CarritoProvider.jsx";
import { Carrito } from "./Routes/Carrito.jsx";
import { Footer } from "./Components/Footer.jsx";
import { Box } from "@mui/material";
import { TodasVentasAdmin } from "./Routes/TodasVentasAdmin.jsx";
import { VentasVendedor } from "./Routes/VentasVendedor.jsx";
import { ComprasComprador } from "./Routes/ComprasComprador.jsx";
import { ToastContainer } from "react-toastify";

export const Ecommerce = () => {
  return (
    <AuthProvider>
      <SearchProvider>
        <CarritoProvider>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <NavBar></NavBar>
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<Home></Home>}></Route>
                <Route path="/registro" element={<Registro></Registro>}></Route>
                <Route path="/login" element={<Login></Login>}></Route>
                <Route
                  path="/todasVentasAdmin"
                  element={<TodasVentasAdmin></TodasVentasAdmin>}
                ></Route>
                <Route
                  path="/ventasVendedor"
                  element={<VentasVendedor></VentasVendedor>}
                ></Route>
                <Route
                  path="/comprasComprador"
                  element={<ComprasComprador></ComprasComprador>}
                ></Route>
                <Route
                  path="/crearProducto"
                  element={<CrearProducto></CrearProducto>}
                ></Route>
                <Route path="/carrito" element={<Carrito></Carrito>}></Route>
              </Routes>
            </Box>
            <Footer></Footer>
            <ToastContainer
              position="top-right"
              autoClose={3000}
            ></ToastContainer>
          </Box>
        </CarritoProvider>
      </SearchProvider>
    </AuthProvider>
  );
};
