'use client';

import { useEffect, useState } from "react";
import Dashboard from "@/components/Dashboard";
import Wardrobe, { Garment } from "@/components/Wardrobe";
import { CloudinaryImage } from "@/interfaces/Images";
import axios from "axios";
import { Tag } from "@/components/WDManager";
import { useAuth } from "@/contexts/authContext";
import { OutfitGarments } from "@/components/DropBox";
import ProtectedRoute from "@/components/ProtectedRoute/protectedRoute";
import getUserOutfits from "@/helpers/getUserOutfits";

export interface Clothe {
  name: string;
  categoryId: string;
  type: string;
  imageUrl: string;
  tags: Tag[];
  favorite: boolean;
  combinations: string[];
}

export default function MyCloset() {
  const [newImage, setNewImage] = useState<CloudinaryImage | null>(null);
  const [savedGarments, setSavedGarments] = useState<Garment[]>([]);
  const [allGarments, setAllGarments] = useState<Garment[]>([]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [outfitsLength, setOutfitsLength] = useState(0);

  const { user } = useAuth();

  useEffect(() => {
    const fetchGarments = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/clothes`,
          { withCredentials: true }
        );
        setSavedGarments(response.data);
        setAllGarments(response.data);
      } catch (error) {
        console.error("Error obteniendo garments:", error);
      }
    };

    fetchGarments();
  }, []);

  useEffect(() => {
    if (user) {
      getUserOutfits()
        .then((response) => {
          setOutfitsLength(response.length);  
        })
        .catch((error) => {
          console.error("Error obteniendo los outfits:", error);
        });
    }
  }, [user]);

  const handleUploadSuccess = (image: CloudinaryImage) => {
    setNewImage(image);
  };

  const handleSaveGarment = async (garment: Garment) => {
    if (!user) {
      console.error("No user found");
      return;
    }

    try {
      const payload = {
        name: garment.name,
        categoryId: garment.category.id,
        type: "default",
        imageUrl: garment.imageUrl,
        tags: garment.tags.map((tag) => tag.id),
        favorite: false,
        combinations: []
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/clothes`,
        payload,
        { withCredentials: true }
      );
      setSavedGarments((prev) => [...prev, response.data]);
      setAllGarments((prev) => [...prev, response.data]);
      setNewImage(null);
    } catch (error) {
      console.error("Error guardando garment:", error);
    }
  };

  const handleDeleteGarment = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clothes/${id}`, {
        withCredentials: true,
      });
      setSavedGarments((prev) => prev.filter((g) => g.id !== id));
      setAllGarments((prev) => prev.filter((g) => g.id !== id));
    } catch (error) {
      console.error("Error eliminando garment:", error);
    }
  };

  const handleFilter = async (categoryId: string, tagIds: string[]) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/clothes/filter/get`,
        {
          params: {
            category: categoryId,
            tags: tagIds.join(",")
          },
          withCredentials: true,
        }
      );
      setSavedGarments(response.data);
    } catch (error) {
      console.error("Error filtrando garments:", error);
    }
  };

  const handleClearFilter = () => {
    setSavedGarments(allGarments);
  };

  const handleCreateOutfit = async ({ name, garmentIds }: OutfitGarments) => {
    try {
      const payload = {
        name: name,
        clothesIds: garmentIds,
      }

      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/combinations/create-combination`, 
      payload, { withCredentials: true }
      );
      setMessage({ type: "success", text: "Outfit creado correctamente." });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error guardando outfit:", error);
      setMessage({ type: "error", text: "Hubo un error al crear el outfit." });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <ProtectedRoute>

    <div className="relative flex flex-row w-full min-h-screen bg-background">
      {message && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {message.text}
        </div>
      )}
      <div className="relative flex flex-1 flex-col min-h-screen">
        <Wardrobe 
          garments={savedGarments} 
          onDeleteGarment={handleDeleteGarment} 
          onFilter={handleFilter}
          onClearFilter={handleClearFilter} 
          />

      </div>

      <div className="flex flex-col flex-1">
        <Dashboard
          onUploadSuccess={handleUploadSuccess}
          newImage={newImage}
          onSaveGarment={handleSaveGarment}
          onCreateOutfit={handleCreateOutfit}
          outfitsLength={outfitsLength}
          />
      </div>
    </div>
          </ProtectedRoute>
  );
}
