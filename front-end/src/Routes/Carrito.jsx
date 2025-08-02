// Carrito.js
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Divider,
  Paper,
  Box,
  Fade,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import { useCarrito } from "../context/CarritoProvider";
import { NavLink, useNavigate, Navigate } from "react-router-dom";
import { CantidadSelector } from "../Components/CantidadSelector";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import { MensajeToast } from "../Components/MensajeToast";
import { useState } from "react";
import { ShoppingCart, Delete, ArrowBack } from "@mui/icons-material";

export const Carrito = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!usuario || usuario.rol !== "Comprador") {
    return <Navigate to="/" />;
  }

  const {
    carrito,
    eliminarProducto,
    vaciarCarrito,
    actualizarCantidad,
    incrementarCantidad,
    decrementarCantidad,
  } = useCarrito();

  const [toast, setToast] = useState({
    abierto: false,
    mensaje: "",
    tipo: "success",
  });

  const handleToast = (mensaje, tipo = "success") => {
    setToast({ abierto: true, mensaje, tipo });
    if (tipo === "success") {
      setTimeout(() => navigate("/"), 1500);
    }
  };

  const handleCerrarToast = () => {
    setToast((prev) => ({ ...prev, abierto: false }));
  };

  const realizarCompra = async () => {
    try {
      const venta = {
        usuarioId: usuario.id,
        detalles: carrito.map((producto) => ({
          productoId: producto.id,
          cantidad: producto.cantidad,
          precioUnitario: producto.precio,
        })),
      };

      await axios.post("https://localhost:7162/api/ventas", venta, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
        },
      });

      vaciarCarrito();
      handleToast("✅ Compra realizada con éxito", "success");
    } catch (error) {
      console.error("Error al realizar la compra", error);
      handleToast("❌ Hubo un error al procesar la compra", "error");
    }
  };

  const total = carrito.reduce(
    (acc, p) => acc + (p.precio ?? 0) * (p.cantidad ?? 1),
    0
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.default,
        pb: isMobile ? 12 : 6,
      }}
    >
      {/* Contenido principal */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: isMobile ? 14 : 6 }}>
        <Fade in timeout={500}>
          <Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight="bold"
              color="primary"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 3,
              }}
            >
              <ShoppingCart fontSize="large" />
              Carrito de Compras
            </Typography>

            {carrito.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 3,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  🛒 Tu carrito está vacío
                </Typography>
                <Button
                  component={NavLink}
                  to="/"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, textTransform: "none" }}
                >
                  Seguir comprando
                </Button>
              </Paper>
            ) : (
              <>
                <Grid container spacing={3}>
                  {carrito.map((producto, index) => (
                    <Grid item xs={12} sm={6} md={4} key={producto.id}>
                      <Fade in timeout={(index + 1) * 300}>
                        <Card
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: 2,
                            boxShadow: theme.shadows[3],
                            transition: "transform 0.2s, box-shadow 0.2s",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: theme.shadows[6],
                            },
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="160"
                            image={producto.imagenUrl}
                            alt={producto.nombre}
                            sx={{
                              objectFit: "contain",
                            }}
                          />
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography
                              variant="h6"
                              fontWeight="600"
                              sx={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {producto.nombre}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              mt={1}
                            >
                              <strong>Precio:</strong> $
                              {producto.precio?.toFixed(2)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Vendedor:</strong>{" "}
                              {producto.nombreVendedor}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Disponible:</strong> {producto.stock}
                            </Typography>

                            <Box mt={2}>
                              <Typography variant="body2" fontWeight="500">
                                Cantidad:
                              </Typography>
                              <CantidadSelector
                                cantidad={producto.cantidad ?? 1}
                                stock={producto.stock}
                                onIncrementar={() =>
                                  incrementarCantidad(producto.id)
                                }
                                onDecrementar={() =>
                                  decrementarCantidad(producto.id)
                                }
                                onCambiarCantidad={(cantidad) =>
                                  actualizarCantidad(producto.id, cantidad)
                                }
                              />
                            </Box>
                          </CardContent>
                          <CardActions
                            sx={{ justifyContent: "flex-end", p: 1.5 }}
                          >
                            <Button
                              size="small"
                              color="error"
                              onClick={() => eliminarProducto(producto.id)}
                              startIcon={<Delete fontSize="small" />}
                              sx={{ textTransform: "none" }}
                            >
                              Eliminar
                            </Button>
                          </CardActions>
                        </Card>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>

                {/* Resumen fijo en móvil */}
                <Paper
                  elevation={0}
                  sx={{
                    mt: 4,
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: alpha(theme.palette.background.paper, 1),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <Divider sx={{ mb: 2 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      Total:
                    </Typography>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                      ${total.toFixed(2)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={vaciarCarrito}
                      sx={{ textTransform: "none" }}
                    >
                      Vaciar carrito
                    </Button>

                    <Button
                      variant="contained"
                      color="success"
                      onClick={realizarCompra}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        px: 4,
                      }}
                    >
                      Realizar Compra
                    </Button>
                  </Box>
                </Paper>
              </>
            )}
          </Box>
        </Fade>
      </Container>

      {/* Botón de volver (fijo en móvil) */}
      <Box
        sx={{
          position: isMobile ? "fixed" : "static",
          bottom: isMobile ? 16 : "auto",
          left: isMobile ? 16 : "auto",
          zIndex: 10,
        }}
      >
        <Button
          component={NavLink}
          to="/"
          variant="outlined"
          color="secondary"
          startIcon={<ArrowBack />}
          sx={{
            textTransform: "none",
            backgroundColor: alpha(theme.palette.common.white, 0.9),
            backdropFilter: "blur(8px)",
            "&:hover": {
              backgroundColor: alpha(theme.palette.common.white, 1),
            },
          }}
        >
          Volver al inicio
        </Button>
      </Box>

      {/* Toast */}
      <MensajeToast
        open={toast.abierto}
        onClose={handleCerrarToast}
        severity={toast.tipo}
        message={toast.mensaje}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </Box>
  );
};
