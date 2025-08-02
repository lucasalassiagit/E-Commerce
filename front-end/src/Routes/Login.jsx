// Login.js
import React, { useState } from "react";
import { useForm } from "../hooks/useForm";
import { useLoginPost } from "../hooks/useLoginPost";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { MensajeToast } from "../Components/MensajeToast";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Fade,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { formState, onInputChange } = useForm({
    NombreUsuario: "",
    Password: "",
  });

  const {
    postData,
    cargando,
    error: errorApi,
  } = useLoginPost("https://localhost:7162/api/usuarios/login");

  const [openToast, setOpenToast] = useState(false);

  const onsubmit = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await postData(formState);
      const { usuario, rol, token } = respuesta.result;
      const { id, username, nombre } = usuario;

      login({ token, rol, id, username, nombre });
      setOpenToast(true);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      // El error ya se maneja en el hook
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
          0.05
        )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        padding: isMobile ? 2 : 0,
      }}
    >
      {/* Animación de entrada */}
      <Fade in timeout={600}>
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, sm: 5 },
            width: { xs: "100%", sm: 420 },
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
              width: 80,
              height: 80,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              borderRadius: "0 20px 0 80px",
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
              Bienvenido
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Inicia sesión para continuar
            </Typography>
          </Box>

          <Box component="form" onSubmit={onsubmit} noValidate>
            <TextField
              fullWidth
              label="Nombre de usuario"
              name="NombreUsuario"
              margin="normal"
              value={formState.NombreUsuario}
              onChange={onInputChange}
              variant="outlined"
              autoComplete="username"
              autoFocus
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
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              name="Password"
              margin="normal"
              value={formState.Password}
              onChange={onInputChange}
              variant="outlined"
              autoComplete="current-password"
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

            {/* Mensaje de error */}
            {errorApi && (
              <Alert
                severity="error"
                sx={{ mt: 2, mb: 2, fontSize: "0.875rem" }}
              >
                {errorApi}
              </Alert>
            )}

            {/* Botón de envío */}
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={cargando}
                size="large"
                fullWidth
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
                  "Ingresar"
                )}
              </Button>
            </Box>
          </Box>

          {/* Footer opcional */}
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            textAlign="center"
            sx={{ mt: 3 }}
          >
            ¿No tienes cuenta? Se puede Registrar de forma gratuita.
          </Typography>
        </Paper>
      </Fade>

      {/* Toast de éxito */}
      <MensajeToast
        open={openToast}
        onClose={() => setOpenToast(false)}
        severity="success"
        message="¡Inicio de sesión exitoso!"
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </Box>
  );
};
