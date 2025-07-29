import React from "react";
import QuackService from "../components/QuackService.jsx";
import NewProductLazyLoad from "../components/product/NewProductLazyLoad";
import { Banner, Banner2 } from "../components/banner/Banner";
import ProductSlider from "../components/product/ProductSlide";
import Bestseller from "../components/Bestseller.jsx";

import SpringSale from "../components/SpringSale.jsx";
import FAQ from "../components/FAQ.jsx";




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
    </div>
  );
};
export default HomePage;