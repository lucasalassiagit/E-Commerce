import { AuthContext } from "./AuthContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import React, { useContext } from "react";

export const AuthProvider = ({ children }) => {
  // Valor inicial null evita undefined y errores
  const [usuario, setUsuario, removeUsuario] = useLocalStorage("usuario", null);

  const login = (datos) => setUsuario(datos);
  const logout = () => removeUsuario();

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acceder al contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};
