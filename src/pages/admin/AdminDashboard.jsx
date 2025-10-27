// src/pages/admin/AdminDashboard.jsx
import React from "react";

const AdminDashboard = () => {
  // Dummy data
  const stats = [
    { id: 1, title: "Total Users", value: 1520, color: "bg-blue-500" },
    { id: 2, title: "Total Vendors", value: 230, color: "bg-green-500" },
    { id: 3, title: "Total Products", value: 4890, color: "bg-purple-500" },
    { id: 4, title: "Total Orders", value: 3210, color: "bg-yellow-500" },
  ];

  const recentOrders = [
    { id: 1, customer: "Rima Akter", vendor: "FreshMart", amount: "$120", status: "Completed" },
    { id: 2, customer: "Masum Khan", vendor: "TechZone", amount: "$850", status: "Pending" },
    { id: 3, customer: "Sumaiya Rahman", vendor: "StyleHub", amount: "$240", status: "Shipped" },
    { id: 4, customer: "Champa Akter", vendor: "BeautyPro", amount: "$99", status: "Cancelled" },
  ];

  const topVendors = [
    { id: 1, name: "FreshMart", sales: "$12,000", rating: "4.9★" },
    { id: 2, name: "TechZone", sales: "$9,500", rating: "4.7★" },
    { id: 3, name: "StyleHub", sales: "$8,200", rating: "4.6★" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <p className="font-semibold text-gray-700">Welcome, Admin</p>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
            Logout
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item) => (
          <div
            key={item.id}
            className={`p-6 rounded-xl shadow-md text-white ${item.color}`}
          >
            <h3 className="text-lg font-medium mb-2">{item.title}</h3>
            <p className="text-3xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 text-gray-600">Customer</th>
                  <th className="p-3 text-gray-600">Vendor</th>
                  <th className="p-3 text-gray-600">Amount</th>
                  <th className="p-3 text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{order.customer}</td>
                    <td className="p-3">{order.vendor}</td>
                    <td className="p-3">{order.amount}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-600"
                            : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : order.status === "Cancelled"
                            ? "bg-red-100 text-red-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Vendors */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Top Vendors</h2>
          <ul>
            {topVendors.map((vendor) => (
              <li
                key={vendor.id}
                className="flex justify-between items-center border-b py-3"
              >
                <div>
                  <p className="font-medium text-gray-700">{vendor.name}</p>
                  <p className="text-sm text-gray-500">Sales: {vendor.sales}</p>
                </div>
                <span className="text-yellow-500 font-semibold">{vendor.rating}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
