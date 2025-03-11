'use client'
import React, { useEffect, useState } from "react";
import { Doughnut, Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { 
  getFreeUsersCount, 
  getPremiumUsersCount, 
  getProUsersCount, 
  getTotalSales, 
  getUsersCount,
  getMonthlyRegistrations,
  getMonthlySubscriptions
} from "@/helpers/getMetrics";
import Swal from 'sweetalert2';
import axios from 'axios';
import { GrStatusGood } from "react-icons/gr";
import OrdersTable from "@/components/OrdersTable";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

interface Subscription {
  type: string;
  count: number;
}

interface Order {
  date: string;
  amount: number;
}

interface RegistrationMetric {
  month: string;
  count: string;
}

interface SubscriptionMetric {
  month: string;
  subscriptionType: string;
  count: string;
}

export interface DetailedUser {
  id: string;
  name: string;
  email: string;
  subscriptionType: string;
  registeredAt: string;
  isBanned?: boolean;
  isAdmin?: boolean;
}

export const AdminDashboard = () => {
  const [usersCount, setUsersCount] = useState<number>(0);
  const [proUsers, setProUsers] = useState<any[]>([]);
  const [premiumUsers, setPremiumUsers] = useState<any[]>([]);
  const [freeUsers, setFreeUsers] = useState<any[]>([]);
  const [totalSales, setTotalSales] = useState<number>(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [monthlyRegistrations, setMonthlyRegistrations] = useState<RegistrationMetric[]>([]);
  const [monthlySubscriptions, setMonthlySubscriptions] = useState<SubscriptionMetric[]>([]);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [detailedUsers, setDetailedUsers] = useState<DetailedUser[]>([]);
  const [isViewingBanned, setIsViewingBanned] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<DetailedUser | null>(null);
  const [updateForm, setUpdateForm] = useState({
    name: "",
    email: "",
    subscriptionType: "",
  });
  const [showOrdersTable, setShowOrdersTable] = useState(false);

  useEffect(() => {
    getUsersCount().then((response) => {
      setUsersCount(response.count);
    });
    getProUsersCount().then((response) => {
      setProUsers(response);
    });
    getPremiumUsersCount().then((response) => {
      setPremiumUsers(response);
    });
    getFreeUsersCount().then((response) => {
      setFreeUsers(response);
    });
    getTotalSales().then((response) => {
      setTotalSales(response.total);
      setOrders(response.orders);
    });
    getMonthlyRegistrations().then((data) => {
      setMonthlyRegistrations(data);
    });
    getMonthlySubscriptions().then((data) => {
      setMonthlySubscriptions(data);
    });
  }, []);

  const handleShowUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/total`, {
        credentials: 'include'
      });
      const data = await response.json();
      setDetailedUsers(data);
      setIsViewingBanned(false);
      setShowUsersModal(true);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleShowBannedUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/banned/users`, {
        credentials: 'include'
      });
      const data = await response.json();
      setDetailedUsers(data);
      setIsViewingBanned(true);
    } catch (error) {
      console.error('Error fetching banned users:', error);
    }
  };

  const handleShowAllUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/total`, {
        credentials: 'include'
      });
      const data = await response.json();
      setDetailedUsers(data);
      setIsViewingBanned(false);
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  };

  const openUpdateModal = (user: DetailedUser) => {
    setUserToUpdate(user);
    setUpdateForm({
      name: user.name,
      email: user.email,
      subscriptionType: user.subscriptionType,
    });
    setShowUpdateModal(true);
  };

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToUpdate) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${userToUpdate.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateForm),
      });
      const updatedUser = await response.json();
      setDetailedUsers(
        detailedUsers.map(user =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      setShowUpdateModal(false);
      setUserToUpdate(null);
      Swal.fire(
        '¡Usuario actualizado!',
        'Los datos del usuario se han actualizado correctamente.',
        'success'
      );
    } catch (error) {
      Swal.fire(
        'Error',
        'No se pudo actualizar el usuario.',
        'error'
      );
    }
  };

  const handleBanUser = async (userId: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Deseas banear a este usuario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, banear',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${userId}`, {
          withCredentials: true
        });
        if (isViewingBanned) {
          handleShowBannedUsers();
        } else {
          handleShowAllUsers();
        }
        Swal.fire(
          '¡Usuario baneado!',
          'El usuario ha sido baneado exitosamente.',
          'success'
        );
      } catch (error) {
        Swal.fire(
          'Error',
          'No se pudo banear al usuario.',
          'error'
        );
      }
    }
  };

  // Nueva función para asignar el rol de administrador
  const handleMakeAdmin = async (userId: string) => {
    const result = await Swal.fire({
      title: 'Asignar rol de administrador',
      text: "Esta acción asignará el rol de administrador a este usuario.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, asignar',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${userId}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isAdmin: true }),
        });
        const updatedUser = await response.json();
        setDetailedUsers(
          detailedUsers.map(user => user.id === updatedUser.id ? updatedUser : user)
        );
        Swal.fire('¡Rol asignado!', 'El usuario ahora es administrador.', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo asignar el rol de administrador.', 'error');
      }
    }
  };

  const subscriptionData: Subscription[] = [
    { type: "Gratis", count: freeUsers.length },
    { type: "Premium", count: premiumUsers.length },
    { type: "Pro", count: proUsers.length },
  ];

  const registrationLabels = monthlyRegistrations.map(item => item.month);
  const registrationCounts = monthlyRegistrations.map(item => Number(item.count));

  const subscriptionPivot: { [month: string]: { free: number; premium: number; pro: number } } = {};
  monthlySubscriptions.forEach(item => {
    const month = item.month;
    if (!subscriptionPivot[month]) {
      subscriptionPivot[month] = { free: 0, premium: 0, pro: 0 };
    }
    if (item.subscriptionType.toLowerCase() === "free") {
      subscriptionPivot[month].free = Number(item.count);
    }
    if (item.subscriptionType.toLowerCase() === "premium") {
      subscriptionPivot[month].premium = Number(item.count);
    }
    if (item.subscriptionType.toLowerCase() === "pro") {
      subscriptionPivot[month].pro = Number(item.count);
    }
  });
  const subscriptionLabels = Object.keys(subscriptionPivot).sort();
  const freeSubData = subscriptionLabels.map(month => subscriptionPivot[month].free);
  const premiumSubData = subscriptionLabels.map(month => subscriptionPivot[month].premium);
  const proSubData = subscriptionLabels.map(month => subscriptionPivot[month].pro);

  const salesLabels = registrationLabels.length > 0 ? registrationLabels : ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"];
  const monthlySales = orders.reduce((acc: { [key: string]: number }, order) => {
    const [year, month] = order.date.split('-');
    const key = `${year}-${month}`;
    acc[key] = (acc[key] || 0) + order.amount;
    return acc;
  }, {});
  const salesData = salesLabels.map(label => monthlySales[label] || 0);

  const doughnutData = {
    labels: subscriptionData.map((sub) => sub.type),
    datasets: [
      {
        label: "Suscripciones",
        data: subscriptionData.map((sub) => sub.count),
        backgroundColor: ["#34D399", "#60A5FA", "#FBBF24"],
        borderColor: ["#059669", "#3B82F6", "#F59E0B"],
        borderWidth: 1,
      },
    ],
  };

  const registrationBarData = {
    labels: registrationLabels,
    datasets: [
      {
        label: "Usuarios Registrados",
        data: registrationCounts,
        backgroundColor: "#34D399",
        borderColor: "#059669",
        borderWidth: 1,
      },
    ],
  };

  const subscriptionLineData = {
    labels: subscriptionLabels,
    datasets: [
      {
        label: "Suscripción Gratis",
        data: freeSubData,
        fill: false,
        borderColor: "#34D399",
        backgroundColor: "#34D399",
        tension: 0.3,
      },
      {
        label: "Suscripción Premium",
        data: premiumSubData,
        fill: false,
        borderColor: "#60A5FA",
        backgroundColor: "#60A5FA",
        tension: 0.3,
      },
      {
        label: "Suscripción Pro",
        data: proSubData,
        fill: false,
        borderColor: "#FBBF24",
        backgroundColor: "#FBBF24",
        tension: 0.3,
      },
    ],
  };

  const lineSalesData = {
    labels: salesLabels,
    datasets: [
      {
        label: "Ganancias Mensuales ($)",
        data: salesData,
        fill: false,
        borderColor: "#3B82F6",
        backgroundColor: "#3B82F6",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
  };

  const systemStatus = {
    uptime: "99.9%",
    dbStatus: "Conectado",
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#fffbf7] to-[#fffbf7]">
      <h1 className="text-3xl font-light mb-8 text-center text-gray-800 tracking-wide">
        Panel de Administración
      </h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        <div 
          className="bg-gray-50 opacity-90 p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl cursor-pointer"
          onClick={handleShowUsers}
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800 tracking-wide">
            Usuarios Registrados Totales
          </h2>
          <p className="text-4xl font-normal text-gray-900">{usersCount}</p>
        </div>
        <div className="bg-gray-50 opacity-90 p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 tracking-wide">
            Tipos de Suscripciones Totales
          </h2>
          <ul>
            {subscriptionData.map((sub, index) => (
              <li key={index} className="flex justify-between border-b border-gray-200 py-2 last:border-0">
                <span className="text-gray-700">{sub.type}</span>
                <span className="font-semibold text-gray-900">{sub.count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-50 opacity-90 p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 tracking-wide">
            Métricas de Ganancias
          </h2>
          <p className="text-lg text-gray-700">
            Ganancias Totales: <span className="font-bold text-gray-900">${totalSales}</span>
          </p>
          <p className="text-lg text-gray-700 mt-2">
            Ganancias Mensuales: <span className="font-bold text-gray-900">${salesData.reduce((sum, amount) => sum + amount, 0)}</span>
          </p>
        </div>
        <div className="bg-gray-50 opacity-90 p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 tracking-wide">
              Estado del Sistema
            </h2>
            <p className="text-lg text-gray-700">
              Uptime: <span className="font-bold text-gray-900">{systemStatus.uptime}</span>
            </p>
            <div className="flex flex-row gap-4 items-center">
              <p className="text-lg text-gray-700 mt-2 w-fit">
                Estado de la BD: <span className="font-bold text-gray-900 w-fit">{systemStatus.dbStatus}</span>
              </p>
              <p className="flex mt-3 -ml-2">
                <GrStatusGood/>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección para gráficos y tabla de órdenes */}
      <div className="mt-12">
        <h2 className="text-2xl font-light text-gray-800 text-center mb-6 tracking-wide">
          Visualización de Datos
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-gray-50 opacity-90 p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-800 tracking-wide mb-4">
              Registros Mensuales
            </h3>
            <div className="h-64">
              <Bar data={registrationBarData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-gray-50 opacity-90 p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-800 tracking-wide mb-4">
              Variación Mensual de Suscripciones
            </h3>
            <div className="h-64">
              <Line data={subscriptionLineData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-gray-50 opacity-90 p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-800 tracking-wide mb-4">
              Distribución de Suscripciones
            </h3>
            <div className="h-64">
              <Pie data={doughnutData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-gray-50 opacity-90 p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-800 tracking-wide mb-4">
              Ganancias Mensuales
            </h3>
            <div className="h-64">
              <Line data={lineSalesData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Botón toggle para mostrar/ocultar la tabla de órdenes */}
        <div className="flex justify-end mt-8">
          <button
            onClick={() => setShowOrdersTable(!showOrdersTable)}
            className={`px-6 py-3 rounded-full font-semibold text-gray-50 transition-all duration-300 shadow-lg
              ${showOrdersTable 
                ? "bg-gradient-to-r from-[#afcacf] to-[#899ec5] hover:from-[#7da6ad] hover:to-[#7899d6] transition duration-200"
                : "bg-gradient-to-r from-[#afcacf] to-[#899ec5] hover:from-[#7da6ad] hover:to-[#7899d6] transition duration-200"
              }`}
          >
            {showOrdersTable ? "Ocultar Detalle de Órdenes" : "Mostrar Detalle de Órdenes"}
          </button>
        </div>

        {/* Renderizado condicional del componente OrdersTable */}
        {showOrdersTable && (
          <div className="mt-8">
            <OrdersTable />
          </div>
        )}
      </div>

      {/* Modal de usuarios registrados */}
      {showUsersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Lista de Usuarios Registrados</h2>
              <div className="flex gap-2 items-center">
                {isViewingBanned ? (
                  <button 
                    onClick={handleShowAllUsers}
                    className="text-sm text-gray-500 hover:text-gray-700"
                    title="Volver a la lista completa"
                  >
                    Volver
                  </button>
                ) : (
                  <button 
                    onClick={handleShowBannedUsers}
                    className="text-sm text-gray-500 hover:text-gray-700"
                    title="Mostrar usuarios baneados"
                  >
                    Baneados
                  </button>
                )}
                <button
                  onClick={() => setShowUsersModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Suscripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de Registro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {detailedUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.subscriptionType}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(user.registeredAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {!isViewingBanned ? (
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleBanUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                              disabled={user.isBanned}
                            >
                              {user.isBanned ? 'Usuario Baneado' : 'Banear Usuario'}
                            </button>
                            <button
                              onClick={() => openUpdateModal(user)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Actualizar
                            </button>
                            {/* Botón para asignar rol de administrador */}
                            {!user.isAdmin && (
                              <button
                                onClick={() => handleMakeAdmin(user.id)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Asignar Admin
                              </button>
                            )}
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal para actualizar datos del usuario */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Actualizar Usuario</h2>
              <button onClick={() => setShowUpdateModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmitUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={updateForm.name}
                  onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-md mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={updateForm.email}
                  onChange={(e) => setUpdateForm({ ...updateForm, email: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-md mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Tipo de Suscripción</label>
                <select
                  value={updateForm.subscriptionType}
                  onChange={(e) => setUpdateForm({ ...updateForm, subscriptionType: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-md mt-1"
                >
                  <option value="Gratis">Gratis</option>
                  <option value="Premium">Premium</option>
                  <option value="Pro">Pro</option>
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Actualizar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
