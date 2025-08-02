// Registro.js
import { useForm } from "../hooks/useForm";
import { useRegistroPost } from "../hooks/useRegistroPost";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MensajeToast } from "../Components/MensajeToast";

import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Fade,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";

export const Registro = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { formState, username, nombre, email, password, rol, onInputChange } =
    useForm({
      NombreUsuario: "",
      Nombre: "",
      Email: "",
      Password: "",
      Rol: "",
    });

  const { postData, cargando } = useRegistroPost(
    "https://localhost:7162/api/usuarios/registro"
  );

  const [erroresBack, setErroresBack] = useState(null);
  const [openToast, setOpenToast] = useState(false);

  const onsubmit = async (e) => {
    e.preventDefault();
    try {
      await postData(formState);
      setErroresBack(null);
      setOpenToast(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setErroresBack(err.response?.data || { message: "Error desconocido" });
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
            width: { xs: "100%", sm: 480 },
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
              Crear Cuenta
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completa tus datos para registrarte
            </Typography>
          </Box>

          <Box component="form" onSubmit={onsubmit} noValidate>
            {/* Nombre de usuario */}
            <TextField
              fullWidth
              label="Nombre de usuario"
              name="NombreUsuario"
              value={username}
              onChange={onInputChange}
              margin="normal"
              autoComplete="username"
              autoFocus
              error={Boolean(erroresBack?.errors?.NombreUsuario)}
              helperText={erroresBack?.errors?.NombreUsuario?.[0] || ""}
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

            {/* Nombre completo */}
            <TextField
              fullWidth
              label="Nombre completo"
              name="Nombre"
              value={nombre}
              onChange={onInputChange}
              margin="normal"
              autoComplete="name"
              error={Boolean(erroresBack?.errors?.Nombre)}
              helperText={erroresBack?.errors?.Nombre?.[0] || ""}
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

            {/* Email */}
            <TextField
              fullWidth
              label="Correo electrónico"
              name="Email"
              type="email"
              value={email}
              onChange={onInputChange}
              margin="normal"
              autoComplete="email"
              error={Boolean(erroresBack?.errors?.Email)}
              helperText={erroresBack?.errors?.Email?.[0] || ""}
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

            {/* Contraseña */}
            <TextField
              fullWidth
              label="Contraseña"
              name="Password"
              type="password"
              value={password}
              onChange={onInputChange}
              margin="normal"
              autoComplete="new-password"
              error={Boolean(erroresBack?.errors?.Password)}
              helperText={erroresBack?.errors?.Password?.[0] || ""}
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

            {/* Rol */}
            <FormControl
              fullWidth
              margin="normal"
              error={Boolean(erroresBack?.errors?.Rol)}
            >
              <InputLabel id="rol-label">Rol</InputLabel>
              <Select
                labelId="rol-label"
                name="Rol"
                value={rol}
                label="Rol"
                onChange={onInputChange}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <MenuItem value="">
                  <em>Selecciona un rol</em>
                </MenuItem>
                <MenuItem value="Admin">Administrador</MenuItem>
                <MenuItem value="Comprador">Comprador</MenuItem>
                <MenuItem value="Vendedor">Vendedor</MenuItem>
              </Select>
              {erroresBack?.errors?.Rol && (
                <Typography color="error" variant="caption">
                  {erroresBack.errors.Rol[0]}
                </Typography>
              )}
            </FormControl>

            {/* Errores generales del backend */}
            {erroresBack?.errorMessages?.length > 0 && (
              <Alert severity="error" sx={{ mt: 2, fontSize: "0.875rem" }}>
                {erroresBack.errorMessages.map((msg, i) => (
                  <div key={i}>{msg}</div>
                ))}
              </Alert>
            )}

            {/* Botón de registro */}
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={cargando}
                fullWidth
                size="large"
                sx={{
                  py: 1.2,
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 2,
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
                  "&:hover": {
                    boxShadow: "0px 6px 16px rgba(0,0,0,0.2)",
                    transform: "translateY(-1px)",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                {cargando ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Registrarse"
                )}
              </Button>
            </Box>

            {/* Enlace opcional */}
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 2 }}
            >
              ¿Ya tenés cuenta?{" "}
              <Button
                component="span"
                size="small"
                onClick={() => navigate("/login")}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  p: 0,
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                Inicia sesión aquí
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Fade>

      {/* Toast de éxito */}
      <MensajeToast
        open={openToast}
        onClose={() => setOpenToast(false)}
        severity="success"
        message="¡Usuario registrado exitosamente!"
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};
