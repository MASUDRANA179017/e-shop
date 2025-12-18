import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminLayout from "../components/dashboard/admin/AdminLayout";
import AdminDashboard from "../components/dashboard/admin/index";
import Dashboard from "../pages/Dashboard";
import AdminUsersTable from "../components/dashboard/admin/AdminUsersTable";
import AdminProductsTable from "../components/dashboard/admin/AdminProductsTable";
import AdminCategoryTable from "../components/dashboard/admin/AdminCategoryTable";
import AdminStoreTable from "../components/dashboard/admin/AdminStoreTable";
import UpdateProfile from "../components/dashboard/UpdateProfile";

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
      <Route index element={<AdminDashboard />} />
      <Route path="bookings" element={<div className="p-10 text-center">
        <h2 className="text-xl font-bold">Bookings Management</h2>
        <p className="text-gray-500">Order list coming soon...</p>
      </div>} />
      <Route path="users" element={<div className="p-4">
        <AdminUsersTable />
      </div>} />
      <Route path="category" element={<div className="p-4">
        <AdminCategoryTable />
      </div>} />
      <Route path="stores" element={<div className="p-4">
        <AdminStoreTable />
      </div>} />
      <Route path="products" element={<div className="p-4">
        <AdminProductsTable />
      </div>} />
      <Route path="profile" element={<div className="p-10 text-center">
        <UpdateProfile/>
      </div>} />
      <Route path="settings" element={<div className="p-10 text-center">Settings Page</div>} />
    </Route>
  </>
);
