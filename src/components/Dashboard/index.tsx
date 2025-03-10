'use client';
import Script from "next/script";
import GarmentManager from "../WDManager";
import { CloudinaryImage } from "@/interfaces/Images";
import { useAuth } from "@/contexts/authContext";
import { Garment } from "../Wardrobe";
import { OutfitGarments } from "../DropBox";
import { useEffect, useState } from "react";
import getProfile from "@/helpers/getProfile";
import { UserProfile } from "@/app/mycloset/account/page";

interface DashboardProps {
  onUploadSuccess: (image: CloudinaryImage) => void;
  newImage: CloudinaryImage | null;
  onSaveGarment: (garment: Garment) => void;
  onCreateOutfit: (outfit: OutfitGarments) => void;
  outfitsLength: number;
}

export default function Dashboard({ onUploadSuccess, newImage, onSaveGarment, onCreateOutfit, outfitsLength }: DashboardProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    const fetchProfile = async () => {
      try {
        const response = await getProfile({ id: user.id });
        setProfile(response);
      } catch (err) {
        console.error("Error al cargar perfil:", err);
      }
    };
    fetchProfile();
  }, [user]);

  return (
    <div className="relative flex flex-col h-full p-4">
      <Script
        src="https://widget.cloudinary.com/v2.0/global/all.js"
        strategy="beforeInteractive"
      />
      <div className="flex items-center justify-end mb-6">
      <div className="w-fit flex justify-center">
      <h3 className="text-2xl font-light text-center text-gray-800 px-8 py-2">
        Bienvenido/a {profile?.name}
      </h3>
      </div>
      </div>

      <div className="flex-grow w-full">
        <GarmentManager
          newImage={newImage}
          onUploadSuccess={onUploadSuccess}
          onSaveGarment={onSaveGarment}
          onCreateOutfit={onCreateOutfit}
          profileInfo={profile}
          outfitsLength={outfitsLength}
        />
      </div>
    </div>
  );
}