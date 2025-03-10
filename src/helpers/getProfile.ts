export default async function getProfile({id}: {id: string}) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${id}`, {
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
      console.error("Error al obtener el perfil:", err);
      return null;
    }
  }