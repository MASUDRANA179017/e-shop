import { Routes, Route } from "react-router-dom";
import "./App.css";

// Public Pages
import HomePage from "./pages/HomePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import { BlogPage } from "./pages/BlogPage";
import { ProductListPage } from "./pages/ProductListPage";
import ContactPage from "./pages/ContactPage";
import CommonLayout from "./components/commonLayouts/CommonLayout";
import VendorListPage from "./pages/VendorListPage";
import ServicePage from "./pages/ServicePage";
import VendorProfilePage from "./pages/VendorProfilePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import WishlistPage from "./pages/WishlistPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";

// Auth Pages
import Login from "./pages/Login";
import RegisterPage from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// Role-based Route Groups
import { AdminRoutes } from "./routes/AdminRoutes";
import { VendorRoutes } from "./routes/VendorRoutes";
import { UserRoutes } from "./routes/UserRoutes";

import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}


function App() {
  return (
    <>
    <Routes>
      {/* Public Routes (wrapped inside CommonLayout) */}
      <Route path="/" element={<CommonLayout />}>
        <Route index element={<HomePage />} />
        <Route path="service" element={<ServicePage />} />
        {/* <Route path="product" element={<ProductListPage />} /> */}
        <Route path="product/:id" element={<ProductDetailsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="vendors" element={<VendorListPage />} />
        <Route path="vendor/:id" element={<VendorProfilePage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="success" element={<BookingSuccessPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Role-Based Routes */}
      {AdminRoutes}
      {VendorRoutes}
      {UserRoutes}

      {/* Fallback */}
      <Route path="*" element={<Login />} />
    </Routes>
    <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
