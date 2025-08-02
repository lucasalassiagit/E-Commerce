import { useVentas } from "../hooks/useVentas";
import { Navigate } from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { CargaYError } from "../Components/CargaYError";
import { useFormatearFecha } from "../hooks/useFormatearFecha";

import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  maxHeight: "80vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
};

export const TodasVentasAdmin = () => {
  const { usuario } = useAuth();

  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (venta) => {
    setVentaSeleccionada(venta);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setVentaSeleccionada(null);
  };

  if (!usuario || usuario.rol !== "Admin") {
    return <Navigate to="/" />;
  }

  const { ventas, load, err } = useVentas(
    "https://localhost:7162/api/ventas/GetVentasyCompras",
    usuario.token
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Todas las Ventas
      </Typography>

      <CargaYError
        load={load}
        err={err}
        mensajeLoad={"Cargando todas las ventas"}
        mensajeErr={"Error al cargar las ventas"}
        fullscreen={false}
      ></CargaYError>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>Comprador</strong>
              </TableCell>
              <TableCell>
                <strong>Fecha</strong>
              </TableCell>
              <TableCell>
                <strong>Hora</strong>
              </TableCell>
              <TableCell>
                <strong>Total</strong>
              </TableCell>
              <TableCell>
                <strong>Productos</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(ventas) &&
              ventas.map((venta) => {
                const { fechaFormateada, horaFormateada } = useFormatearFecha({
                  fechaIso: venta.fecha,
                });
                return (
                  <TableRow
                    key={venta.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleOpen(venta)}
                  >
                    <TableCell>{venta.id}</TableCell>
                    <TableCell>
                      {venta.compradorNombre || "Sin nombre"}
                    </TableCell>
                    <TableCell>{fechaFormateada}</TableCell>
                    <TableCell>{horaFormateada}</TableCell>
                    <TableCell>${venta.total.toFixed(2)}</TableCell>
                    <TableCell>{venta.detalles?.length ?? 0}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MODAL DE DETALLE DE VENTA */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={styleModal}>
          <Typography variant="h6" gutterBottom>
            Detalle de Venta {ventaSeleccionada?.id}
          </Typography>
          <Typography variant="body2">
            Comprador: {ventaSeleccionada?.compradorNombre || "No disponible"}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Total: ${ventaSeleccionada?.total.toFixed(2)}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <List>
            {ventaSeleccionada?.detalles?.map((prod, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={prod.nombreProducto || "Producto sin nombre"}
                    secondary={
                      <>
                        Cantidad: {prod.cantidad} | Precio unitario: $
                        {prod.precioUnitario.toFixed(2)} <br />
                        Vendedor: {prod.nombreVendedor || "Desconocido"}
                        <br />
                        Subtotal: ${" "}
                        {(prod.precioUnitario * prod.cantidad).toFixed(2)}
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Modal>
    </Container>
  );
};
