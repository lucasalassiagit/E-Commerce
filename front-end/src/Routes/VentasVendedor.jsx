import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useVentas } from "../hooks/useVentas";
import { useAuth } from "../context/AuthProvider";
import { CargaYError } from "../Components/CargaYError";
import { useFormatearFecha } from "../hooks/useFormatearFecha";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const VentasVendedor = () => {
  const { usuario } = useAuth();

  if (!usuario || usuario.rol !== "Vendedor") {
    return <Navigate to="/" />;
  }

  const { ventas, load, err } = useVentas(
    "https://localhost:7162/api/ventas/GetVentasRealizadas",
    usuario.token
  );

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Ventas realizadas
      </Typography>
      <CargaYError
        load={load}
        err={err}
        mensajeLoad={"Cargando todas las ventas"}
        mensajeErr={"Error al cargar las ventas"}
        fullscreen={false}
      ></CargaYError>

      {ventas.length === 0 && !load ? (
        <Typography>No se encontraron ventas.</Typography>
      ) : (
        ventas.map((venta) => {
          // Usamos el hook para formatear la fecha
          const { fechaFormateada, horaFormateada } = useFormatearFecha({
            fechaIso: venta.fecha,
          });

          return (
            <Accordion key={venta.id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box width="100%">
                  <Typography variant="subtitle1">
                    Venta {venta.id} - Fecha: {fechaFormateada} - Hora:{" "}
                    {horaFormateada}
                  </Typography>
                  <Typography variant="body2">
                    Comprador: {venta.compradorNombre}
                  </Typography>
                  <Typography variant="body2">
                    Total: ${venta.total.toFixed(2)}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Divider />
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Precio Unitario</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {venta.detalles.map((detalle, index) => (
                      <TableRow key={index}>
                        <TableCell>{detalle.nombreProducto}</TableCell>
                        <TableCell>{detalle.cantidad}</TableCell>
                        <TableCell>
                          ${detalle.precioUnitario.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionDetails>
            </Accordion>
          );
        })
      )}
    </Box>
  );
};
