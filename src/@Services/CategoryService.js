// src/@Services/CategoryService.js
import api from "../api/axiosInstance";

// Get all Categories
export const getAllCategory = async () => {
  const res = await api.get("/category/all");
  return res.data;
};

// Get single Category by ID
export const getCategoryById = async (id) => {
  const res = await api.get(`/category/${id}`);
  return res.data;
};

// Create new Category
export const createCategory = async (data) => {
  const res = await api.post("/category/create", data);
  return res.data;
};

// Update Category by ID
export const updateCategory = async (id, data) => {
  const res = await api.put(`/category/update/${id}`, data);
  return res.data;
};

// Delete Category by ID
export const deleteCategory = async (id) => {
  const res = await api.delete(`/category/delete/${id}`);
  return res.data;
};
