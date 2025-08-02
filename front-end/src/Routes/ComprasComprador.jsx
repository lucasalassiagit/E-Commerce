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

export const ComprasComprador = () => {
  const { usuario } = useAuth();

  if (!usuario || usuario.rol !== "Comprador") {
    return <Navigate to="/" />;
  }

  const { ventas, load, err } = useVentas(
    "https://localhost:7162/api/ventas/GetComprasRealizadas",
    usuario.token
  );

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Compras realizadas
      </Typography>

      <CargaYError
        load={load}
        err={err}
        mensajeLoad={"Cargando compras"}
        mensajeErr={"Error al cargar las compras"}
        fullscreen={false}
      ></CargaYError>

      {ventas.length === 0 && !load ? (
        <Typography>No se encontraron compras.</Typography>
      ) : (
        ventas.map((compra) => {
          // Llamamos al hook dentro del map
          const { fechaFormateada, horaFormateada } = useFormatearFecha({
            fechaIso: compra.fecha,
          });

          return (
            <Accordion key={compra.id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box width="100%">
                  <Typography variant="subtitle1">
                    Compra {compra.id} - Fecha: {fechaFormateada} - Hora:{" "}
                    {horaFormateada}
                  </Typography>
                  <Typography variant="body2">
                    Total: ${compra.total.toFixed(2)}
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
                      <TableCell>Vendedor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {compra.detalles.map((detalle, index) => (
                      <TableRow key={index}>
                        <TableCell>{detalle.nombreProducto}</TableCell>
                        <TableCell>{detalle.cantidad}</TableCell>
                        <TableCell>
                          ${detalle.precioUnitario.toFixed(2)}
                        </TableCell>
                        <TableCell>{detalle.nombreVendedor}</TableCell>
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
