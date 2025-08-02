import { useState } from "react";

export const useLocalStorage = (key, initialValue) => {
  let parsedValue = initialValue;

  try {
    const storedValue = localStorage.getItem(key);

    if (storedValue !== null && storedValue !== "undefined") {
      const temp = JSON.parse(storedValue);

      // Validamos que tenga el tipo correcto según initialValue
      if (Array.isArray(initialValue)) {
        parsedValue = Array.isArray(temp) ? temp : initialValue;
      } else if (typeof initialValue === "object") {
        parsedValue =
          typeof temp === "object" && temp !== null ? temp : initialValue;
      } else {
        parsedValue = temp;
      }
    }
  } catch (error) {
    console.warn("Valor inválido en localStorage para clave:", key, error);
    parsedValue = initialValue;
  }

  const [storedData, setStoredData] = useState(parsedValue);

  const setValue = (value) => {
    setStoredData(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  const removeValue = () => {
    setStoredData(initialValue);
    localStorage.removeItem(key);
  };

  return [storedData, setValue, removeValue];
};
