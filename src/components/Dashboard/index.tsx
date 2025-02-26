'use client';

import Script from "next/script";
import UploadWidget from "../UploadComponent";
import GarmentManager from "../WDManager";
import { CloudinaryImage } from "@/interfaces/Images";
import { useAuth } from "@/contexts/authContext";
import { useState } from "react";
import { Garment } from "../Wardrobe";

interface DashboardProps {
  onUploadSuccess: (image: CloudinaryImage) => void;
  newImage: CloudinaryImage | null;
  onSaveGarment: (garment: any) => void;
  savedGarments: Garment[];
}

export default function Dashboard({ onUploadSuccess, newImage, onSaveGarment, savedGarments }: DashboardProps) {
  const { user } = useAuth();
  const [showUpload, setShowUpload] = useState(true);

  return (
    <div className="relative flex flex-col h-full p-4">
      <Script
        src="https://widget.cloudinary.com/v2.0/global/all.js"
        strategy="beforeInteractive"
      />
      <h1 className="text-2xl mb-4 text-center">
        Bienvenido/a {user?.email}
      </h1>


      <div className="flex-grow w-full">
        <GarmentManager
          newImage={newImage}
          onUploadSuccess={onUploadSuccess}
          onSaveGarment={onSaveGarment}
          />
      </div>
      {showUpload && (
        <div className="mb-4">
          <UploadWidget
            onUploadSuccess={(image) => {
              onUploadSuccess(image);
              setShowUpload(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
