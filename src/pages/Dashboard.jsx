import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../@Services/authService";

const Dashboard = () => {
  const navigate = useNavigate();



  const handleLogout = () => {
    logoutUser(); 
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Welcome to Dashboard 🎉
      </h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
