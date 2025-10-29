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
    <Route
      path="/vendor/orders"
      element={
        <ProtectedRoute allowedRoles={["vendor"]}>
          <div className="p-10 text-center text-xl">Vendor Orders Page</div>
        </ProtectedRoute>
      }
    />
    <Route
      path="/vendor/products"
      element={
        <ProtectedRoute allowedRoles={["vendor"]}>
          <div className="p-10 text-center text-xl">Vendor Products Page</div>
        </ProtectedRoute>
      }
    />
  </>
);
