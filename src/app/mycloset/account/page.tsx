'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { FaSave, FaEdit, FaTimes } from "react-icons/fa";
import { useAuth } from "@/contexts/authContext";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  registeredAt?: string;
  isAdmin?: boolean;
}

function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile`,
          { withCredentials: true }
        );
        setProfile(response.data);
      } catch (err) {
        console.error("Error al cargar perfil:", err);
        setError("No se pudo cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (profile) {
      setProfile({ ...profile, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      const payload = {
        name: profile.name,
        email: profile.email,
        ...(profile.password ? { password: profile.password } : {}),
      };
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${profile.id}`,
        payload,
        { withCredentials: true }
      );
      setSuccess("Perfil actualizado correctamente.");
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      setError("Error al actualizar el perfil.");
      setTimeout(() => setError(null), 3000);
    }
  };

  // const handleDelete = async () => {
  //   if (!profile) return;
  //   if (!window.confirm("¿Estás seguro de eliminar tu cuenta?")) return;
  //   try {
  //     await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${profile.id}`, {
  //       withCredentials: true,
  //     });
  //     logout();
  //   } catch (err) {
  //     console.error("Error al eliminar cuenta:", err);
  //     setError("Error al eliminar la cuenta.");
  //     setTimeout(() => setError(null), 3000);
  //   }
  // };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-xl text-gray-700">Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-light text-gray-800">Perfil de Usuario</h1>
          {isEditing ? (
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              <FaTimes size={24} />
            </button>
          ) : null}
        </div>
        {success && <p className="mb-4 text-green-600">{success}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Nombre:</label>
            <input
              type="text"
              name="name"
              value={profile?.name || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Email:</label>
            <input
              type="email"
              name="email"
              value={profile?.email || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          {isEditing && (
            <div>
              <label className="block text-gray-700 mb-1">Contraseña:</label>
              <input
                type="password"
                name="password"
                placeholder="Deja en blanco para no cambiar"
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          )}
          <div className="flex justify-end gap-4 mt-4">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  <FaSave /> Guardar cambios
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition"
                >
                  <FaEdit /> Editar
                </button>
                {/* <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  <FaTrash /> Eliminar cuenta
                </button> */}
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
