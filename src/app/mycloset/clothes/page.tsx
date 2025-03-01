'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import fetchCategories from "@/helpers/categories";

interface Tag {
  id: string;
  name: string;
  isDeleted?: boolean;
}

interface Category {
  id: string;
  name: string;
  isDeleted?: boolean;
}

export interface Clothes {
  id: string;
  name: string;
  imageUrl: string;
  type: string;
  category: Category;
  tags: Tag[];
  favorite: boolean;
}

export default function AllClothesPage() {
  const [clothes, setClothes] = useState<Clothes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedClothe, setSelectedClothe] = useState<Clothes | null>(null);
  const [editName, setEditName] = useState<string>("");

  useEffect(() => {
    fetchCategories()
      .then((response) => setCategories(response))
      .catch((error) => console.error("Error obteniendo categorías:", error));
  }, []);

  useEffect(() => {
    const fetchClothes = async () => {
      setLoading(true);
      try {
        let response;
        if (selectedCategory) {
          response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/clothes/filter/get`,
            {
              params: { category: selectedCategory },
              withCredentials: true,
            }
          );
        } else {
          response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/clothes`,
            { withCredentials: true }
          );
        }
        setClothes(response.data);
        setError(null);
      } catch (err: unknown) {
        console.error("Error al cargar las prendas:", err);
        setError("Hubo un error al cargar las prendas.");
      } finally {
        setLoading(false);
      }
    };

    fetchClothes();
  }, [selectedCategory]);

  const handleUpdateClothe = async (id: string) => {
    try {
      const payload = { name: editName };
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/clothes/${id}`,
        payload,
        { withCredentials: true }
      );
      setClothes((prev) =>
        prev.map((clothe) =>
          clothe.id === id ? { ...clothe, name: editName } : clothe
        )
      );
      setSelectedClothe(null);
    } catch (err) {
      console.error("Error al actualizar la prenda:", err);
    }
  };

  const handleDeleteClothe = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clothes/${id}`, {
        withCredentials: true,
      });
      setClothes((prev) => prev.filter((clothe) => clothe.id !== id));
      setSelectedClothe(null);
    } catch (err) {
      console.error("Error al eliminar la prenda:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <h1 className="text-4xl font-light text-center text-gray-800 mb-8">
        Todas las Prendas
      </h1>

      <div className="max-w-6xl mx-auto mb-6">
        <label htmlFor="category" className="block text-lg text-gray-700 mb-2">
          Filtrar por categoría:
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory("")}
            className="mt-2 text-sm text-cyan-600 underline hover:text-cyan-800"
          >
            Limpiar filtro
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center">
          <p className="text-xl text-gray-700">Cargando prendas...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center">
          <p className="text-xl text-red-500">{error}</p>
        </div>
      ) : clothes.length === 0 ? (
        <div className="flex items-center justify-center">
          <p className="text-xl text-gray-600">No se encontraron prendas.</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {clothes.map((clothe) => (
            <div
              key={clothe.id}
              className="bg-white rounded-lg shadow-lg p-4 flex flex-col"
            >
              <div className="relative w-full h-56 rounded overflow-hidden mb-4">
                <Image
                  src={clothe.imageUrl}
                  alt={clothe.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-2xl font-light text-gray-800 mb-2">
                {clothe.name}
              </h2>
              <p className="text-gray-600 mb-2">
                Categoría: {clothe.category?.name}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {clothe.tags?.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 bg-gray-200 rounded-full text-xs text-gray-700"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
              <div className="flex justify-end">
              <button
                onClick={() => {
                  setSelectedClothe(clothe);
                  setEditName(clothe.name);
                }}
                className="mt-auto px-4 py-2 w-fit bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition flex items-center gap-2"
              >
                <FaEdit /> Editar
              </button>
            </div>
            </div>
          ))}
        </div>
      )}

      {selectedClothe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 md:w-1/2 relative">
            <button
              onClick={() => setSelectedClothe(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-3xl font-light mb-4">Editar Prenda</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-lg font-medium mb-2">
                Nombre de la prenda:
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => handleUpdateClothe(selectedClothe.id)}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-full hover:bg-green-500 transition"
              >
                <FaEdit /> Guardar Cambios
              </button>
              <button
              onClick={() => {
                if (window.confirm("¿Estás seguro que deseas eliminar la prenda?")) {
                  handleDeleteClothe(selectedClothe.id);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-red-500 transition"
            >
              <FaTrash /> Eliminar Prenda
            </button>            
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
