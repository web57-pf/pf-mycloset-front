'use client'
import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

enum status {
  PAID = "paid",
  PENDING = "pending",
  NOT_PAID = "not_paid",
  DELETED = "deleted",
}

interface OrderDetail {
  id: string;
  startedAt: string;
  endsAt: string;
  price: number;
}

interface Order {
  id: string;
  date: string;
  status: status; // status: string;
  subsType: string;
  details: OrderDetail[];
}

const OrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order`, {
        credentials: "include",
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la orden de la base de datos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${orderId}`, {
          method: "DELETE",
          credentials: "include",
        });
        Swal.fire("Eliminada!", "La orden ha sido eliminada.", "success");
        fetchOrders(); // refrescar la lista
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar la orden.", 
          axios.isAxiosError(error) && error.response?.status === 400 ? 'error' : 'warning'
        );
      }
    }
  };

  const exportToExcel = () => {
    const dataForExcel = orders.map((order) => {
      const detailsString = order.details
        .map(
          (detail) =>
            `ID: ${detail.id}, Precio: ${detail.price}, Inicio: ${new Date(detail.startedAt).toLocaleDateString()}, Fin: ${new Date(
              detail.endsAt
            ).toLocaleDateString()}`
        )
        .join(" | ");
      return {
        "Order ID": order.id,
        "Fecha": new Date(order.date).toLocaleDateString(),
        "Tipo de Suscripción": order.subsType,
        "Estado": order.status,
        "Detalles": detailsString,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Órdenes");
    XLSX.writeFile(workbook, "ordenes.xlsx");
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Detalles de Órdenes
        </h2>
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Descargar Excel
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-4 py-2 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase">
                Fecha
              </th>
              {/* <th className="px-4 py-2 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase">
                Usuario
              </th>
              <th className="px-4 py-2 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th> */}
              <th className="px-4 py-2 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase">
                Tipo de Suscripción
              </th>
              <th className="px-4 py-2 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase">
                Estado
              </th>
              <th className="px-4 py-2 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase">
                Detalles
              </th>
              <th className="px-4 py-2 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-2 whitespace-nowrap">{order.id}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {order.subsType}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {order.status}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {order.details.map((detail) => (
                    <div key={detail.id}>
                      <span className="block text-sm text-gray-600">
                        Precio: ${detail.price}
                      </span>
                      <span className="block text-xs text-gray-500">
                        Inicio: {new Date(detail.startedAt).toLocaleDateString()}
                      </span>
                      <span className="block text-xs text-gray-500">
                        Fin: {new Date(detail.endsAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {order.status !== status.DELETED ? (
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                      Eliminar
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md cursor-not-allowed"
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-2 text-center text-gray-500">
                  No hay órdenes registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;