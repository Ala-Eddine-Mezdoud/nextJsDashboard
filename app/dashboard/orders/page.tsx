"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Order {
  id: number;
  status: string;
  total: string;
  currency: string;
  date_created: string;
  billing: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    postcode: string;
    phone: string;
  };
  shipping: {
    address_1: string;
  };
  shipping_lines: {
    method_title: string;
  }[];
  line_items: {
    id: number;
    name: string;
    quantity: number;
    total_tax: string;
    total: string;
  }[];
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get<Order[]>(
          "https://baba4shop.com/wp-json/wc/v3/orders",
          {
            auth: {
              username: "ck_41c261b6e95a655655d5e08f50590b796504984d",
              password: "cs_833b93d92b10c6d72b5d2e0fa882c7deff8edf7f",
            },
          }
        );
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders. Please try again.");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      order.billing.first_name.toLowerCase().includes(search.toLowerCase()) &&
      (filter ? order.status.toLowerCase() === filter.toLowerCase() : true)
  );

  return (
    <div className="w-full p-6 relative">
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>
      <div className="flex items-center justify-between mb-4">
        <select
          onChange={(e) => setFilter(e.target.value)}
          className="border px-4 py-2 rounded-md"
        >
          <option value="">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          type="text"
          placeholder="Search by Customer Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-md w-1/3"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <p className="text-center text-red-400">{error}</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center text-gray-400">No orders found.</p>
      ) : (
        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-900 text-gray-50">
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-gray-300">
                <td className="p-3">#{order.id}</td>
                <td className="p-3">
                  {order.billing.first_name} {order.billing.last_name}
                </td>
                <td className="p-3 capitalize">{order.status}</td>
                <td className="p-3">
                  {order.total} {order.currency}
                </td>
                <td className="p-3">
                  {new Date(order.date_created).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-xl w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Order #{selectedOrder.id}
            </h2>

            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Billing Details
              </h3>
              <p className="text-gray-600">
                {selectedOrder.billing.first_name}{" "}
                {selectedOrder.billing.last_name}
              </p>
              <p className="text-gray-600">
                {selectedOrder.billing.address_1}
              </p>
              <p className="text-gray-600">
                {selectedOrder.billing.city} - {selectedOrder.billing.postcode}
              </p>
              <p className="text-gray-600 font-medium">
                Phone: {selectedOrder.billing.phone}
              </p>
            </div>

            <div className="border-b py-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Shipping Details
              </h3>
              <p className="text-gray-600">
                {selectedOrder.shipping.address_1 || "N/A"}
              </p>
              <p className="text-gray-600 font-medium">
                Phone: {selectedOrder.billing.phone}
              </p>
            </div>

            <div className="border-b py-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Shipping Method
              </h3>
              <p className="text-gray-600">
                {selectedOrder.shipping_lines[0]?.method_title || "N/A"}
              </p>
            </div>

            <div className="py-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Products
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 text-left">
                      <th className="p-3 font-medium">Product</th>
                      <th className="p-3 font-medium">Qty</th>
                      <th className="p-3 font-medium">Tax</th>
                      <th className="p-3 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.line_items.map((item) => (
                      <tr key={item.id} className="border-t text-gray-600">
                        <td className="p-3">{item.name}</td>
                        <td className="p-3">{item.quantity}</td>
                        <td className="p-3">
                          {item.total_tax} {selectedOrder.currency}
                        </td>
                        <td className="p-3 font-semibold">
                          {item.total} {selectedOrder.currency}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-red-600 hover:bg-red-700 transition-all text-white px-5 py-2 rounded-lg shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
