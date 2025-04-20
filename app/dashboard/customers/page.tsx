"use client";

import React, { useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "user";
  products: string[];
};

const dummyUsers: User[] = [
  {
    id: 1,
    name: "Ala Ahmed",
    email: "ala@example.com",
    phone: "+213123456789",
    role: "admin",
    products: ["Product A", "Product B"],
  },
  {
    id: 2,
    name: "Sara Benali",
    email: "sara@example.com",
    phone: "+213987654321",
    role: "user",
    products: ["Product C"],
  },
  {
    id: 3,
    name: "Omar Zidane",
    email: "omar@example.com",
    phone: "+213112233445",
    role: "user",
    products: ["Product D", "Product E"],
  },
];

const Page = () => {
  const [users, setUsers] = useState<User[]>(dummyUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter ? user.role === roleFilter : true;

    return matchesSearch && matchesRole;
  });

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          className="border p-2 rounded-md w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded-md"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          onClick={() => alert("Add user modal")}
        >
          + Add User
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white border rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Phone</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Assigned Products</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.phone}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3">
                    {user.products.length > 0
                      ? user.products.join(", ")
                      : "No products"}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded-md"
                      onClick={() => alert(`Edit user ${user.name}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded-md"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
