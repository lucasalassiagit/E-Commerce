import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { ProductoCardComprador } from "../Components/ProductoCardComprador";
import { ProductoCardVendedor } from "../Components/ProductoCardVendedor";
import { ProductoCard } from "../Components/ProductoCard";
import { ProductoCardBorrado } from "../Components/ProductoCardBorrado";
import { useProductosPublic } from "../hooks/useProductosPublic";
import { useProductosVendedor } from "../hooks/useProductosVendedor";
import { useProductosBorrados } from "../hooks/useProductosBorrados";
import { useSearch } from "../context/SearchProvider";
import { CargaYError } from "../Components/CargaYError";
import { useCarrito } from "../context/CarritoProvider";
import {
  Container,
  Grid,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Paper,
  Fade,
  Grow,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";

export const Home = () => {
  const { usuario } = useAuth();
  const { terminoBusqueda, limpiarBusqueda } = useSearch();
  const [recargarProductos, setRecargarProductos] = useState(false);
  const { busquedaActual, setTerminoBusqueda } = useSearch();
  const { vaciarCarrito } = useCarrito();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  if (usuario === undefined) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  useEffect(() => {
    if (!usuario) {
      limpiarBusqueda();
    }
  }, [usuario, limpiarBusqueda]);

  const isVendedor = usuario?.rol === "Vendedor";
  const isAdmin = usuario?.rol === "Admin";
  const isComprador = usuario?.rol === "Comprador";

  const { productos, loadi, er } = useProductosPublic(
    "https://localhost:7162/api/productos",
    busquedaActual
  );

  const { productosVendedor, loading, error } = useProductosVendedor(
    "https://localhost:7162/api/productos/vendedor",
    usuario?.token || "",
    usuario?.username || "",
    recargarProductos
  );

  const { productosBorrados, load, err } = useProductosBorrados(
    "https://localhost:7162/api/productos/admin/productosInactivos",
    usuario?.token || "",
    recargarProductos
  );

  useEffect(() => {
    return () => {
      setTerminoBusqueda("");
    };
  }, [setTerminoBusqueda]);

  // Ancho mínimo de tarjeta
  const cardMinWidth = isMobile ? 260 : 280;

  return (
    <Container
      maxWidth={false} // ✅ Elimina el ancho máximo predeterminado
      sx={{
        mt: 4,
        mb: 6,
        px: isMobile ? 2 : 4,
        width: "100%",
      }}
    >
      {/* Hero Section solo para no logueados */}
      {!usuario && (
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 6,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.1
              )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.dark,
                mb: 2,
              }}
            >
              Descubre nuestros productos
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 800, mx: "auto", mb: 3 }}
            >
              Regístrate o inicia sesión para comenzar a comprar
            </Typography>
          </Paper>
        </Fade>
      )}

      {/* Contenido principal */}
      <Box sx={{ mt: usuario ? 0 : 4 }}>
        {!usuario && (
          <>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 600,
                mb: 4,
                color: theme.palette.text.primary,
                position: "relative",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: 0,
                  width: "80px",
                  height: "4px",
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: 2,
                },
              }}
            >
              Productos destacados
            </Typography>
            <CargaYError
              load={loadi}
              err={er}
              mensajeLoad={"Cargando todos los productos..."}
              mensajeErr={"Error al cargar los productos"}
            />
            <Grid
              container
              spacing={3}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "stretch",
              }}
            >
              {productos.map((producto, index) => (
                <Grow in timeout={(index + 1) * 200} key={producto.id}>
                  <Grid
                    item
                    sx={{
                      minWidth: { cardMinWidth },
                      flex: "1 1 auto", // ✅ Flex para ajustar automáticamente
                      maxWidth: "100%", // Evita overflow
                    }}
                  >
                    <ProductoCard producto={producto} />
                  </Grid>
                </Grow>
              ))}
            </Grid>
          </>
        )}

        {isComprador && (
          <>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 600,
                mb: 4,
                color: theme.palette.text.primary,
                position: "relative",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: 0,
                  width: "80px",
                  height: "4px",
                  backgroundColor: theme.palette.success.main,
                  borderRadius: 2,
                },
              }}
            >
              Productos disponibles
            </Typography>
            <CargaYError
              load={loadi}
              err={er}
              mensajeLoad={"Cargando todos los productos..."}
              mensajeErr={"Error al cargar los productos"}
            />
            <Grid
              container
              spacing={3}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "stretch",
              }}
            >
              {productos.map((producto, index) => (
                <Grow in timeout={(index + 1) * 200} key={producto.id}>
                  <Grid
                    item
                    sx={{
                      minWidth: { cardMinWidth },
                      flex: "1 1 auto",
                      maxWidth: "100%",
                    }}
                  >
                    <ProductoCardComprador producto={producto} />
                  </Grid>
                </Grow>
              ))}
            </Grid>
          </>
        )}

        {isVendedor && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  position: "relative",
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    bottom: -8,
                    left: 0,
                    width: "80px",
                    height: "4px",
                    backgroundColor: theme.palette.warning.main,
                    borderRadius: 2,
                  },
                }}
              >
                Tus productos
              </Typography>
            </Box>
            <CargaYError
              load={loading}
              err={error}
              mensajeLoad={"Cargando tus productos..."}
              mensajeErr={"Error al cargar tus productos"}
            />
            {productosVendedor.length === 0 && !loading && !error ? (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: "center",
                  backgroundColor: alpha(theme.palette.warning.light, 0.1),
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  No tenés productos publicados aún
                </Typography>
              </Paper>
            ) : (
              <Grid
                container
                spacing={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "stretch",
                }}
              >
                {productosVendedor.map((producto, index) => (
                  <Grow in timeout={(index + 1) * 200} key={producto.id}>
                    <Grid
                      item
                      sx={{
                        minWidth: { cardMinWidth },
                        flex: "1 1 auto",
                        maxWidth: "100%",
                      }}
                    >
                      <ProductoCardVendedor
                        producto={producto}
                        onRecargar={() => setRecargarProductos((prev) => !prev)}
                      />
                    </Grid>
                  </Grow>
                ))}
              </Grid>
            )}
          </>
        )}

        {isAdmin && (
          <>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 600,
                mb: 4,
                color: theme.palette.text.primary,
                position: "relative",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: 0,
                  width: "80px",
                  height: "4px",
                  backgroundColor: theme.palette.info.main,
                  borderRadius: 2,
                },
              }}
            >
              Productos activos
            </Typography>
            <CargaYError
              load={loadi}
              err={er}
              mensajeLoad={"Cargando productos..."}
              mensajeErr={"Error al cargar los productos"}
            />
            <Grid
              container
              spacing={3}
              sx={{ mb: 6, display: "flex", justifyContent: "center" }}
            >
              {productos.map((producto, index) => (
                <Grow in timeout={(index + 1) * 200} key={producto.id}>
                  <Grid
                    item
                    sx={{
                      minWidth: { cardMinWidth },
                      flex: "1 1 auto",
                      maxWidth: "100%",
                    }}
                  >
                    <ProductoCard producto={producto} />
                  </Grid>
                </Grow>
              ))}
            </Grid>

            <Divider
              sx={{
                my: 6,
                borderColor: alpha(theme.palette.divider, 0.2),
                borderBottomWidth: 2,
              }}
            />

            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 600,
                mb: 4,
                color: theme.palette.text.primary,
                position: "relative",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: 0,
                  width: "80px",
                  height: "4px",
                  backgroundColor: theme.palette.error.light,
                  borderRadius: 2,
                },
              }}
            >
              Productos borrados
            </Typography>
            <CargaYError
              load={load}
              err={err}
              mensajeLoad={"Cargando productos borrados..."}
              mensajeErr={"Error al cargar los productos borrados"}
            />
            <Grid
              container
              spacing={3}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              {productosBorrados.map((producto, index) => (
                <Grow in timeout={(index + 1) * 200} key={producto.id}>
                  <Grid
                    item
                    sx={{
                      minWidth: { cardMinWidth },
                      flex: "1 1 auto",
                      maxWidth: "100%",
                    }}
                  >
                    <ProductoCardBorrado producto={producto} />
                  </Grid>
                </Grow>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </Container>
  );
};
