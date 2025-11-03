// src/@Services/authService.js
import api from "../api/axiosInstance";

// Register a new user
export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

// Login a user
export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);

  // Save token and user in localStorage
  const responseData = res.data;
  if (responseData.token) localStorage.setItem("token", responseData.token);
  if (responseData.user) localStorage.setItem("user", JSON.stringify(responseData.user));

  return responseData;
};

// Refresh access token
export const refreshToken = async () => {
  const res = await api.post("/auth/refresh");
  const data = res.data;
  if (data.token) localStorage.setItem("token", data.token);
  return data;
};

// Edit user profile
export const editProfile = async (data) => {
  const res = await api.post("/auth/edit-profile", data);
  return res.data;
};

// Get user profile
export const getProfile = async () => {
  const res = await api.get("/auth/profile");
  return res.data;
};

// Get all users
export const getAllUsers = async () => {
  const res = await api.get("/auth/all-users");
  return res.data;
};

// Activate / deactivate user by admin
export const toggleUserStatus = async (id, status) => {
  const res = await api.put(`/auth/activate/${id}`, { status });
  return res.data;
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return !!token && !!user;
};

// Get logged-in user data
export const getUserData = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

