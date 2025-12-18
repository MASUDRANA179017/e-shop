// src/@Services/productService.js
import api from "../api/axiosInstance";

// Get all Stores (Public)
export const getAllPublicStores = async () => {
  const res = await api.get("/store/public/all");
  return res.data;
};

// Get single Store by ID (Public)
export const getPublicStoreById = async (id) => {
  const res = await api.get(`/store/public/${id}`);
  return res.data;
};

// Get all Stores (Protected)
export const getAllStores = async () => {
  const res = await api.get("/store/getAll");
  return res.data;
};

// Get single Store by ID
export const getStoreById = async (id) => {
  const res = await api.get(`/store/getSingleStore/${id}`);
  return res.data;
};

//Create new Store
export const createStore = async (data) => {
  const res = await api.post("/store/create", data);
  return res.data;
};

// Toggle owner active status
export const toggleOwnerStatus = async (ownerId, isActive) => {
  const res = await api.put(`/store/owner-status/${ownerId}`, { isActive });
  return res.data; 
};

// Update Store by ID
export const updateStore = async (id, data) => {
  const res = await api.put(`/store/updateStore/${id}`, data);
  return res.data;
};

// Delete store by ID
export const deleteStore = async (id) => {
  const res = await api.delete(`/store/deleteStore/${id}`);
  return res.data;
};

