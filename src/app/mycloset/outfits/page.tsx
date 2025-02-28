'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { FaEdit, FaTrash, FaTimes, FaCheck } from 'react-icons/fa';

interface Tag {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface Clothes {
  id: string;
  name: string;
  imageUrl: string;
  category: Category;
  tags: Tag[];
}

interface Combination {
  id: string;
  name: string;
  clothes: Clothes[];
  isDeleted: boolean;
}

export default function MyOutfitsPage() {
  const [outfits, setOutfits] = useState<Combination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<Combination | null>(null);
  const [editingOutfitName, setEditingOutfitName] = useState<string>('');

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/combinations/user-combinations`,
          { withCredentials: true }
        );
        const combos: Combination[] = response.data;
        setOutfits(combos);
      } catch (err: any) {
        console.error("Error al cargar tus outfits:", err);
        setError("Hubo un error al cargar tus outfits.");
      } finally {
        setLoading(false);
      }
    };
    fetchOutfits();
  }, []);

  const handleDeleteOutfit = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/combinations/${id}`, { withCredentials: true });
      setOutfits(prev => prev.filter(outfit => outfit.id !== id));
      setSelectedOutfit(null);
    } catch (err) {
      console.error("Error al eliminar el outfit:", err);
    }
  };

  const handleEditOutfit = async (id: string) => {
    try {
      const payload = { name: editingOutfitName };
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/combinations/${id}`,
        payload,
        { withCredentials: true }
      );
      setOutfits(prev =>
        prev.map(outfit => (outfit.id === id ? { ...outfit, name: editingOutfitName } : outfit))
      );
      setSelectedOutfit(null);
    } catch (err) {
      console.error("Error al editar el outfit:", err);
    }
  };

  const handleRemoveGarmentFromOutfit = async (garmentId: string) => {
    if (!selectedOutfit) return;
    const newClothes = selectedOutfit.clothes.filter(c => c.id !== garmentId);
    const newClothesIds = newClothes.map(c => c.id);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/combinations/${selectedOutfit.id}`,
        { clothesIds: newClothesIds },
        { withCredentials: true }
      );
      setSelectedOutfit({ ...selectedOutfit, clothes: newClothes });
      setOutfits(prev =>
        prev.map(outfit => outfit.id === selectedOutfit.id ? { ...outfit, clothes: newClothes } : outfit)
      );
    } catch (err) {
      console.error("Error al remover la prenda del outfit:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-xl text-gray-700">Cargando outfits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 relative">
      <h1 className="text-4xl font-light text-center text-gray-800 mb-8">Mis Outfits</h1>
      {outfits.length === 0 ? (
        <div className="flex items-center justify-center">
          <p className="text-xl text-gray-600">No tienes outfits creados aún.</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {outfits.map(outfit => (
            <div
              key={outfit.id}
              className="bg-gray-50 rounded-lg shadow-lg p-4 flex flex-col"
            >
              <h2 className="text-2xl font-light text-gray-700 mb-8">{outfit.name}</h2>
              {outfit.clothes && outfit.clothes.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 mb-8">
                  {outfit.clothes.slice(0, 6).map(clothe => (
                    <div
                      key={clothe.id}
                      className="relative w-full h-20 rounded overflow-hidden"
                    >
                      <Image
                        src={clothe.imageUrl}
                        alt={clothe.name}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No se encontraron prendas en este outfit.</p>
              )}
              <button
                onClick={() => {
                  setSelectedOutfit(outfit);
                  setEditingOutfitName(outfit.name);
                }}
                className="mt-auto px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition flex items-center gap-2"
              >
                <FaEdit /> Ver Detalles
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedOutfit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-50 rounded-lg shadow-xl p-6 w-11/12 md:w-2/3 lg:w-1/2 relative">
            <button
              onClick={() => setSelectedOutfit(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-3xl font-light mb-4">Detalles del Outfit</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-lg font-base mb-2">
                Nombre del Outfit:
              </label>
              <input
                type="text"
                value={editingOutfitName}
                onChange={(e) => setEditingOutfitName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <h3 className="text-xl font-base text-gray-800 mb-4">Prendas</h3>
              {selectedOutfit.clothes.map(clothe => (
                <div key={clothe.id} className="flex items-center gap-4 mb-4 border-b pb-2 relative">
                  <div className="relative w-20 h-20 rounded overflow-hidden">
                    <Image
                      src={clothe.imageUrl}
                      alt={clothe.name}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => handleRemoveGarmentFromOutfit(clothe.id)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-700"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{clothe.name}</p>
                    <p className="text-sm text-gray-600">Categoría: {clothe.category?.name}</p>
                    <div className="flex gap-2 mt-1">
                      {clothe.tags && clothe.tags.map(tag => (
                        <span key={tag.id} className="px-2 py-1 bg-gray-200 rounded-full text-xs text-gray-700">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => handleEditOutfit(selectedOutfit.id)}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-green-600 transition"
              >
                <FaCheck /> Guardar
              </button>
              <button
                onClick={() => handleDeleteOutfit(selectedOutfit.id)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-red-500 transition"
              >
                <FaTrash /> Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
