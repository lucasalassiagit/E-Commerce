import React from "react";

export const useFormatearFecha = ({ fechaIso }) => {
  const fecha = new Date(fechaIso);

  const opcionesFecha = { day: "2-digit", month: "2-digit", year: "numeric" };
  const opcionesHora = { hour: "2-digit", minute: "2-digit" };

  const fechaFormateada = fecha.toLocaleDateString("es-AR", opcionesFecha);
  const horaFormateada = fecha.toLocaleTimeString("es-AR", opcionesHora);

  return { fechaFormateada, horaFormateada };
};
