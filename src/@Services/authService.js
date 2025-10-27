// src/services/authService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/auth";

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
            email,
            password,
        });
        const data = response.data;


        // Save both token and user to localStorage so they're stored consistently
        if (data) {
            if (data.token) {
                localStorage.setItem("token", data.refresh_Token);
            }
            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }
        }

        return data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};


export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
        return true;
    }
    return false;
};

// Save user data to localStorage after login
export const setLoginSession = (userData) => {
    if (userData.token) {
        localStorage.setItem("token", userData.token);
    }
    if (userData.user) {
        localStorage.setItem("user", JSON.stringify(userData.user));
    }
};

// Get user data from localStorage
export const getUserData = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};
