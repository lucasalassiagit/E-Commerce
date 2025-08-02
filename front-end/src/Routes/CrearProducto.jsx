// CrearProducto.js
import React, { useState, useEffect } from "react";
import { useForm } from "../hooks/useForm";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  InputLabel,
  FormHelperText,
  Paper,
  Fade,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import { toast } from "react-toastify";

export const CrearProducto = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Redirigir si no es vendedor
  if (!usuario || usuario.rol !== "Vendedor") {
    return <Navigate to="/" />;
  }

  // Cargar datos previos del sessionStorage
  const datosPrevios =
    JSON.parse(sessionStorage.getItem("datosProducto")) || {};

  const { formState, nombre, descripcion, precio, stock, onInputChange } =
    useForm({
      nombre: datosPrevios.nombre || "",
      descripcion: datosPrevios.descripcion || "",
      precio: datosPrevios.precio || "",
      stock: datosPrevios.stock || "",
    });

  const [imagen, setImagen] = useState(null);
  const [errores, setErrores] = useState({});

  // Guardar en sessionStorage en cada cambio
  useEffect(() => {
    sessionStorage.setItem(
      "datosProducto",
      JSON.stringify({ nombre, descripcion, precio, stock })
    );
  }, [nombre, descripcion, precio, stock]);

  const onsubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("precio", parseFloat(precio));
    formData.append("stock", parseInt(stock));
    if (imagen) formData.append("imagen", imagen);

    try {
      await axios.post("https://localhost:7162/api/productos", formData, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      sessionStorage.removeItem("datosProducto");
      toast.success("✅ Producto creado exitosamente");
      navigate("/");
    } catch (error) {
      const data = error?.response?.data;

      if (data?.errors) {
        setErrores(data.errors);
        toast.error("❌ Error al crear el producto");
      } else if (data?.mensajes) {
        toast.error(data.mensajes.join(", "));
      } else {
        toast.error("❌ Error inesperado");
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.03
        )} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
        padding: isMobile ? 2 : 0,
      }}
    >
      {/* Animación de entrada */}
      <Fade in timeout={600}>
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, sm: 5 },
            width: { xs: "100%", sm: 500 },
            borderRadius: 4,
            boxShadow: theme.shadows[12],
            backgroundColor: theme.palette.background.paper,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              width: 100,
              height: 100,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              borderRadius: "0 30px 0 100px",
              opacity: 0.1,
            },
          }}
        >
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h5"
              component="h1"
              fontWeight="bold"
              color="primary"
              gutterBottom
            >
              Cargar Nuevo Producto
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completa los datos para publicar tu producto
            </Typography>
          </Box>

          <Box component="form" onSubmit={onsubmit} noValidate>
            {/* Nombre */}
            <TextField
              fullWidth
              label="Nombre del producto"
              name="nombre"
              value={nombre}
              onChange={onInputChange}
              margin="normal"
              autoComplete="off"
              autoFocus
              error={Boolean(errores.Nombre)}
              helperText={errores.Nombre?.[0]}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />

            {/* Descripción */}
            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              value={descripcion}
              onChange={onInputChange}
              margin="normal"
              multiline
              rows={3}
              error={Boolean(errores.Descripcion)}
              helperText={errores.Descripcion?.[0]}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />

            {/* Precio */}
            <TextField
              fullWidth
              label="Precio"
              name="precio"
              type="number"
              value={precio}
              onChange={onInputChange}
              margin="normal"
              InputProps={{ inputProps: { min: 0, step: "0.01" } }}
              error={Boolean(errores.Precio)}
              helperText={errores.Precio?.[0]}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />

            {/* Stock */}
            <TextField
              fullWidth
              label="Stock"
              name="stock"
              type="number"
              value={stock}
              onChange={onInputChange}
              margin="normal"
              InputProps={{ inputProps: { min: 0 } }}
              error={Boolean(errores.Stock)}
              helperText={errores.Stock?.[0]}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />

            {/* Imagen */}
            <Box sx={{ mt: 3 }}>
              <InputLabel
                htmlFor="imagen"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                  mb: 1,
                }}
              >
                Cargar Imagen
              </InputLabel>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    textTransform: "none",
                    borderColor: imagen
                      ? theme.palette.success.main
                      : "inherit",
                    color: imagen ? theme.palette.success.main : "inherit",
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  {imagen ? `✅ ${imagen.name}` : "Seleccionar imagen"}
                  <input
                    type="file"
                    name="imagen"
                    id="imagen"
                    accept="image/*"
                    onChange={(e) => setImagen(e.target.files[0])}
                    hidden
                  />
                </Button>
              </Box>
              {errores.Imagen && (
                <FormHelperText error sx={{ mt: 1 }}>
                  {errores.Imagen[0]}
                </FormHelperText>
              )}
            </Box>

            {/* Botón de publicar */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{
                mt: 4,
                py: 1.3,
                fontWeight: 600,
                borderRadius: 2,
                textTransform: "none",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
                "&:hover": {
                  boxShadow: "0px 6px 16px rgba(0,0,0,0.2)",
                  transform: "translateY(-1px)",
                  transition: "all 0.3s ease",
                },
              }}
            >
              Publicar Producto
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};
