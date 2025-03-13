"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import Swal from "sweetalert2";
import Image from "next/image";
import { useAuth } from "@/contexts/authContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleGoogleLogin = async () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
  };

  interface LoginCredentials {
    email: string;
    password: string;
  }

  const checkSession = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/session`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        const user = await response.json();
        setUser(user);

        Swal.fire({
          title: "Sesión activa",
          text: "Redirigiendo al dashboard...",
          icon: "info",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          router.push("/mycloset");
        });
      }
    } catch (error) {
      console.error("Error verificando la sesión", error);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const credentials: LoginCredentials = {
      email,
      password,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      }
    );

    if (response.ok) {
      await checkSession();

      Swal.fire({
        title: "¡Bienvenido!",
        text: "Has iniciado sesión correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      }).then(() => {
        router.push("/mycloset");
      });
    } else {
      console.error("Error al iniciar sesión");

      Swal.fire({
        title: "Error",
        text: "Correo o contraseña incorrectos. Intenta de nuevo.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  useEffect(() => {
    // Verificar si el parámetro "code" está presente en la URL
    const queryParams = new URLSearchParams(window.location.search);
    const googleAuthCode = queryParams.get("code");

    if (googleAuthCode) {
      // Si el código está presente, hacer la verificación de la sesión
      checkSession();
    }
  }, []);

  return (
    <div className="flex h-screen bg-inherit">
      <div className="w-1/2 flex items-center justify-center">
        <Image
          src="/login.png"
          alt="Fondo Login"
          className="object-center"
          width={500}
          height={200}
        />
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center">
        <h2 className="text-4xl font-bold mb-8 text-gray-800 text-center">
          Iniciar Sesión
        </h2>

        <form onSubmit={handleLogin} className="w-4/5 max-w-lg">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu correo"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
            />
          </div>

          <div className="mb-6 relative">
            <label className="block text-gray-700 text-sm mb-2">
              Contraseña
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 text-lg"
          >
            Iniciar Sesión
          </button>

          <div className="mt-6 text-center text-sm text-gray-500"> O </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center mt-4 border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition duration-300 text-lg bg-white text-gray-900"
          >
            <FcGoogle className="w-7 h-7 mr-3" />
            Continuar con Google
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          ¿No tienes una cuenta?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-blue-500 hover:text-blue-700 font-semibold"
          >
            Regístrate
          </button>
        </div>

        <div className="mt-2 text-center text-sm text-gray-500">
          ¿Olvidaste tu contraseña?
          <button
            onClick={() => router.push("/password")}
            className="text-blue-500 hover:text-blue-700 font-semibold"
          >
            Restablecer contraseña
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
