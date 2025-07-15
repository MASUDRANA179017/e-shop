import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import ProductDetailsPage from "./pages/ProductDetailsPage"
import { BlogPage } from "./pages/BlogPage";
import CommonLayout from "./components/commonLayouts/CommonLayout";
import { ProductListPage } from "./pages/ProductListPage";
import ContactPage from "./pages/ContactPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CommonLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/product" element={<ProductListPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<BlogPage />} />
      </Route>
    </Routes>
  );
}

export default App;
