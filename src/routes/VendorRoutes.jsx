import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../pages/Dashboard";

export const VendorRoutes = (
  <>
    <Route
      path="/vendor/dashboard"
      element={
        <ProtectedRoute allowedRoles={["vendor"]}>
          <Dashboard />
        </ProtectedRoute>
      }
    />
  </>
);
