'use client';
import { OutfitGarments } from "../DropBox";
import { useState } from "react";

interface OutfitCreationWindowProps {
  onClose: () => void;
  onCreateOutfit: (outfit: OutfitGarments) => void;
}

export default function OutfitCreationWindow({ onClose, onCreateOutfit }: OutfitCreationWindowProps) {
    const [name, setName] = useState<string>("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name) return;
        onCreateOutfit({ name, garmentIds: [] });
    }

  return (
    <div className="flex flex-col justify-end w-full h-full p-4">
      <h1 className="text-2xl font-light text-center text-gray-800 mb-4">
        Crear nuevo outfit
      </h1>
      <div className="flex flex-col w-fit gap-4">
        <form 
        onSubmit={handleSubmit}
        className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Nombra tu outfit
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg shadow-sm px-2 py-1 focus:border-cyan-500 focus:ring-cyan-500"
            placeholder="Nombre del outfit"
          />
      <div className="flex flex-row gap-2">
      <button 
        onClick={onClose}
        className="mt-4 w-fit px-3 py-1 rounded transition-colors bg-gray-400 text-white hover:bg-red-400"
      >
        Volver
      </button>
      <button 
        type="submit"
        className="mt-4 w-fit px-3 py-1 rounded transition-colors bg-cyan-400 text-white hover:bg-green-400"
      >
        Guardar
      </button>
      </div>
        </form>
      </div>
    </div>
  );
}
