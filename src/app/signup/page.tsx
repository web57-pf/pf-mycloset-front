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
  const [isFocused, setIsFocused] = useState(false);  
  const router = useRouter(); 

  interface PasswordValidationEvent extends React.ChangeEvent<HTMLInputElement> {}


  const validatePassword = (e: PasswordValidationEvent): void => {
    const passwordValue: string = e.target.value;
    setPassword(passwordValue);

    const upperCaseRegex: RegExp = /[A-Z]/;
    const numberRegex: RegExp = /\d/;
    
    setIsUpperCase(upperCaseRegex.test(passwordValue));
    setIsNumber(numberRegex.test(passwordValue));
  };

  const showValidationAlert = () => {
    Swal.fire({
      icon: "error",
      title: "¡Error!",
      text: "La contraseña debe contener al menos una mayúscula y un número.",
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
        //router.push("/login");  
      }
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

    if (!isUpperCase || !isNumber) {
      showValidationAlert();
    } else {
      const formData: RegisterFormData = {
        name,
        email,
        password,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data: RegisterResponse = await response.json();
        console.log("Usuario registrado:", data);
        showSuccessAlert();
      } else {
        console.error("Error en el registro");
      }
    }
  };

  const handleBlur = () => {
    setIsFocused(false);  
  };

  const handleFocus = () => {
    setIsFocused(true);  
  };

  const handleLoginRedirect = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "inherit" }}>
      <div
        className="w-1/2">
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
          <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6 ">
            Formulario de Registro
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-600">
                Nombre:
              </label>
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
              <label htmlFor="email" className="block text-gray-600">
                Correo Electrónico:
              </label>
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
              <label htmlFor="password" className="block text-gray-600">
                Contraseña:
              </label>
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
                    <li
                      className={`flex items-center ${isUpperCase ? "text-green-500" : "text-red-500"}`}
                    >
                      {isUpperCase ? (
                        <svg
                          className="w-4 h-4 mr-2 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 011 1v4a1 1 0 01-1 1H6a1 1 0 01-1-1V8a1 1 0 011-1h3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 mr-2 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 011 1v4a1 1 0 01-1 1H6a1 1 0 01-1-1V8a1 1 0 011-1h3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      Al menos una mayúscula.
                    </li>
                    <li
                      className={`flex items-center ${isNumber ? "text-green-500" : "text-red-500"}`}
                    >
                      {isNumber ? (
                        <svg
                          className="w-4 h-4 mr-2 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 011 1v4a1 1 0 01-1 1H6a1 1 0 01-1-1V8a1 1 0 011-1h3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 mr-2 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 011 1v4a1 1 0 01-1 1H6a1 1 0 01-1-1V8a1 1 0 011-1h3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      Al menos un número.
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
              <button
                onClick={handleLoginRedirect}
                className="text-blue-500 hover:underline"
              >
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
