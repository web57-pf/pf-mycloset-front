'use client';

import Script from "next/script";
import UploadWidget from "../UploadComponent";
import GarmentManager from "../WDManager";
import { CloudinaryImage } from "@/interfaces/Images";

interface DashboardProps {
  onUploadSuccess: (image: CloudinaryImage) => void;
  newImage: CloudinaryImage | null;
  onSaveGarment: (garment: any) => void;
}

export default function Dashboard({ onUploadSuccess, newImage, onSaveGarment }: DashboardProps) {
  return (
    <>
      <Script
        src="https://widget.cloudinary.com/v2.0/global/all.js"
        strategy="beforeInteractive"
      />
      {!newImage ? (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <h1 className="text-3xl font-normal mb-6">Bienvenido/a {`user`}👋</h1>
        <h2 className="text-xl font-normal mb-6">Pasos a seguir: </h2>
        <div className="flex flex-col gap-4 text-lg text-gray-600 justify-center items-center">
          <p>1. Sube tu prenda</p>
          <p>2. Agrégala a la categoría de tu preferencia</p>
          <p>3. Crea tus looks!</p>
        </div>
        <div className="mb-8 p-8">
          <UploadWidget onUploadSuccess={onUploadSuccess} />
          <GarmentManager newImage={newImage} onSaveGarment={onSaveGarment} />
        </div>
      
      </div>
      ) : (
        <div className="flex flex-col justify-start items-center min-h-screen p-4">
          <GarmentManager newImage={newImage} onSaveGarment={onSaveGarment} />
        </div>
      )}
    </>
  );
}
