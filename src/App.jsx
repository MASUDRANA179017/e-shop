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
import Dashboard from "./pages/Dashboard";
import RegisterPage from "./pages/Register";



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
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Optional fallback route */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
