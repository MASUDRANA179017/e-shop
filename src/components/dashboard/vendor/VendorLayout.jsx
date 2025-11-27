import React from "react";
import { BiHome, BiLogOut, BiUser } from "react-icons/bi";
import { FaStore, FaShoppingCart, FaFileInvoice } from "react-icons/fa";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const VendorLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const navItems = [
    { to: "/dashboard/vendor", label: "Home", icon: <BiHome size={18} /> },
    { to: "/dashboard/vendor/my-store", label: "My Store", icon: <FaStore size={18} /> },
    { to: "/dashboard/vendor/my-products", label: "My Products", icon: <FaShoppingCart size={18} /> },
    { to: "/dashboard/vendor/prescriptions", label: "Prescription", icon: <FaFileInvoice size={18} /> },
    { to: "/dashboard/vendor/profile", label: "Profile", icon: <BiUser size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg fixed h-full flex flex-col">
        <div className="p-5 text-center font-bold text-2xl border-b border-gray-200 text-green-600">
          {user.firstName + " " + user.lastName}
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md transition ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "text-gray-700 hover:bg-green-50"
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
          <BiLogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="flex-1 ml-64">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-700">{user.role} Dashboard</h1>
          <div className="text-gray-600 text-sm">
            Welcome, <span className="font-medium">{user.firstName}</span>
          </div>
        </header>

        <section className="p-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default VendorLayout;
