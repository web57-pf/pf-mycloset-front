'use client';

import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import Wardrobe from "@/components/Wardrobe";
import { CloudinaryImage } from "@/interfaces/Images";

export default function MyCloset() {
  const [images, setImages] = useState<CloudinaryImage[]>([]);

  const handleUploadSuccess = (newImage: CloudinaryImage) => {
    setImages((prevImages) => [...prevImages, newImage]);
  };

  return (
    <div className="flex flex-row w-full min-h-screen bg-background">
      <div className="flex flex-col flex-1 bg-inherit">
        <Wardrobe images={images} />
      </div>
      <div className="flex flex-col flex-1 bg-inherit">
        <Dashboard onUploadSuccess={handleUploadSuccess} />
      </div>
    </div>
  );
}
