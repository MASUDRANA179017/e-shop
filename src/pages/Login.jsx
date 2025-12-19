import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../@Services/authService";
import { toast } from "react-toastify";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
 

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Auto redirect if already logged in & Load remembered email
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;

    if (token && user) {
      if (user.role === "admin") navigate("/dashboard/admin", { replace: true });
      else if (user.role === "vendor") navigate("/dashboard/vendor", { replace: true });
      else if (user.role === "user") navigate("/dashboard/user", { replace: true });
    }

    // Load remembered email
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setForm((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, [navigate]);

  // Handle Login Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Handle Remember Me
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", form.email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    try {
      const data = await loginUser(form);

      if (data) {
        toast.success("Login successful! Redirecting...", {
          position: "top-center",
          autoClose: 3000,
        });
      }
      // Redirect by user role or back to origin
      setTimeout(() => {
        if (location.state?.from) {
          navigate(location.state.from, { 
            replace: true,
            state: location.state.checkoutState || {} // Restore the original state
          });
        } else {
          if (data.user.role === "admin") navigate("/dashboard/admin");
          else if (data.user.role === "vendor") navigate("/dashboard/vendor");
          else navigate("/dashboard/user");
        }
      }, 3000);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Invalid credentials, please try again.",
        { position: "top-center", autoClose: 4000 }
      );
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-10 bg-white/90 text-gray-800 px-4 py-2 rounded-lg shadow hover:bg-white transition"
      >
        Home
      </button>

      <div className="relative z-10 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-96 border border-white/20">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 text-sm mt-1">Please login to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label className="block mb-1 text-gray-700 font-medium">Email</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-[#FF624C]">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full outline-none text-gray-700 bg-transparent"
              />
            </div>
          </div>

          <div className="mb-4 relative">
            <label className="block mb-1 text-gray-700 font-medium">Password</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-[#FF624C]">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full outline-none text-gray-700 bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-[#FF624C] focus:outline-none ml-2"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6 text-sm">
            <label className="flex items-center text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2 rounded text-primary focus:ring-primary"
              />
              Remember Me
            </label>
            <span 
              onClick={() => navigate("/forgot-password")}
              className="text-secondary hover:underline cursor-pointer"
            >
              Forgot Password?
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-orange-400 text-white font-semibold py-2.5 rounded-lg hover:from-orange-600 hover:to-primary transition shadow-md transform hover:scale-[1.02]"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center mt-6 text-sm text-gray-600">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-primary hover:underline cursor-pointer font-medium"
            >
              Register here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
