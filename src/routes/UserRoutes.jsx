import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import UserLayout from "../components/dashboard/user/UserLayout";

import UserDashboard from "../components/dashboard/user/index";
import Dashboard from "../pages/Dashboard";
import UpdateProfile from "../components/dashboard/UpdateProfile";
import CreateStorePage from "../components/dashboard/user/CreateShop";
import UserWallet from "../components/dashboard/user/UserWallet";
import WithdrawalRequests from "../components/dashboard/user/WithdrawalRequests";


export const UserRoutes = (
  <Route
    path="/dashboard/user"
    element={
      <ProtectedRoute allowedRoles={["user"]}>
        <UserLayout />
      </ProtectedRoute>
    }
  >
    {/* Nested Pages */}
    <Route index element={<UserDashboard />} />
    <Route path="bookings" element={<div className="p-10 text-center">
      <h2 className="text-xl font-bold">My Bookings</h2>
      <p className="text-gray-500">Booking history coming soon...</p>
    </div>} />
    <Route path="wallet" element={<UserWallet />} />
    <Route path="withdrawals" element={<div className="p-4"><WithdrawalRequests /></div>} />
    <Route path="profile" element={<div className="p-10 text-center">
      <UpdateProfile />
    </div>} />
    <Route path="shop-create" element={<div className="p-10 text-center">
      <CreateStorePage />
    </div>} />
    <Route path="settings" element={<div className="p-10 text-center">Settings Page</div>} />
  </Route>
);
