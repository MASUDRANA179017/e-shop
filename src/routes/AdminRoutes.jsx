import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminLayout from "../components/dashbord/admin/AdminLayout";
import UserDashboard from "../components/dashbord/user";
import Dashboard from "../pages/Dashboard";
import AdminUsersTable from "../components/dashbord/admin/AdminUsersTable";
import AdminProductsTable from "../components/dashbord/admin/AdminProductsTable";

export const AdminRoutes = (
  <>
    <Route
      path="/dashboard/admin"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      {/* Nested Pages */}
      <Route index element={<UserDashboard />} />
      <Route path="bookings" element={<div className="p-10 text-center">
        <Dashboard />
      </div>} />
      <Route path="users" element={<div className="p-10 text-center">
        <AdminUsersTable />
      </div>} />
      <Route path="products" element={<div className="p-10 text-center">
        <AdminProductsTable />
      </div>} />
      <Route path="profile" element={<div className="p-10 text-center">Profile Page</div>} />
      <Route path="settings" element={<div className="p-10 text-center">Settings Page</div>} />
    </Route>
  </>
);
