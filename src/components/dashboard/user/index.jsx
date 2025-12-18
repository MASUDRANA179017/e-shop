import React, { useEffect, useState } from "react";
import { getProfile } from "../../../@Services/authService";
import { Link } from "react-router-dom";
import { FaWallet, FaStore, FaStar, FaUserCheck } from "react-icons/fa";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getProfile();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    { label: "Wallet Points", value: user?.walletPoints || 0, icon: <FaWallet className="text-purple-500" /> },
    { label: "Following", value: user?.followedStores?.length || 0, icon: <FaUserCheck className="text-blue-500" /> },
    { label: "Total Bookings", value: 12, icon: <FaStore className="text-green-500" /> }, // Mock
    { label: "Reviews", value: 5, icon: <FaStar className="text-yellow-500" /> }, // Mock
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-1">Dashboard Overview</h2>
        <p className="opacity-90">Welcome back, {user?.firstName}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-gray-500 text-sm font-medium">{item.label}</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">{item.value}</h3>
            </div>
            <div className="p-3 bg-gray-50 rounded-full text-xl">
                {item.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Followed Stores */}
        <div className="lg:col-span-2 bg-white shadow-sm rounded-xl border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Following Stores</h3>
                <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
                    {user?.followedStores?.length || 0}
                </span>
            </div>
            
            {user?.followedStores?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.followedStores.map((store) => (
                        <div key={store.id} className="flex items-center p-4 border border-gray-100 rounded-lg hover:border-blue-200 transition-colors">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                                {store.logoUrl ? <img src={store.logoUrl} alt={store.name} className="w-full h-full rounded-full object-cover"/> : store.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-800 truncate">{store.name}</h4>
                                <p className="text-xs text-gray-500 truncate">{store.city || "Location N/A"}</p>
                            </div>
                            <Link to={`/vendor/${store.id}`} className="ml-2 text-sm text-blue-600 font-bold hover:underline">
                                Visit
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-2">You are not following any stores yet.</p>
                    <Link to="/service" className="text-blue-600 font-bold text-sm hover:underline">Browse Services</Link>
                </div>
            )}
        </div>

        {/* Recent Activities (Mock) */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activities</h3>
            <ul className="space-y-4">
                {[
                    { text: "Earned 5 points for review", time: "2 hours ago", icon: <FaWallet className="text-purple-500"/> },
                    { text: "Followed 'Tech Fixers'", time: "1 day ago", icon: <FaUserCheck className="text-blue-500"/> },
                    { text: "Updated profile details", time: "3 days ago", icon: <FaUserCheck className="text-gray-500"/> },
                ].map((act, idx) => (
                    <li key={idx} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="mt-1 mr-3 text-sm">{act.icon}</div>
                        <div>
                            <p className="text-gray-800 text-sm font-medium">{act.text}</p>
                            <span className="text-xs text-gray-400">{act.time}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;