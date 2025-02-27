'use client';
import Image from "next/image";
import Armario from "../WDAnimation";
import { Category, Tag } from "../WDManager";
import { useState } from "react";
import FilterClothes from "../FilterClothes";

export interface Garment {
  id: string;
  imageUrl: string;
  tags: Tag[];
  category: Category;
}

interface WardrobeProps {
  garments: Garment[];
  onDeleteGarment: (id: string) => void;
  onFilter: (categoryId: string, tagIds: string[]) => void;
}

export default function Wardrobe({ garments, onDeleteGarment, onFilter }: WardrobeProps) {
  const [showFilter, setShowFilter] = useState(false);
  return (
    <div className="p-4 max-w-6xl mx-auto">
      {garments.length > 0 ? (
        <>
          
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-3">
            <h3 className="text-xl font-base mb-6 text-center">
              Prendas guardadas
            </h3>
          <div className="w-full flex justify-center mt-4">
          <button
            onClick={() => setShowFilter((prev) => !prev)}
            className="text-sm text-cyan-600 underline hover:text-cyan-800 transition"
          >
            {showFilter ? "Ocultar Filtros" : "Filtrar prendas"}
          </button>
          </div>

          {showFilter && (
            <div className="mt-4">
              <FilterClothes onFilter={onFilter} />
            </div>
          )}
          </div>
          {garments.map((garment, index) => (
            <div
              key={garment.id}
              className="relative group rounded-lg overflow-hidden shadow-lg w-40 h-40 mx-auto"
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.setData("application/json", JSON.stringify(garment));
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={garment.imageUrl}
                  alt={`Prenda ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 transform group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition duration-300 flex flex-col justify-end p-4">
                <div className="opacity-0 group-hover:opacity-100 transition duration-300">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {garment.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => onDeleteGarment(garment.id)}
                    className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
      ) : (
        <Armario />
      )}
    </div>
  );
}
