import { Tag } from "@/components/FilterClothes";
import axios from "axios";

const fetchTags = async (): Promise<Tag[]> => {
  try {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tags`,
    {withCredentials: true });
  return response.data;
  } catch (error) {
    console.error("Error obteniendo categorías:", error);
    return [];
  }
};

export default fetchTags;