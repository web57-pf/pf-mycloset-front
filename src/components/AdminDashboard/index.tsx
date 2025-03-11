'use client'
import React, { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
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

interface DetailedUser {
  id: string;
  name: string;
  email: string;
  subscriptionType: string;
  registeredAt: string;
  isBanned?: boolean;
}

export const AdminDashboard = () => {
  const [usersCount, setUsersCount] = useState<number>(0);
  const [proUsers, setProUsers] = useState<DetailedUser[]>([]);
  const [premiumUsers, setPremiumUsers] = useState<DetailedUser[]>([]);
  const [freeUsers, setFreeUsers] = useState<DetailedUser[]>([]);
  const [totalSales, setTotalSales] = useState<number>(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [monthlyRegistrations, setMonthlyRegistrations] = useState<RegistrationMetric[]>([]);
  const [monthlySubscriptions, setMonthlySubscriptions] = useState<SubscriptionMetric[]>([]);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [detailedUsers, setDetailedUsers] = useState<DetailedUser[]>([]);

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
      setShowUsersModal(true);
    } catch (error) {
      console.error('Error fetching users:', error);
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
        
        // Refresh users list
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
          credentials: 'include'
        });
        const data = await response.json();
        setDetailedUsers(data);

        Swal.fire(
          '¡Usuario baneado!',
          'El usuario ha sido baneado exitosamente.',
          'success'
        );
      } catch {
        Swal.fire(
          'Error',
          'No se pudo banear al usuario.',
          'error'
        );
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
    <div className="p-6 min-h-screen bg-gradient-to-br to-[#fffbf7] from-[#fffbf7]">
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
          <h2 className="text-xl font-semibold mb-4 text-gray-800 tracking-wide">
            Estado del Sistema
          </h2>
          <p className="text-lg text-gray-700">
            Uptime: <span className="font-bold text-gray-900">{systemStatus.uptime}</span>
          </p>
          <p className="text-lg text-gray-700 mt-2">
            Estado de la BD: <span className="font-bold text-gray-900">{systemStatus.dbStatus}</span>
          </p>
        </div>
      </div>

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
      </div>

      {showUsersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Lista de Usuarios Registrados</h2>
              <button
                onClick={() => setShowUsersModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.subscriptionType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(user.registeredAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleBanUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={user.isBanned}
                        >
                          {user.isBanned ? 'Usuario Baneado' : 'Banear Usuario'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;