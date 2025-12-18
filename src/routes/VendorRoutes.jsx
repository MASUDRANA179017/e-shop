import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import VendorLayout from "../components/dashboard/vendor/VendorLayout";
import UpdateProfile from "../components/dashboard/UpdateProfile";
import VendorProductsTable from "../components/dashboard/vendor/VendorProductTable";
import VendorStoreTable from "../components/dashboard/vendor/VendorStoreTable";
import VendorDashboard from "../components/dashboard/vendor/index";
import VendorPrescriptionTable from "../components/dashboard/vendor/VendorPrescriptionTable";
import CouponTable from "../components/dashboard/vendor/VendorCouponTable";
import VendorPos from "../components/dashboard/vendor/pos/VendorPos";
import VendorOrderTable from "../components/dashboard/vendor/VendorOrderTable";

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
      <Route index element={<VendorDashboard />} />
      <Route path="pos" element={<VendorPos />} />
      <Route
        path="profile"
        element={
          <div className="p-10 text-center">
            <UpdateProfile />
          </div>
        }
      />
      {/* marketing plan */}
      <Route
        path="prescriptions"
        element={
          <div className="p-4">
            <VendorPrescriptionTable />
          </div>
        }
      />
      
      <Route
        path="my-services"
        element={
          <div className="p-4">
            <VendorStoreTable />
          </div>
        }
      />
      <Route
        path="my-coupons"
        element={
          <div className="p-4">
            <CouponTable />
          </div>
        }
      />
      <Route
        path="my-orders"
        element={
          <div className="p-4">
            <VendorOrderTable />
          </div>
        }
      />
      <Route
        path="my-products"
        element={
          <div className="p-4">
            <VendorProductsTable />
          </div>
        }
      />

      <Route
        path="settings"
        element={<div className="p-10 text-center">Settings Page</div>}
      />
    </Route>
  </>
);
