import React, { useEffect, useState } from "react";
import { BiBarChart } from "react-icons/bi";
import { FaDollarSign, FaShoppingCart, FaUserSecret } from "react-icons/fa";
import { getDashboardStats } from "../../../@Services/DashboardService";

const AdminDashboard = () => {
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    totalVendors: 0,
    revenue: 0,
    activeOrders: 0
  });

  useEffect(() => {
    getDashboardStats()
      .then(data => setStatsData(data))
      .catch(err => console.error("Failed to fetch dashboard stats", err));
  }, []);

  const stats = [
    { label: "Total Users", value: statsData.totalUsers, icon: <FaUserSecret />, color: "bg-blue-500" },
    { label: "Total Vendors", value: statsData.totalVendors, icon: <FaShoppingCart />, color: "bg-green-500" },
    { label: "Revenue", value: `$${statsData.revenue.toLocaleString()}`, icon: <FaDollarSign />, color: "bg-yellow-500" },
    { label: "Active Orders", value: statsData.activeOrders, icon: <BiBarChart />, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-5 flex items-center justify-between"
          >
            <div>
              <p className="text-gray-500 text-sm">{item.label}</p>
              <h3 className="text-2xl font-semibold text-gray-800">{item.value}</h3>
            </div>
            <div className={`p-3 rounded-lg text-white ${item.color}`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Users Table */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Recent Users</h3>
          <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                        U{i}
                      </div>
                      <span className="font-medium text-gray-800 text-sm">User {i + 1}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Customer</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Active</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-01-2{i}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
