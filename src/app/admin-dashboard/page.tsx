'use client'
import React, { useState } from "react";
import AdminDashboard from "@/components/AdminDashboard";
import ContentCreator from "@/components/ContentCreator";

export default function AdminDash() {
  const [showContentCreator, setShowContentCreator] = useState(false);

  return (
    <div className="p-6 mb-20 min-h-screen bg-gradient-to-br from-[#fffbf7] to-[#fffbf7]">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowContentCreator(!showContentCreator)}
          className={`px-6 py-3 rounded-full text-gray-50 font-semibold transition-all duration-300 shadow-lg 
            ${showContentCreator 
              ? "bg-gradient-to-r from-[#afcacf] to-[#899ec5] hover:from-[#7da6ad] hover:to-[#7899d6] transition duration-200"
              : "bg-gradient-to-r from-[#afcacf] to-[#899ec5] hover:from-[#7da6ad] hover:to-[#7899d6] transition duration-200"
            }`}
        >
          {showContentCreator ? "Volver al Panel de Administración" : "Creador de Contenido"}
        </button>
      </div>
      {showContentCreator ? <ContentCreator /> : <AdminDashboard />}
    </div>
  );
}
