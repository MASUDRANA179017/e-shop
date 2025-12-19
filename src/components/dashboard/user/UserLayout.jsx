import React, { useState } from "react";
import { BiHome, BiLogOut, BiUser, BiMenu, BiX, BiMoneyWithdraw } from "react-icons/bi";
import { CiSettings } from "react-icons/ci";
import { FaWallet, FaClipboardList, FaBoxOpen } from "react-icons/fa";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaShop } from "react-icons/fa6";

const UserLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const navItems = [
    { to: "/dashboard/user", label: "Home", icon: <BiHome size={20} /> },
    { to: "/dashboard/user/bookings", label: "My Bookings", icon: <FaClipboardList size={20} /> },
    { to: "/dashboard/user/orders", label: "My Orders", icon: <FaBoxOpen size={20} /> },
    { to: "/dashboard/user/wallet", label: "Wallet", icon: <FaWallet size={20} /> },
    { to: "/dashboard/user/withdrawals", label: "Withdrawal Requests", icon: <BiMoneyWithdraw size={20} /> },
    { to: "/dashboard/user/profile", label: "Profile", icon: <BiUser size={20} /> },
    { to: "/dashboard/user/shop-create", label: "Sell Account Create", icon: <FaShop size={20} /> },
    { to: "/dashboard/user/settings", label: "Settings", icon: <CiSettings size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`bg-white shadow-lg fixed h-full flex flex-col z-30 transition-transform duration-300 w-64
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-5 flex justify-between items-center border-b border-gray-200">
            <span className="font-bold text-2xl text-blue-600">User Dashboard</span>
            <button 
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-gray-500 hover:text-red-500"
            >
                <BiX size={24} />
            </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-md transition font-medium ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-100">
            <button
            onClick={handleLogout}
            className="w-full bg-red-50 text-red-500 py-2 rounded-md hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-2 font-medium"
            >
            <BiLogOut size={20} />
            Logout
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 lg:ml-64 transition-all duration-300">
        {/* Top Header */}
        <header className="bg-white shadow-sm px-4 py-3 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
             <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-blue-600 p-1 rounded-md hover:bg-gray-100"
             >
                <BiMenu size={28} />
             </button>
             <h1 className="text-lg md:text-xl font-bold text-gray-800 hidden sm:block">Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                 <p className="text-sm font-bold text-gray-800">{user.firstName} {user.lastName}</p>
                 <p className="text-xs text-gray-500 capitalize">{user.role}</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm overflow-hidden">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.firstName} className="w-full h-full object-cover" />
                ) : (
                  user.firstName?.charAt(0) || "U"
                )}
             </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
