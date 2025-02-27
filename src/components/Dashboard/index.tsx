'use client';
import Script from "next/script";
import GarmentManager from "../WDManager";
import { CloudinaryImage } from "@/interfaces/Images";
import { useAuth } from "@/contexts/authContext";
import { Garment } from "../Wardrobe";
import { OutfitGarments } from "../DropBox";

interface DashboardProps {
  onUploadSuccess: (image: CloudinaryImage) => void;
  newImage: CloudinaryImage | null;
  onSaveGarment: (garment: Garment) => void;
  onCreateOutfit: (outfit: OutfitGarments) => void;
}

export default function Dashboard({ onUploadSuccess, newImage, onSaveGarment, onCreateOutfit }: DashboardProps) {
  const { user } = useAuth();

  return (
    <div className="relative flex flex-col h-full p-4">
      <Script
        src="https://widget.cloudinary.com/v2.0/global/all.js"
        strategy="beforeInteractive"
      />
      <div className="flex items-center justify-end mb-6">
      <div className="w-fit flex justify-center">
      <h3 className="text-2xl font-light text-center text-gray-800 px-8 py-2">
        Bienvenido/a {user?.email}
      </h3>
      </div>
      </div>

      <div className="flex-grow w-full">
        <GarmentManager
          newImage={newImage}
          onUploadSuccess={onUploadSuccess}
          onSaveGarment={onSaveGarment}
          onCreateOutfit={onCreateOutfit}
        />
      </div>
    </div>
  );
}
