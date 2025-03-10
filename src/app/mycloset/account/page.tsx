'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { FaSave, FaEdit, FaTimes } from "react-icons/fa";
import { useAuth } from "@/contexts/authContext";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  registeredAt?: string;
  isAdmin?: boolean;
  subscriptionType?: string;
}

interface UpdatedProfile {
  name: string;
  email: string;
  currentPassword?: string;
  password?: string;
  subscriptionType?: string;
}

function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user.id}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error("Error al cargar perfil:", err);
        setError("No se pudo cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (profile) {
      setProfile({ ...profile, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    // Check password requirements first
    if (newPassword && !currentPassword) {
      setError("Para cambiar la contraseña, ingresa tu contraseña actual.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Show confirmation dialog
    const confirmed = window.confirm("¿Estás seguro/a que deseas actualizar tu perfil?");
    if (!confirmed) return;

    try {
      const payload: UpdatedProfile = {
        name: profile.name,
        email: profile.email,
      };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.password = newPassword;
      }
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${profile.id}`,
        payload,
        { withCredentials: true }
      );
      setSuccess("Perfil actualizado correctamente.");
      setIsEditing(false);
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      setError("Error al actualizar el perfil.");
      setTimeout(() => setError(null), 3000);
    }
  };

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
      <div className="w-full max-w-3xl">
        {!isEditing && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-light text-gray-800">Perfil de Usuario</h1>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition"
              >
                <FaEdit /> Editar
              </button>
            </div>
            {success && <p className="mb-4 text-green-600">{success}</p>}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">Nombre:</label>
                <p className="mt-1 text-gray-600">{profile?.name}</p>
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Email:</label>
                <p className="mt-1 text-gray-600">{profile?.email}</p>
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Suscripción:</label>
                <p className="mt-1 text-gray-600">{profile?.subscriptionType}</p>
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Fecha de registro:</label>
                <p className="mt-1 text-gray-600">{(profile?.registeredAt) ? new Date(profile?.registeredAt).toLocaleDateString() : ''}</p>
              </div>
            </div>
          </div>
        )}

        {isEditing && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-medium text-gray-800">Editar Perfil</h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              {error && <p className="mb-2 text-red-500">{error}</p>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Nombre:</label>
                  <input
                    type="text"
                    name="name"
                    value={profile?.name || ""}
                    onChange={handleChange}
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Sucripción:</label>
                    <select
                    name="subscriptionType"
                    value={profile?.subscriptionType || ""}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                    <option value="pro">Pro</option>
                    </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Contraseña actual:</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña actual"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Nueva contraseña:</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Ingresa tu nueva contraseña"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    <FaSave /> Guardar cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
