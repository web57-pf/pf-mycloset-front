'use client';
import { useState, useEffect } from "react";
import { CloudinaryImage } from "@/interfaces/Images";
import { Garment } from "@/components/Wardrobe";
import axios from "axios";
import UploadWidget from "../UploadComponent";
import DropBox, { OutfitGarments } from "../DropBox";
import fetchCategories from "@/helpers/categories";
import { UserProfile } from "@/app/mycloset/account/page";

export interface Tag {
  id: string;
  name: string;
  isDeleted?: boolean;
}

export interface Category {
  id: string;
  name: string;
  isDeleted?: boolean;
}

interface GarmentManagerProps {
  newImage: CloudinaryImage | null;
  onSaveGarment: (garment: Garment) => void;
  onUploadSuccess: (image: CloudinaryImage) => void;
  onCreateOutfit: (outfit: OutfitGarments) => void;
  profileInfo: UserProfile | null;
  outfitsLength: number;
}

export default function GarmentManager({ newImage, onSaveGarment, onUploadSuccess, onCreateOutfit, profileInfo, outfitsLength }: GarmentManagerProps) {
  const [pendingImage, setPendingImage] = useState<CloudinaryImage | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [droppedGarment, setDroppedGarment] = useState<Garment | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tags`);
        setAvailableTags(response.data);
      } catch (error) {
        console.error("Error obteniendo tags:", error);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    fetchCategories()
      .then((response) => {
        setCategories(response);
      })
      .catch((error) => {
        console.error("Error obteniendo categorias:", error);
      });
  }, []);

  useEffect(() => {
    if (newImage) {
      setPendingImage(newImage);
      setSelectedTags([]);
      setSelectedCategory(null);
    }
  }, [newImage]);

  const toggleTag = (tagId: string) => {
    if (selectedTags.some(tag => tag.id === tagId)) {
      setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
    } else {
      const tagToAdd = availableTags.find(tag => tag.id === tagId);
      if (tagToAdd) {
        setSelectedTags([...selectedTags, tagToAdd]);
      }
    }
  };

  const handleSave = () => {
    if (pendingImage && selectedTags.length >= 1 && selectedCategory) {
      const newGarment: Garment = {
        name: name,
        id: Date.now().toString(),
        imageUrl: pendingImage.secure_url,
        tags: selectedTags,
        category: selectedCategory,
      };
      onSaveGarment(newGarment);
      setPendingImage(null);
      setSelectedTags([]);
      setSelectedCategory(null);
    }
  };

  const handleDropItem = (garment: Garment) => {
    console.log("Prenda recibida en DropBox:", garment);
    setDroppedGarment(garment);
    console.log(droppedGarment)
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {pendingImage ? (
        <div className="mb-8 max-w-lg mx-auto">
          <div className="bg-gray-50 opacity-80 p-6 rounded-lg shadow-md max-w-md mx-auto transition-all duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 tracking-wide">
              Asigna una categoría, un nombre y al menos 1 tag para tu prenda
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecciona una categoría:
              </label>
              <select
                value={selectedCategory?.id || ''}
                onChange={(e) => {
                  const category = categories.find(c => c.id === e.target.value);
                  setSelectedCategory(category || null);
                }}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              >
                <option value="">-- Selecciona --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
                Nombre de la prenda:
              </label>
              <input
                required
                type="text"
                name="name"
                className="w-full mb-4 border-gray-300 rounded-md shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`px-2 py-1 border rounded-lg text-sm transition-colors duration-300 ease-in-out ${
                    selectedTags.some(selectedTag => selectedTag.id === tag.id)
                      ? "bg-cyan-500 text-white border-cyan-500"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-cyan-100"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>

            <button
              onClick={handleSave}
              disabled={selectedTags.length < 1 || !selectedCategory}
              className={`w-full px-4 py-2 rounded-full transition-colors ${
                selectedTags.length < 1 || !selectedCategory
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              Guardar Prenda
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <DropBox onDropItem={handleDropItem} onCreateOutfit={onCreateOutfit} profileInfo={profileInfo} outfitsLength={outfitsLength} />
          <div className="flex justify-end p-8 w-full">
          <UploadWidget onUploadSuccess={onUploadSuccess} />
          </div>
          
        </div>
      )}
    </div>
  );
}