// src/@Services/ReviewService.js
import api from "../api/axiosInstance";

// Create a new review
export const createReview = async (data) => {
  const res = await api.post("/review/create", data);
  return res.data;
};

// Get reviews by product ID
export const getReviewsByProductId = async (id) => {
  const res = await api.get(`/review/get-by-product/${id}`);
  return res.data;
};

// Update an existing review
export const updateReview = async (id, data) => {
  const res = await api.put(`/review/update/${id}`, data);
  return res.data;
};

// Delete a review
export const deleteReview = async (id) => {
  const res = await api.delete(`/review/delete/${id}`);
  return res.data;
};
