import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginUser } from "../@Services/authService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  // Auto-redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;

    if (token && user) {
      if (user.role === "admin") {
        navigate("/dashboard/admin", { replace: true });
      } else if (user.role === "user") {
        navigate("/dashboard/user", { replace: true });
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      // Parse response
      const data = await response.json();
      // console.log("Login response:", data);

      // Save token and user to localStorage
      localStorage.setItem("token", data.access_Token);
      localStorage.setItem("r-token", data.refresh_Token);
      localStorage.setItem("user", JSON.stringify(data.user));

      axios.defaults.headers.common["Authorization"] = `Bearer ${data.refresh_Token}`;

      // Optional: if you use a central axios instance, set it there too
      // import api from "../api"; → api.defaults.headers.common["Authorization"] = `Bearer ${data.refresh_Token}`;

      await loginUser(form.email, form.password);

      toast.success("Login successful! Redirecting...", {
        position: "top-center",
        autoClose: 2000,
      });

      // Redirect by user role
      setTimeout(() => {
        if (data.user.role === "admin") {
          navigate("/dashboard/admin");
        } else {
          navigate("/dashboard/user");
        }
      }, 2000);
    } catch (err) {
      toast.error("Invalid credentials, please try again.", {
        position: "top-center",
        autoClose: 2500,
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Toast container */}
      <ToastContainer />

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-4 text-sm text-gray-600">
          You don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-red-500 hover:underline cursor-pointer"
          >
            Register here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
