'use client';
import { useState } from "react";
import Drawer from "@/components/Drawer";

export default function MyClosetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="relative flex flex-col min-h-screen w-full bg-background mt-4">
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <div className="flex flex-col items-center justify-center">
          <img src="/menu2.png" alt="menu" width={200} height={200} />
        </div>
        <div className="mt-4 justify-center items-center">
          <h2 className="text-xl font-bold flex flex-col items-center">Menú</h2>
          <ul className="mt-4 flex flex-col gap-4">
            <li className="flex flex-col items-center">
              <a
                href="/mycloset/account"
                className="text-gray-700 font-bold hover:text-cyan-600 transition-all duration-150"
              >
                Mi Cuenta
              </a>
            </li>
            <li className="flex flex-col items-center">
              <a
                href="/mycloset/clothes"
                className="text-gray-700 font-bold hover:text-cyan-600 transition-all duration-150"
              >
                Mis Prendas
              </a>
            </li>
            <li className="flex flex-col items-center">
              <a
                href="/mycloset/outfits"
                className="text-gray-700 font-bold hover:text-cyan-600 transition-all duration-150"
              >
                Mis Outfits
              </a>
            </li>
          </ul>
        </div>
      </Drawer>
      {children}
      {!isDrawerOpen && (
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-cyan-500 text-white w-9 h-12 rounded-r-full rounded-l-none shadow-lg hover:bg-cyan-600 transition-colors z-50"
            title="Abrir menú"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
    </div>
  );
}
