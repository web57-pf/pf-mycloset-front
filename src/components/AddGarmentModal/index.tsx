import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaPlus, FaTimes } from 'react-icons/fa';

interface Category {
  id: string;
  name: string;
}

interface Clothes {
  id: string;
  name: string;
  imageUrl: string;
}

interface AddGarmentModalProps {
  onClose: () => void;
}

export default function AddGarmentModal({ onClose }: AddGarmentModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [garments, setGarments] = useState<Clothes[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category`, { withCredentials: true });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const fetchGarments = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clothes/filter/get`, {
            params: {
              category: selectedCategory.id,
              limit: 3, 
            },
            withCredentials: true,
          });
          setGarments(response.data);
        } catch (error) {
          console.error('Error fetching garments:', error);
        }
      };
      fetchGarments();
    }
  }, [selectedCategory]);

  const handleViewAll = () => {
    router.push(`/clothes?category=${selectedCategory?.id}`);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg p-4 w-11/12 md:w-1/2">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
          <FaTimes />
        </button>
        <h2 className="text-xl font-light mb-4">Agregar Prenda</h2>
        <div className="overflow-x-auto flex space-x-4 mb-4 
                        scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1 mb-1 mt-1 rounded-full ${
                selectedCategory?.id === cat.id ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        {selectedCategory && (
          <div>
            <h3 className="text-lg font-light mb-2">Últimas prendas en {selectedCategory.name}</h3>
            <div className="grid grid-cols-3 gap-2 w-fit">
              {garments.map((garment) => (
                <div key={garment.id} className="relative border rounded-sm p-1 group">
                  <Image
                    src={garment.imageUrl}
                    alt={garment.name}
                    width={100}
                    height={100}
                    className="object-cover rounded-sm"
                  />
                  <p className="text-xs text-center mt-1">{garment.name}</p>
                  <button
                  onClick={() => handleAddToCart(garment)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-2 py-1 bg-cyan-500 text-white rounded-full text-xs">
                      <FaPlus />
                    </span>
                  </button>
                </div>
              ))}
            </div>
            <button onClick={handleViewAll} className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-full">
              Ver todas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
