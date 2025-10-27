import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, Users, Settings } from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/admin/users", label: "Users", icon: <Users size={18} /> },
    { to: "/admin/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg fixed h-full flex flex-col">
        <div className="p-5 text-center font-bold text-2xl border-b border-gray-200 text-blue-600">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-blue-50"
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="m-4 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-700">
            Admin Dashboard
          </h1>
          <div className="text-gray-600 text-sm">
            Welcome, <span className="font-medium">Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <section className="p-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
