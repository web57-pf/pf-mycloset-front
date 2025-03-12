"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const CambioDeContraseña = () => {
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newPassword || !email) {
      Swal.fire({
        title: "Error",
        text: "Por favor, completa ambos campos.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: newPassword,
          }),
          credentials: "include",
        }
      );

      if (response.ok) {
        Swal.fire({
          title: "Contraseña actualizada",
          text: "Tu contraseña ha sido cambiada exitosamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
        }).then(() => {
          router.push("/mycloset");
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: "Error",
          text: errorData.message || "No se pudo cambiar la contraseña.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (error) {
      console.error("Error al cambiar contraseña", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema en el servidor. Intenta de nuevo.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF8F1]">
      <div className="bg-white p-10 rounded-lg shadow-lg w-[450px]">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Cambiar Contraseña
        </h2>
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Ingresa tu email"
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm mb-2">
              Nueva Contraseña
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 pr-10"
                placeholder="Ingresa tu nueva contraseña"
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
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Cambiar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default CambioDeContraseña;