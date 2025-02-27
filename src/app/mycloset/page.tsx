'use client';

import { useEffect, useState } from "react";
import Drawer from "@/components/Drawer";
import Dashboard from "@/components/Dashboard";
import Wardrobe, { Garment } from "@/components/Wardrobe";
import { CloudinaryImage } from "@/interfaces/Images";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Tag } from "@/components/WDManager";
import { useAuth } from "@/contexts/authContext";

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const fetchGarments = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/clothes`,
          { withCredentials: true }
        );
        setSavedGarments(response.data);
      } catch (error) {
        console.error("Error obteniendo garments:", error);
      }
    };

    fetchGarments();
  }, []);

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
        user: user.id,
        name: garment.category.name.padEnd(20, " ") + garment.category.name,
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

  return (
    <div className="relative flex flex-row w-full min-h-screen bg-background">
      <div className="relative flex flex-1 flex-col">
        <Wardrobe garments={savedGarments} onDeleteGarment={handleDeleteGarment} onFilter={handleFilter} />

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
          savedGarments={savedGarments}
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
