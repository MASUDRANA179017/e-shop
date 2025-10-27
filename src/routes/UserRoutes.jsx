import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import UserLayout from "../components/dashbord/user/UserLayout";

import UserDashboard from "../components/dashbord/user/index";
import Dashboard from "../pages/Dashboard";


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
      <Dashboard/>
    </div>} />
    <Route path="profile" element={<div className="p-10 text-center">Profile Page</div>} />
    <Route path="settings" element={<div className="p-10 text-center">Settings Page</div>} />
  </Route>
);
