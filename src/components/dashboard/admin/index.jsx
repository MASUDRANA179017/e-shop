import React from "react";
import { BiBarChart } from "react-icons/bi";
import { FaDollarSign, FaShoppingCart, FaUserSecret } from "react-icons/fa";


const AdminDashboard = () => {
  const stats = [
    { label: "Total Users", value: "1,240", icon: <FaUserSecret />, color: "bg-blue-500" },
    { label: "Total Vendors", value: "320", icon: <FaShoppingCart />, color: "bg-green-500" },
    { label: "Revenue", value: "$12,400", icon: <FaDollarSign />, color: "bg-yellow-500" },
    { label: "Active Orders", value: "89", icon: <BiBarChart />, color: "bg-purple-500" },
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

      {/* Dummy chart area */}
      <div className="bg-white shadow rounded-xl p-6 h-64 flex flex-col justify-center items-center">
        <p className="text-gray-600 mb-2">📊 Analytics Overview</p>
        <p className="text-gray-400 text-sm">
          (Chart or stats visualization can go here)
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
