// Footer.js
import React from "react";
import { Box, Container, Typography, Link } from "@mui/material";

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        backgroundColor: "#121212",
        color: "#fff",
        textAlign: "center",
        fontSize: "0.875rem",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="inherit">
          © {new Date().getFullYear()} TuTiendaOnline.com | Todos los derechos
          reservados
        </Typography>
        <Box mt={1}>
          <Link href="#" color="inherit" underline="hover" sx={{ mx: 1 }}>
            Política de privacidad
          </Link>
          <Link
            href="#"
            color="text.secondary"
            underline="hover"
            sx={{ mx: 1 }}
          >
            Términos de uso
          </Link>
          <Link href="#" color="inherit" underline="hover" sx={{ mx: 1 }}>
            Contacto
          </Link>
        </Box>
      </Container>
    </Box>
  );
};
