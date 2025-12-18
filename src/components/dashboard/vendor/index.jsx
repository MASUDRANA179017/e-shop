import React from "react";
import { BiBarChart } from "react-icons/bi";
import { FaBoxOpen, FaClipboardList, FaStore } from "react-icons/fa";

const VendorDashboard = () => {
  // Placeholder stats - in future, fetch from API
  const stats = [
    { label: "My Products", value: 15, icon: <FaBoxOpen />, color: "bg-blue-500" },
    { label: "Active Services", value: 3, icon: <FaStore />, color: "bg-green-500" },
    { label: "Total Orders", value: 42, icon: <FaClipboardList />, color: "bg-purple-500" },
    { label: "Revenue", value: "$1,250", icon: <BiBarChart />, color: "bg-yellow-500" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Vendor Dashboard</h2>

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

      <div className="bg-white shadow rounded-xl p-6 h-64 flex flex-col justify-center items-center">
        <p className="text-gray-600 mb-2">📈 Sales Analytics</p>
        <p className="text-gray-400 text-sm">
          (Chart visualization coming soon)
        </p>
      </div>
    </div>
  );
};

export default VendorDashboard;
