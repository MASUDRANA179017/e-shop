import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import { BlogPage } from "./pages/BlogPage";
import CommonLayout from "./components/commonLayouts/CommonLayout";
import { ProductListPage } from "./pages/ProductListPage";
import ContactPage from "./pages/ContactPage";
// newly added 
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./components/dashbord/user";



function App() {
  return (
    <Routes>
      {/* 🔹 Public routes inside CommonLayout */}
      <Route path="/" element={<CommonLayout />}>
        <Route index element={<HomePage />} />
        <Route path="product" element={<ProductListPage />} />
        <Route path="product/:id" element={<ProductDetailsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="blog" element={<BlogPage />} />
      </Route>

      {/* 🔹 Auth routes (outside CommonLayout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 🔹 Protected routes */}

    // Admin route
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

    // Vendor route
      <Route
        path="/vendor/dashboard"
        element={
          <ProtectedRoute allowedRoles={["vendor"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

    // User route
      <Route
        path="/dashboard/user"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      


      {/* Optional fallback route */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
