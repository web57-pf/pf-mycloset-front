'use client';

import { useState, useEffect } from "react";
import { CloudinaryImage } from "@/interfaces/Images";
import { Garment } from "@/components/Wardrobe";

interface GarmentManagerProps {
  newImage: CloudinaryImage | null;
  onSaveGarment: (garment: Garment) => void;
}

export default function GarmentManager({ newImage, onSaveGarment }: GarmentManagerProps) {
  const [pendingImage, setPendingImage] = useState<CloudinaryImage | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = [
    "Casual",
    "Formal",
    "Sport",
    "Vintage",
    "Verano",
    "Invierno",
    "Oficina",
    "Fiesta",
  ];

  useEffect(() => {
    if (newImage) {
      setPendingImage(newImage);
      setSelectedTags([]);
    }
  }, [newImage]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = () => {
    if (pendingImage && selectedTags.length >= 3) {
      const newGarment: Garment = {
        id: Date.now().toString(),
        image: pendingImage,
        tags: selectedTags,
      };
      onSaveGarment(newGarment);
      setPendingImage(null);
      setSelectedTags([]);
    }
  };

  return (
    <div className="p-4">
      {pendingImage && (
        <div className="mb-8 max-w-lg mx-auto">
          <div className="border p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">
              Selecciona al menos 3 tags para tu prenda
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 border rounded transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-cyan-500 text-white border-cyan-500"
                      : "bg-white text-black border-gray-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <button
              onClick={handleSave}
              disabled={selectedTags.length < 3}
              className={`w-full px-4 py-2 rounded transition-colors ${
                selectedTags.length < 3
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              Guardar Prenda
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
