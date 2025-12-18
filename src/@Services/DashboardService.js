import api from "../api/axiosInstance";

// Get Dashboard Stats (Public or Protected - usually Protected)
export const getDashboardStats = async () => {
  const res = await api.get("/dashboard/stats");
  return res.data;
};
