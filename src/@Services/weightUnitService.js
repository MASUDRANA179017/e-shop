// src/@Services/weightUnitService.js
import api from "../api/axiosInstance";

// Get all weight units
export const getAllWeightUnits = async () => {
  const res = await api.get("/weight-unit/all");
  return res.data;
};

// Get single weight unit by ID
export const getWeightUnitById = async (id) => {
  const res = await api.get(`/weight-unit/${id}`);
  return res.data;
};

// Create new weight unit
export const createWeightUnit = async (data) => {
  const res = await api.post("/weight-unit/create", data);
  return res.data;
};

// Update weight unit by ID
export const updateWeightUnit = async (id, data) => {
  const res = await api.put(`/weight-unit/update/${id}`, data);
  return res.data;
};

// Delete weight unit by ID
export const deleteWeightUnit = async (id) => {
  const res = await api.delete(`/weight-unit/delete/${id}`);
  return res.data;
};
