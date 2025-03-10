"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface subsType {
  free: string;
  premium: string;
  pro: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  subscriptionType: subsType;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;  
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


  const checkSession = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/session`, {
        method: "POST",
        credentials: "include",
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
    checkSession(); 
  }, []);

  const refreshUser = async () => {
    await checkSession(); 
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
