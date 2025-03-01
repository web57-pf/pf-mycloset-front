'use client';

import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Drawer({ isOpen, onClose, children }: DrawerProps) {
  const router = useRouter();
  const { logout } = useAuth(); 

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-50 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 left-0 h-full w-80 bg-opacity-90 bg-red-50 shadow-lg transition-transform duration-300 transform z-50 ${  
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative h-full">
          {isOpen && (
            <button
              onClick={onClose}
              className="absolute right-[-0rem] top-1/2 transform -translate-y-1/2 bg-cyan-500 text-white w-8 h-12 rounded-l-full rounded-r-none shadow-lg hover:bg-cyan-600 transition-colors z-50"
              title="Cerrar menú"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mx-auto transform rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
