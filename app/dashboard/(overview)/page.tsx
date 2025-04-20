"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
  LineChart, Line,
  AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

// Color palette for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6384"];

// Types
interface LineItem {
  name: string;
  quantity: number;
}

interface Order {
  id: number;
  total: string;
  date_created: string;
  line_items: LineItem[];
}

interface ProductSales {
  name: string;
  quantity: number;
}

interface SalesPerDay {
  date: string;
  total: number;
}

const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [sales, setSales] = useState<number>(0);
  const [topProducts, setTopProducts] = useState<ProductSales[]>([]);
  const [salesData, setSalesData] = useState<SalesPerDay[]>([]);

  useEffect(() => {
    const fetchData = async () => {
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

        const ordersData = response.data;
        setOrders(ordersData);

        const totalSales = ordersData.reduce(
          (acc, order) => acc + parseFloat(order.total),
          0
        );
        setSales(totalSales);

        const productSales: Record<string, number> = {};
        const salesPerDay: Record<string, number> = {};

        ordersData.forEach(order => {
          const date = new Date(order.date_created).toLocaleDateString();
          salesPerDay[date] = (salesPerDay[date] || 0) + parseFloat(order.total);

          order.line_items.forEach(item => {
            productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
          });
        });

        const sortedProducts = Object.entries(productSales)
          .map(([name, quantity]) => ({ name, quantity }))
          .sort((a, b) => b.quantity - a.quantity);

        setTopProducts(sortedProducts.slice(0, 5));
        setSalesData(Object.entries(salesPerDay).map(([date, total]) => ({ date, total })));

      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-100 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Sales</h2>
          <p className="text-3xl font-bold">DA {sales.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Orders</h2>
          <p className="text-3xl font-bold">{orders.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">Top Selling Products</h2>
          <BarChart width={500} height={300} data={topProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#8884d8" />
          </BarChart>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Sales Over Time</h2>
          <LineChart width={500} height={300} data={salesData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#82ca9d" />
          </LineChart>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">Sales Distribution</h2>
          <PieChart width={400} height={400}>
            <Pie
              data={topProducts}
              dataKey="quantity"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {topProducts.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Sales Trends</h2>
          <AreaChart width={500} height={300} data={salesData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="total" stroke="#FF8042" fill="#FFBB28" />
          </AreaChart>
        </div>
      </div>

      <div className="grid grid-cols-1 mt-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">Product Performance</h2>
          <RadarChart outerRadius={90} width={500} height={400} data={topProducts}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis />
            <Radar
              name="Products"
              dataKey="quantity"
              stroke="#0088FE"
              fill="#0088FE"
              fillOpacity={0.6}
            />
            <Tooltip />
          </RadarChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
