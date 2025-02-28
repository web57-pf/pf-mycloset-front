'use client';

import { useState, useEffect } from "react";
import axios from "axios";

export interface Tag {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

interface FilterClothesProps {
  onFilter: (categoryId: string, tagIds: string[]) => void;
  onClearFilter: () => void;
}

export default function FilterClothes({ onFilter, onClearFilter }: FilterClothesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category`, {
          withCredentials: true,
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Error obteniendo categorías:", error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tags`, {
          withCredentials: true,
        });
        setTags(response.data);
      } catch (error) {
        console.error("Error obteniendo tags:", error);
      }
    };

    fetchCategories();
    fetchTags();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleFilter = () => {
    onFilter(selectedCategory, selectedTags);
  };

  const handleClear = () => {
    setSelectedCategory("");
    setSelectedTags([]);
    onClearFilter();
  };

  return (
    <div className="bg-gray-50 opacity-80 p-6 rounded-lg shadow-md max-w-md mx-auto transition-all duration-300">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 tracking-wide">
        Filtrar Prendas
      </h3>
      <div className="mb-5">
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Categoría
        </label>
        <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="w-full p-1 border border-gray-300 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors duration-300"
        >
        <option value="">Todas las categorías</option>
        {categories.map((cat) => (
            <option key={cat.id} value={cat.id} className="bg-white text-gray-800">
            {cat.name}
            </option>
        ))}
        </select>
      </div>
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className={`px-1 py-1 border rounded-lg text-sm transition-colors duration-300 ease-in-out ${
                selectedTags.includes(tag.id)
                  ? "bg-cyan-500 text-white border-cyan-500"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-cyan-100"
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={handleFilter}
          className="w-full py-2 bg-cyan-500 text-white rounded-lg shadow hover:bg-cyan-600 transition-all duration-300"
        >
          Aplicar filtros
        </button>
        <button
          onClick={handleClear}
          className="w-full py-2 bg-gray-300 text-black rounded-lg shadow hover:bg-gray-400 transition-all duration-300"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}
