import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import VendorLayout from "../components/dashboard/vendor/VendorLayout";
import UpdateProfile from "../components/dashboard/UpdateProfile";
import VendorProductsTable from "../components/dashboard/vendor/VendorProductTable";
import VendorStoreTable from "../components/dashboard/vendor/VendorStoreTable";
import UserDashboard from "../components/dashboard/user";
import VendorPrescriptionTable from "../components/dashboard/vendor/VendorPrescriptionTable";
import CouponTable from "../components/dashboard/vendor/VendorCouponTable";

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
      <Route index element={<UserDashboard />} />
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
          <div className="p-10 text-center">
            <VendorPrescriptionTable />
          </div>
        }
      />
      {/* prescriptions */}
      {/* products  */}
      {/* Pet Details */}
      {/* Accounting  */}
      {/* Inventory */}
      {/* Note and reminders  */}
      <Route
        path="my-services"
        element={
          <div className="p-10 text-center">
            <VendorStoreTable />
          </div>
        }
      />
      <Route
        path="my-coupons"
        element={
          <div className="p-10 text-center">
            <CouponTable />
          </div>
        }
      />
      <Route
        path="my-products"
        element={
          <div className="p-10 text-center">
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
