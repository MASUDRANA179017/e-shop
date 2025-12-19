import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock API call simulation
    setTimeout(() => {
      setLoading(false);
      // In a real app, you would call an API here to trigger the reset email.
      // Since the backend endpoint doesn't exist yet, we simulate success.
      toast.success("Password reset link has been sent to your email!", {
        position: "top-center",
        autoClose: 5000,
      });
      
      // Optional: Redirect back to login after a delay
      // setTimeout(() => navigate("/login"), 5000);
    }, 1500);
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

      <div className="relative z-10 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-96 border border-white/20">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter your email to receive a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 relative">
            <label className="block mb-1 text-gray-700 font-medium">Email</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-[#FF624C]">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full outline-none text-gray-700 bg-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF624C] text-white font-semibold py-2.5 rounded-lg hover:bg-[#e0523e] transition shadow-md transform hover:scale-[1.02]"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <p className="text-center mt-6 text-sm text-gray-600">
            Remember your password?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-[#FF624C] hover:underline cursor-pointer font-medium"
            >
              Back to Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
