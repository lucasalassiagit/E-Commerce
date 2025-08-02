import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export const CargaYError = ({
  load,
  err,
  mensajeLoad = "Cargando...",
  mensajeErr = "Ocurrió un error",
  fullscreen = false, // nuevo
}) => {
  const boxStyles = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    ...(fullscreen
      ? {
          height: "100vh",
          width: "100vw",
        }
      : {
          minHeight: "200px", // altura mínima para centrado si no es fullscreen
          width: "100%",
        }),
  };

  return (
    <>
      {load && (
        <Box sx={boxStyles}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>{mensajeLoad}</Typography>
        </Box>
      )}

      {err && (
        <Box sx={boxStyles}>
          <Typography color="error">{`❌ ${mensajeErr}`}</Typography>
        </Box>
      )}
    </>
  );
};
