import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import UserDashboard from "../components/dashbord/user";

export const UserRoutes = (
  <>
    <Route
      path="/dashboard/user"
      element={
        <ProtectedRoute allowedRoles={["user"]}>
          <UserDashboard />
        </ProtectedRoute>
      }
    />

    {/* You can easily add more user pages later */}
    <Route
      path="/dashboard/user/profile"
      element={
        <ProtectedRoute allowedRoles={["user"]}>
          <div className="p-10 text-center text-xl">User Profile Page</div>
        </ProtectedRoute>
      }
    />
  </>
);
