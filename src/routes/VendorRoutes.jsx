import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import VendorLayout from "../components/dashboard/vendor/VendorLayout";
import UpdateProfile from "../components/dashboard/UpdateProfile";
import VendorProductsTable from "../components/dashboard/vendor/VendorProductTable";
import VendorDashboard from "../components/dashboard/vendor/index";
import VendorPrescriptionTable from "../components/dashboard/vendor/VendorPrescriptionTable";
import CouponTable from "../components/dashboard/vendor/VendorCouponTable";
import VendorPos from "../components/dashboard/vendor/pos/VendorPos";
import VendorOrderTable from "../components/dashboard/vendor/VendorOrderTable";
import VendorServiceTable from "../components/dashboard/vendor/VendorServiceTable";
import VendorSettings from "../components/dashboard/vendor/VendorSettings";
import UserWallet from "../components/dashboard/user/UserWallet";
import WithdrawalRequests from "../components/dashboard/user/WithdrawalRequests";
import VendorBlogTable from "../components/dashboard/vendor/VendorBlogTable";
import VendorCategoryTable from "../components/dashboard/vendor/VendorCategoryTable";

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
        path="services"
        element={
          <div className="p-4">
            <VendorServiceTable />
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
        path="products"
        element={
          <div className="p-4">
            <VendorProductsTable />
          </div>
        }
      />
      <Route
        path="blogs"
        element={
          <div className="p-4">
            <VendorBlogTable />
          </div>
        }
      />

      <Route path="wallet" element={<div className="p-4"><UserWallet /></div>} />
      <Route path="withdrawals" element={<div className="p-4"><WithdrawalRequests /></div>} />
      <Route path="settings" element={<div className="p-4"><VendorSettings /></div>} />
    </Route>
  </>
);
