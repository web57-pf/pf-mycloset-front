'use client'
import { useEffect, useState } from "react";
import fetchCategories from "@/helpers/categories";
import fetchTags from "@/helpers/tags";
import { Category, Tag } from "../FilterClothes";

export default function ContentCreator() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("");

  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTagValue, setEditingTagValue] = useState<string>("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState<string>("");

  useEffect(() => {
    fetchTags().then(data => setTags(data));
    fetchCategories().then(data => setCategories(data));
  }, []);

  const handleCreateTag = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tags`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTag }),
      });
      const createdTag = await response.json();
      setTags([...tags, createdTag]);
      setNewTag("");
    } catch (error) {
      console.error("Error creando tag:", error);
    }
  };

  const handleUpdateTag = async (tagId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tags/${tagId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingTagValue }),
      });
      const updatedTag = await response.json();
      setTags(tags.map(tag => tag.id === tagId ? updatedTag : tag));
      setEditingTagId(null);
      setEditingTagValue("");
    } catch (error) {
      console.error("Error actualizando tag:", error);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tags/${tagId}`, {
        method: "DELETE",
        credentials: "include",
      });
      setTags(tags.filter(tag => tag.id !== tagId));
    } catch (error) {
      console.error("Error eliminando tag:", error);
    }
  };

  // Funciones para Categories
  const handleCreateCategory = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });
      const createdCategory = await response.json();
      setCategories([...categories, createdCategory]);
      setNewCategory("");
    } catch (error) {
      console.error("Error creando categoría:", error);
    }
  };

  const handleUpdateCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category/${categoryId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingCategoryValue }),
      });
      const updatedCategory = await response.json();
      setCategories(categories.map(cat => cat.id === categoryId ? updatedCategory : cat));
      setEditingCategoryId(null);
      setEditingCategoryValue("");
    } catch (error) {
      console.error("Error actualizando categoría:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category/${categoryId}`, {
        method: "DELETE",
        credentials: "include",
      });
      setCategories(categories.filter(cat => cat.id !== categoryId));
    } catch (error) {
      console.error("Error eliminando categoría:", error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-[#fffbf7] to-[#fffbf7] min-h-screen">
      <h1 className="text-3xl font-light text-center mb-8 text-gray-800 tracking-wide">
        myContentCreator
      </h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tags</h2>
          <div className="mb-4">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Nueva Tag"
              className="w-full border border-gray-300 p-2 rounded-md"
            />
            <button
              onClick={handleCreateTag}
              className="mt-4 px-3 py-1 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition"
            >
              Crear Tag
            </button>
          </div>
          <ul>
            {tags.map((tag) => (
              <li key={tag.id} className="flex justify-between items-center border-b border-gray-200 py-2">
                {editingTagId === tag.id ? (
                  <>
                    <input
                      type="text"
                      value={editingTagValue}
                      onChange={(e) => setEditingTagValue(e.target.value)}
                      className="border border-gray-300 p-2 rounded-md flex-grow mr-2"
                    />
                    <button
                      onClick={() => handleUpdateTag(tag.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => {
                        setEditingTagId(null);
                        setEditingTagValue("");
                      }}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-grow">{tag.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingTagId(tag.id);
                          setEditingTagValue(tag.name);
                        }}
                        className="px-3 py-1 bg-cyan-500 text-white rounded-md hover:bg-green-600 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
                        className="px-3 py-1 bg-gray-400 text-white rounded-md hover:bg-red-700 transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Categorías</h2>
          <div className="mb-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nueva Categoría"
              className="w-full border border-gray-300 p-2 rounded-md"
            />
            <button
              onClick={handleCreateCategory}
              className="mt-4 px-3 py-1 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition"
            >
              Crear Categoría
            </button>
          </div>
          <ul>
            {categories.map((cat) => (
              <li key={cat.id} className="flex justify-between items-center border-b border-gray-200 py-2">
                {editingCategoryId === cat.id ? (
                  <>
                    <input
                      type="text"
                      value={editingCategoryValue}
                      onChange={(e) => setEditingCategoryValue(e.target.value)}
                      className="border border-gray-300 p-2 rounded-md flex-grow mr-2"
                    />
                    <button
                      onClick={() => handleUpdateCategory(cat.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => {
                        setEditingCategoryId(null);
                        setEditingCategoryValue("");
                      }}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-grow">{cat.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingCategoryId(cat.id);
                          setEditingCategoryValue(cat.name);
                        }}
                        className="px-3 py-1 bg-cyan-500 text-white rounded-md hover:bg-green-600 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="px-3 py-1 bg-gray-400 text-white rounded-md hover:bg-red-700 transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
