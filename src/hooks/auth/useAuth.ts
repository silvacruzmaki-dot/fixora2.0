"use client";

import { useContext } from "react";

import {
  AuthContext,
  type AuthContextValue,
} from "@/context/auth/AuthContext";

/**
 * Permite acceder al estado global de autenticación.
 *
 * Este hook debe utilizarse dentro de:
 *
 * <AuthProvider>
 *   ...
 * </AuthProvider>
 */
export function useAuth(): AuthContextValue {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe utilizarse dentro de un AuthProvider.",
    );
  }

  return context;
}

/**
 * Variante opcional para componentes que pueden funcionar
 * tanto dentro como fuera de AuthProvider.
 *
 * Devuelve null cuando el proveedor no está disponible.
 */
export function useOptionalAuth():
  | AuthContextValue
  | null {
  return useContext(AuthContext);
}