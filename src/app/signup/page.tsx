'use client';

import { useState } from "react";
import Swal from "sweetalert2";  
import { useRouter } from "next/navigation";
import Image from "next/image";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isUpperCase, setIsUpperCase] = useState(false);
  const [isNumber, setIsNumber] = useState(false);
  const [isSpecialChar, setIsSpecialChar] = useState(false); // Estado para el carácter especial
  const [isFocused, setIsFocused] = useState(false);  
  const router = useRouter(); 

  const validatePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const passwordValue: string = e.target.value;
    setPassword(passwordValue);

    const upperCaseRegex: RegExp = /[A-Z]/;
    const numberRegex: RegExp = /\d/;
    const specialCharRegex: RegExp = /[!@#$%^&*(),.?":{}|<>]/; // Expresión regular para caracteres especiales
    
    setIsUpperCase(upperCaseRegex.test(passwordValue));
    setIsNumber(numberRegex.test(passwordValue));
    setIsSpecialChar(specialCharRegex.test(passwordValue)); // Validar si tiene un carácter especial
  };

  const showValidationAlert = () => {
    Swal.fire({
      icon: "error",
      title: "¡Error!",
      text: "La contraseña debe contener al menos una mayúscula, un número y un carácter especial.",
      confirmButtonText: "Entendido",
    });
  };

  const showSuccessAlert = () => {
    Swal.fire({
      icon: "success",
      title: "¡Registro exitoso!",
      text: "Tu cuenta ha sido registrada correctamente.",
      confirmButtonText: "¡Maravilloso!",
      timer: 2000,
      willClose: () => {
        router.push("/login");  
      }
    });
  };

  const showEmailExistsAlert = () => {
    Swal.fire({
      icon: "error",
      title: "¡Error!",
      text: "El correo electrónico ya está en uso.",
      confirmButtonText: "Entendido",
    });
  };

  interface RegisterFormData {
    name: string;
    email: string;
    password: string;
  }

  interface RegisterResponse {
    id: string;
    name: string;
    email: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isUpperCase || !isNumber || !isSpecialChar) { // Verificamos que tenga mayúscula, número y carácter especial
      showValidationAlert();
    } else {
      const formData: RegisterFormData = { name, email, password };

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data: RegisterResponse = await response.json();
          console.log("Usuario registrado:", data);
          showSuccessAlert();
        } else {
          const errorData = await response.json(); // Obtener el cuerpo de la respuesta de error
          if (response.status === 409) {
            showEmailExistsAlert();
          } else {
            // Mostrar el mensaje de error detallado
            Swal.fire({
              icon: "error",
              title: "¡Error!",
              text: errorData.message || "Hubo un error al intentar registrar el usuario.",
              confirmButtonText: "Entendido",
            });
          }
        }
      } catch (error) {
        console.error("Error en la conexión con el servidor:", error);
        Swal.fire({
          icon: "error",
          title: "¡Error de conexión!",
          text: "No se pudo conectar al servidor. Intenta de nuevo más tarde.",
          confirmButtonText: "Entendido",
        });
      }
    }
  };

  const handleBlur = () => setIsFocused(false);
  const handleFocus = () => setIsFocused(true);
  const handleLoginRedirect = () => router.push("/login");

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "inherit" }}>
      <div className="w-1/2">
        <Image 
          src="/signup.png"
          alt="Fondo Login"  
          className="object-center"
          width={1000}
          height={200}
        />
      </div>

      <div className="flex justify-center items-center w-1/2">
        <div className="p-8 rounded-lg shadow-lg w-full max-w-md bg-gray-100">
          <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">
            Formulario de Registro
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-600">Nombre:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tu nombre completo"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600">Correo Electrónico:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tu correo electrónico"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-600">Contraseña:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={validatePassword}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tu contraseña"
              />

              {isFocused && (
                <div className="mt-2 text-sm text-gray-600">
                  <ul className="list-disc pl-5 space-y-1">
                    <li className={`flex items-center ${isUpperCase ? "text-green-500" : "text-red-500"}`}>
                      {isUpperCase ? "✔" : "✖"} Al menos una mayúscula.
                    </li>
                    <li className={`flex items-center ${isNumber ? "text-green-500" : "text-red-500"}`}>
                      {isNumber ? "✔" : "✖"} Al menos un número.
                    </li>
                    <li className={`flex items-center ${isSpecialChar ? "text-green-500" : "text-red-500"}`}>
                      {isSpecialChar ? "✔" : "✖"} Al menos un carácter especial.
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Registrar
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              ¿Tienes cuenta?{" "}
              <button onClick={handleLoginRedirect} className="text-blue-500 hover:underline">
                Inicia sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;