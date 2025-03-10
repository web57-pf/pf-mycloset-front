export default async function getUserOutfits() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/combinations/user-combinations`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error al obtener los outfits:", err);
    return null;
  }
}