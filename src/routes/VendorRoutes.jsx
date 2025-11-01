import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import VendorLayout from "../components/dashboard/vendor/VendorLayout";
import UpdateProfile from "../components/dashboard/UpdateProfile";

export const VendorRoutes = (
  <>
    <Route
      path="/dashboard/vendor"
      element={
        <ProtectedRoute allowedRoles={["vendor"]}>
          <VendorLayout />
        </ProtectedRoute>
      }
    >
      <Route path="profile" element={<div className="p-10 text-center">
        <UpdateProfile />
      </div>} />
      <Route path="my-store" element={<div className="p-10 text-center">my-store Page</div>} />
      <Route path="my-products" element={<div className="p-10 text-center">my-product Page</div>} />
      <Route path="settings" element={<div className="p-10 text-center">Settings Page</div>} />
    </Route>
  </>
);
