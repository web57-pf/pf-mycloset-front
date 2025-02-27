import { Category } from "@/components/WDManager";
import axios from "axios";

const fetchCategories = async (): Promise<Category[]> => {
  try {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category`,
    {withCredentials: true });
  return response.data;
  } catch (error) {
    console.error("Error obteniendo categorías:", error);
    return [];
  }
};

export default fetchCategories;