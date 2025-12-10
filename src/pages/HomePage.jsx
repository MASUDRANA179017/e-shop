import React from "react";
import QuackService from "../components/frontend/QuackService.jsx";
import NewProductLazyLoad from "../components/frontend/product/NewProductLazyLoad.jsx";
import { Banner, Banner2 } from "../components/frontend/banner/Banner.jsx";
import ProductSlider from "../components/frontend/product/ProductSlide";
import Bestseller from "../components/frontend/Bestseller.jsx";

import SpringSale from "../components/frontend/SpringSale.jsx";
import FAQ from "../components/frontend/FAQ.jsx";
import Blog from "../components/frontend/blog";




const HomePage = () => {
  return (
    <div>
      <Banner />
      <QuackService />
      <ProductSlider />
      <Banner2 />
      <NewProductLazyLoad />
      <SpringSale />
      <Bestseller />
      <FAQ />
      <Blog />
    </div>
  );
};
export default HomePage;