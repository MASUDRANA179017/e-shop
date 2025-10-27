import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../pages/Dashboard";

export const AdminRoutes = (
  <>
    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    {/* You can easily add more admin pages later */}
    <Route
      path="/admin/users"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <div className="p-10 text-center text-xl">Admin Users Management Page</div>
        </ProtectedRoute>
      }
    />
  </>
);
