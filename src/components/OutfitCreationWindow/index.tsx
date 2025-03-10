'use client';
import { UserProfile } from "@/app/mycloset/account/page";
import { OutfitGarments } from "../DropBox";
import { useState } from "react";
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

interface OutfitCreationWindowProps {
  onClose: () => void;
  onCreateOutfit: (outfit: OutfitGarments) => void;
  profileInfo: UserProfile | null;
  outfitsLength: number;
}

export default function OutfitCreationWindow({ onClose, onCreateOutfit, profileInfo, outfitsLength }: OutfitCreationWindowProps) {
    const [name, setName] = useState<string>("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name) return;
        
        if (profileInfo?.subscriptionType === "free") {
            const result = await Swal.fire({
                title: '¡Suscripción requerida!',
                text: 'Necesitas una suscripción Premium o Pro para guardar outfits',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ver suscripciones',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                router.push('/tarifas');
            }
            return;
        }

        if (outfitsLength >= 5 && profileInfo?.subscriptionType === "premium") {
            const result = await Swal.fire({
                title: '¡Suscripción PRO requerida!',
                text: 'No puedes guardar más de 5 outfits con una suscripción Premium',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ver suscripciones',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                router.push('/tarifas');
            }
            return;
        }

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
        className="mt-4 w-fit px-3 py-1 rounded-full transition-colors bg-gray-400 text-white hover:bg-red-400"
      >
        Volver
      </button>
      <button 
        type="submit"
        className="mt-4 w-fit px-3 py-1 rounded-full transition-colors bg-cyan-400 text-white hover:bg-green-400"
      >
        Guardar
      </button>
      </div>
        </form>
      </div>
    </div>
  );
}
