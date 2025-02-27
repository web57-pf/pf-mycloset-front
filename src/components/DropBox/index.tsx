'use client';
import { useState } from "react";
import Image from "next/image";
import { Garment } from "../Wardrobe";

interface DropBoxProps {
  onDropItem?: (item: Garment) => void;
}

export default function DropBox({ onDropItem }: DropBoxProps) {
  const [droppedItems, setDroppedItems] = useState<Garment[]>([]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (data) {
      try {
        const garment: Garment = JSON.parse(data);
        setDroppedItems((prev) => [...prev, garment]);
        if (onDropItem) {
          onDropItem(garment);
        }
      } catch (error) {
        console.error("Error al parsear la prenda arrastrada:", error);
      }
    }
  };

  const handleRemoveItem = (id: string) => {
    setDroppedItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div
      className="border-dashed border-4 h-full w-full justify-center items-center border-cyan-500 p-4 rounded-lg mt-4 flex flex-col"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h4 className="text-center font-bold mb-2">Crea tu outfit!</h4>
      {droppedItems.length === 0 ? (
        <p className="text-center text-gray-500">No hay prendas agregadas</p>
      ) : (
        <div className="grid grid-cols-3 gap-4 flex-grow">
          {droppedItems.map((item, index) => (
            <div
              key={item.id + "-" + index}
              className="relative w-28 h-28 border rounded-lg overflow-hidden shadow-md group"
            >
              <Image
                src={item.imageUrl}
                alt={`Prenda ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700 transition"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        disabled={droppedItems.length === 0}
        className={`mt-4 w-fit px-3 py-1 rounded transition-colors ${
          droppedItems.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-cyan-500 text-white hover:bg-cyan-600"
        }`}
      >
        Guardar outfit
      </button>
    </div>
  );
}
