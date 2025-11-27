// src/@Services/productService.js
import api from "../api/axiosInstance";

// Get all prescriptions
export const getAllPrescriptions = async () => {
  const res = await api.get("/prescriptions/all");
  return res.data;
};


// Get single Prescriptions by ID
export const getPrescriptionsById = async (id) => {
  const res = await api.get(`/prescriptions/${id}`);
  return res.data;
};

//Create new Prescriptions
export const createPrescription = async (data) => {
  const res = await api.post("/prescriptions/create", data);
  return res.data;
};

// Update Prescription by ID
export const updatePrescription = async (id, data) => {
  const res = await api.put(`/prescriptions/update/${id}`, data);
  return res.data;
};

// Delete Prescription by ID
export const deletePrescription = async (id) => {
  const res = await api.delete(`/prescriptions/delete/${id}`);
  return res.data;
};
