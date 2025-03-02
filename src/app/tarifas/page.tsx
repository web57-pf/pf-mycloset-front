'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/authContext"

const Membership: React.FC = () => {
  const [hovered, setHovered] = useState([false, false, false]);
  const [isAnnual, setIsAnnual] = useState(false);
  const { user } = useAuth(); // Usar el contexto para obtener el usuario

  const handleMouseEnter = (index: number) => {
    const newHovered = [...hovered];
    newHovered[index] = true;
    setHovered(newHovered);
  };

  const handleMouseLeave = (index: number) => {
    const newHovered = [...hovered];
    newHovered[index] = false;
    setHovered(newHovered);
  };

  const togglePricing = () => {
    setIsAnnual(!isAnnual);
  };

  const pricing = {
    free: {
      monthly: 0,
      annual: 0,
    },
    premium: {
      monthly: 19.99,
      annual: 199.99,
    },
    pro: {
      monthly: 30,
      annual: 300,
    },
    weekly: {
      weekly: 7.99,
    },
  };

  const handlePlanSelection = async (planType: string) => {
    if (!user) {
      // Si no hay usuario, redirigir a login
      window.location.href = '/login';
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user.id,  // Usamos el user del contexto
          preferedSub: planType,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const initPoint = data.init_point;
        window.location.href = initPoint;
      } else {
        console.error('Error en la solicitud:', data);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  useEffect(() => {
    if (!user) {
      // Si no hay un usuario en el contexto, podemos hacer algo si es necesario
      console.log('No hay usuario autenticado');
    }
  }, [user]);

  return (
    <div className="flex items-start justify-center p-0">
      <div className="text-center">
        <h1 className="text-4xl mb-12">Tarifas</h1>

        <div className="love">
          <input
            id="switch"
            type="checkbox"
            checked={isAnnual}
            onChange={togglePricing}
          />
          <label className="love-heart" htmlFor="switch">
            <i className="left"></i>
            <i className="right"></i>
            <i className="bottom"></i>
            <div className="round"></div>
          </label>
        </div>

        <div className="flex justify-start items-start flex-wrap -mx-2 mb-8">
          {/* Gratis Plan */}
          <div
            className="tarifa-card bg-white border-2 border-black rounded-lg w-64 h-[500px] p-3 text-left flex flex-col justify-between transition-all transform hover:translate-y-[-10px] hover:shadow-lg hover:shadow-blue-200/50 mx-2 hover:border-blue-200 hover:bg-blue-50 mb-6"
            onMouseEnter={() => handleMouseEnter(0)}
            onMouseLeave={() => handleMouseLeave(0)}
          >
            <h2 className="text-xl font-semibold mb-0">Gratis</h2>
            <p className="text-sm mt-0 mb-0">Perfecto para usuarios ocasionales o para aquellas personas que quieran conocer myCloset.</p>
            <p className="text-2xl font-bold mt-0 mb-0">
              {pricing.free[isAnnual ? 'annual' : 'monthly']} <span className="text-base font-bold">$</span>
            </p>
            <button
              onClick={() => window.location.href = '/login'} 
              className="mt-4 w-full border-2 border-blue-500 bg-white text-blue-500 py-2 px-4 rounded-lg hover:bg-blue-500 hover:text-white"
            >
              ¡Crear cuenta!
            </button>
            <div className="border-t border-gray-300 my-0"></div>
            <div className="text-left flex-grow-0 mt-2 pt-0">
              <ul className="list-none pl-0 mt-0 mb-0">
                <li className="flex items-center">
                  <svg
                    className={`w-4 h-4 ${hovered[0] ? 'text-blue-500' : 'text-gray-500'} mr-2`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Acceso limitado a funciones.
                </li>
                <li className="flex items-center">
                  <svg
                    className={`w-4 h-4 ${hovered[0] ? 'text-blue-500' : 'text-gray-500'} mr-2`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  No tendrás armario.
                </li>
                <li className="flex items-center">
                  <svg
                    className={`w-4 h-4 ${hovered[0] ? 'text-blue-500' : 'text-gray-500'} mr-2`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  ¡Ideal para probar la plataforma!
                </li>
              </ul>
            </div>
          </div>

          {/* Premium Plan */}
          <div
            className="tarifa-card bg-white border-2 border-black rounded-lg w-64 h-[500px] p-3 text-left flex flex-col justify-between transition-all transform hover:translate-y-[-10px] hover:shadow-lg hover:shadow-blue-200/50 mx-2 hover:border-blue-200 hover:bg-blue-50 mb-6"
            onMouseEnter={() => handleMouseEnter(1)}
            onMouseLeave={() => handleMouseLeave(1)}
          >
            <h2 className="text-xl font-semibold mb-0">Premium</h2>
            <p className="text-sm mt-0 mb-0">Acceso completo a funcionalidades premium. Incluye soporte prioritario y contenido exclusivo.</p>
            <p className="text-2xl font-bold mt-0 mb-0">
              {pricing.premium[isAnnual ? 'annual' : 'monthly']} <span className="text-base font-bold">$</span><span className="text-base font-bold">/ {isAnnual ? 'año' : 'mes'}</span>
            </p>
            <button 
              onClick={() => handlePlanSelection('premium')}
              className="mt-4 w-full border-2 border-blue-500 bg-white text-blue-500 py-2 px-4 rounded-lg hover:bg-blue-500 hover:text-white"
            >
              Continuar
            </button>
            <div className="border-t border-gray-300 my-0"></div>
            <div className="text-left flex-grow-0 mt-2 pt-0">
              <ul className="list-none pl-0 mt-0 mb-0">
                <li className="flex items-center">
                  <svg
                    className={`w-4 h-4 ${hovered[1] ? 'text-blue-500' : 'text-gray-500'} mr-2`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Acceso completo a la plataforma.
                </li>
                <li className="flex items-center">
                  <svg
                    className={`w-4 h-4 ${hovered[1] ? 'text-blue-500' : 'text-gray-500'} mr-2`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Soporte prioritario.
                </li>
                <li className="flex items-center">
                  <svg
                    className={`w-4 h-4 ${hovered[1] ? 'text-blue-500' : 'text-gray-500'} mr-2`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Contenido exclusivo y más.
                </li>
              </ul>
            </div>
          </div>

          {/* Pro Plan */}
          <div
            className="tarifa-card bg-white border-2 border-black rounded-lg w-64 h-[500px] p-3 text-left flex flex-col justify-between transition-all transform hover:translate-y-[-10px] hover:shadow-lg hover:shadow-blue-200/50 mx-2 hover:border-blue-200 hover:bg-blue-50 mb-6"
            onMouseEnter={() => handleMouseEnter(2)}
            onMouseLeave={() => handleMouseLeave(2)}
          >
            <h2 className="text-xl font-semibold mb-0">Pro</h2>
            <p className="text-sm mt-0 mb-0">Acceso completo a todo el contenido y soporte prioritario las 24 horas.</p>
            <p className="text-2xl font-bold mt-0 mb-0">
              {pricing.pro[isAnnual ? 'annual' : 'monthly']} <span className="text-base font-bold">$</span>
            </p>
            <button 
              onClick={() => handlePlanSelection('pro')}
              className="mt-4 w-full border-2 border-blue-500 bg-white text-blue-500 py-2 px-4 rounded-lg hover:bg-blue-500 hover:text-white"
            >
              Continuar
            </button>
            <div className="border-t border-gray-300 my-0"></div>
            <div className="text-left flex-grow-0 mt-2 pt-0">
              <ul className="list-none pl-0 mt-0 mb-0">
                <li className="flex items-center">
                  <svg
                    className={`w-4 h-4 ${hovered[2] ? 'text-blue-500' : 'text-gray-500'} mr-2`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Acceso completo a todas las características.
                </li>
                <li className="flex items-center">
                  <svg
                    className={`w-4 h-4 ${hovered[2] ? 'text-blue-500' : 'text-gray-500'} mr-2`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Soporte personalizado.
                </li>
                <li className="flex items-center">
                  <svg
                    className={`w-4 h-4 ${hovered[2] ? 'text-blue-500' : 'text-gray-500'} mr-2`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Atención al cliente personalizada.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership;
