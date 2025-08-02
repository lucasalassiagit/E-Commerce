import { useState } from "react";

/**
 * Custom Hook para manejar formularios controlados
 *
 * initialForm - Objeto con los valores iniciales del formulario
 * @returns- Estado actual del formulario, más la función para actualizar inputs
 */

export const useForm = (initialForm = {}) => {
  // Estado local que almacena el estado actual del formulario

  const [formState, setFormState] = useState(initialForm);

  /**
   * Función manejadora para los eventos onChange de los inputs
   * Actualiza dinámicamente el campo correspondiente usando el atributo "name"
   *
   * @param {Event} event - Evento del input (debe tener `name` y `value`)
   */

  const onInputChange = ({ target }) => {
    const { name, value } = target;

    // Actualizamos el estado del formulario creando un nuevo objeto

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return {
    ...formState, // Valores actuales del formulario (ej: username, email)
    formState, // También devolvemos el estado como objeto completo
    onInputChange, // Función para conectar a los inputs del formulario
  };
};
