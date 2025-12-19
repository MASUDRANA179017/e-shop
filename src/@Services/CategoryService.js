// src/@Services/CategoryService.js
import api from "../api/axiosInstance";

// Get all Categories
export const getAllCategory = async () => {
  const res = await api.get("/category/all", { skipRedirect: true });
  return res.data;
};

// Get Categories by Type
export const getCategoriesByType = async (type) => {
  const res = await api.get(`/category/type/${type}`);
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

// --- Vendor Specific Methods ---

// Get Vendor Categories
export const getVendorCategories = async () => {
  const res = await api.get("/category/vendor/my-categories");
  return res.data;
};

// Get Categories by Store ID (Public)
export const getStoreCategories = async (storeId) => {
  const res = await api.get(`/category/store/${storeId}`);
  return res.data;
};

// Create Vendor Category
export const createVendorCategory = async (data) => {
  const res = await api.post("/category/vendor/create", data);
  return res.data;
};

// Update Vendor Category
export const updateVendorCategory = async (id, data) => {
  const res = await api.put(`/category/vendor/update/${id}`, data);
  return res.data;
};

// Delete Vendor Category
export const deleteVendorCategory = async (id) => {
  const res = await api.delete(`/category/vendor/delete/${id}`);
  return res.data;
};
