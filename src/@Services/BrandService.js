import api from "../api/axiosInstance";

// Create Brand
export const createBrand = async (data) => {
    const res = await api.post("/brand/create", data);
    return res.data;
};

// Get All Brands
export const getAllBrands = async () => {
    const res = await api.get("/brand/all");
    return res.data;
};

// Get Brand By ID
export const getBrandById = async (id) => {
    const res = await api.get(`/brand/${id}`);
    return res.data;
};

// Update Brand
export const updateBrand = async (id, data) => {
    const res = await api.patch(`/brand/update/${id}`, data);
    return res.data;
};

// Delete Brand
export const deleteBrand = async (id) => {
    const res = await api.delete(`/brand/delete/${id}`);
    return res.data;
};
