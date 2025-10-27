import { Routes, Route } from "react-router-dom";
import "./App.css";

// Public Pages
import HomePage from "./pages/HomePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import { BlogPage } from "./pages/BlogPage";
import { ProductListPage } from "./pages/ProductListPage";
import ContactPage from "./pages/ContactPage";
import CommonLayout from "./components/commonLayouts/CommonLayout";

// Auth Pages
import Login from "./pages/Login";
import RegisterPage from "./pages/Register";

// Role-based Route Groups
import { AdminRoutes } from "./routes/AdminRoutes";
import { VendorRoutes } from "./routes/VendorRoutes";
import { UserRoutes } from "./routes/UserRoutes";

function App() {
  return (
    <Routes>
      {/* 🔹 Public Routes (wrapped inside CommonLayout) */}
      <Route path="/" element={<CommonLayout />}>
        <Route index element={<HomePage />} />
        <Route path="product" element={<ProductListPage />} />
        <Route path="product/:id" element={<ProductDetailsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="blog" element={<BlogPage />} />
      </Route>

      {/* 🔹 Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 🔹 Role-Based Routes */}
      {AdminRoutes}
      {VendorRoutes}
      {UserRoutes}

      {/* 🔹 Fallback */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
