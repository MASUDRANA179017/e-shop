import React from "react";

const UserDashboard = () => {
  const user = {
    name: "Masud Rana",
    email: "rana@example.com",
    role: "User",
    joined: "Jan 2024",
  };

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
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          User Dashboard
        </h1>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img
              src="/user-avatar.png"
              alt="User Avatar"
              className="w-20 h-20 rounded-full border-2 border-blue-500"
            />
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <span className="text-sm text-gray-500">
                Joined: {user.joined}
              </span>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
            Edit Profile
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {stats.map((item, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-gray-600 text-sm">{item.label}</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
          <ul className="space-y-3">
            {recentActivities.map((activity) => (
              <li
                key={activity.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="text-gray-700">{activity.text}</span>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
