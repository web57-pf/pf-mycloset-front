"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
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

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth/session", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          console.log("Usuario autenticado:", userData);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error verificando la sesión", error);
      }
    };
    checkSession();
  }, []);

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/logout", {
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
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
