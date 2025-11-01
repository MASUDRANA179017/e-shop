import React from "react";

const UserDashboard = () => {
  const stats = [
    { label: "Total Bookings", value: 12 },
    { label: "Completed", value: 9 },
    { label: "Pending", value: 3 },
    { label: "Reviews", value: 5 },
  ];

  const recentActivities = [
    { id: 1, text: "Booked a room at RelaksInn Hotel", time: "2 hours ago" },
    { id: 2, text: "Left a review on The Gym Center", time: "1 day ago" },
    { id: 3, text: "Updated profile picture", time: "3 days ago" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500 text-sm">{item.label}</p>
            <h3 className="text-2xl font-semibold text-gray-800 mt-2">{item.value}</h3>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
        <ul className="space-y-3">
          {recentActivities.map((act) => (
            <li key={act.id} className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-700">{act.text}</span>
              <span className="text-sm text-gray-500">{act.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserDashboard;
