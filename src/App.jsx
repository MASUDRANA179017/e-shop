import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";
import { ProductList } from "./pages/ProductList";
import { BlogPage } from "./pages/BlogPage";
import CommonLayout from "./components/commonLayouts/CommonLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CommonLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/product-list" element={<ProductList />} />
        <Route path="/product-details" element={<ProductDetailsPage />} />
        <Route path="/blog" element={<BlogPage />} />
      </Route>
    </Routes>
  );
}

export default App;
