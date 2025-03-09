"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  subscription?: string; // Agrega el campo de suscripción si lo necesitas
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  refreshUser: () => Promise<void>; // Nueva función para refrescar el usuario
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserSession = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/session`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("Usuario autenticado:", userData);
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error verificando la sesión", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSession();
  }, []);

  const refreshUser = async () => {
    await fetchUserSession(); // Llama a la misma función para actualizar el estado del usuario
  };

  const logout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null);
        console.log("Sesión cerrada correctamente");
      } else {
        console.error("Error cerrando sesión");
      }
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
