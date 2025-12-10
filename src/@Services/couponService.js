// src/@Services/couponService.js
import api from "../api/axiosInstance";

// Get all coupons
export const getAllCoupons = async () => {
  const res = await api.get("/coupon/all-coupon");
  return res.data;
};

// Create new coupon
export const createCoupon = async (data) => {
  const res = await api.post("/coupon/create", data);
  return res.data;
};

// Get single coupon by ID
export const getCouponById = async (id) => {
  const res = await api.get(`/coupon/getById/${id}`);
  return res.data;
};

// Update coupon by ID
export const updateCoupon = async (id, data) => {
  const res = await api.put(`/coupon/update-coupon/${id}`, data);
  return res.data;
};

// Delete coupon by ID
export const deleteCoupon = async (id) => {
  const res = await api.delete(`/coupon/delete/${id}`);
  return res.data;
};
