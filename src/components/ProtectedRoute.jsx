import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const token = localStorage.getItem("token");
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;

    // Not logged in
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // If the route is admin-only but the user is not admin, block access
    if (adminOnly && user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    // If user is admin but you're on a non-admin protected route, redirect to admin area
    if (!adminOnly && user.role === "admin") {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default ProtectedRoute;
