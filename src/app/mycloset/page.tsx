'use client';

import { useState } from "react";
import Drawer from "@/components/Drawer";
import Dashboard from "@/components/Dashboard";
import Wardrobe, { Garment } from "@/components/Wardrobe";
import { CloudinaryImage } from "@/interfaces/Images";
import Image from "next/image";
import Link from "next/link";

export default function MyCloset() {
  const [newImage, setNewImage] = useState<CloudinaryImage | null>(null);
  const [savedGarments, setSavedGarments] = useState<Garment[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleUploadSuccess = (image: CloudinaryImage) => {
    setNewImage(image);
  };

  const handleSaveGarment = (garment: Garment) => {
    setSavedGarments((prev) => [...prev, garment]);
    setNewImage(null);
  };

  const handleDeleteGarment = (id: string) => {
    setSavedGarments((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="relative flex flex-row w-full min-h-screen bg-background">
      <div className="relative flex flex-1">
        <Wardrobe garments={savedGarments} onDeleteGarment={handleDeleteGarment} />
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

      <div className="flex flex-col flex-1">
        <Dashboard 
          onUploadSuccess={handleUploadSuccess} 
          newImage={newImage} 
          onSaveGarment={handleSaveGarment} 
        />
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <div className="flex flex-col items-center justify-center">
          <Image src="/menu2.png" alt="menu" width={200} height={200} />
        </div>
        <div className="mt-4 justify-center items-center">
          <h2 className="text-xl font-bold flex flex-col items-center">Menú</h2>
          <ul className="mt-4 flex flex-col gap-4">
            <li className="flex flex-col items-center">
              <Link
                href="/mycloset/account"
                className="text-gray-700 font-bold hover:text-cyan-600 transition-all duration-150"
              >
                Mi Cuenta
              </Link>
            </li>
            <li className="flex flex-col items-center">
              <Link
                href="/mycloset/wardrobe"
                className="text-gray-700 font-bold hover:text-cyan-600 transition-all duration-150"
              >
                Mis Prendas
              </Link>
            </li>
            <li className="flex flex-col items-center">
              <Link
                href="/mycloset/outfits"
                className="text-gray-700 font-bold hover:text-cyan-600 transition-all duration-150"
              >
                Mis Outfits
              </Link>
            </li>
          </ul>
        </div>
      </Drawer>
    </div>
  );
}
