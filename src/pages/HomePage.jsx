import React from "react";
import QuackService from "../components/frontend/QuackService.jsx";
import NewProductLazyLoad from "../components/frontend/product/NewProductLazyLoad.jsx";
import ServiceLazyLoad from "../components/frontend/service/ServiceLazyLoad.jsx";
import { Banner, Banner2 } from "../components/frontend/banner/Banner.jsx";
import ProductSlider from "../components/frontend/product/ProductSlide";
import ServiceSlider from "../components/frontend/service/ServiceSlide";
import Bestseller from "../components/frontend/Bestseller.jsx";
import ServiceBestseller from "../components/frontend/service/ServiceBestseller.jsx";

import SpringSale from "../components/frontend/SpringSale.jsx";
import FAQ from "../components/frontend/FAQ.jsx";
import Blog from "../components/frontend/blog";
import FeaturedVendors from "../components/frontend/FeaturedVendors.jsx";




const HomePage = () => {
  return (
    <div>
      <Banner />
      <QuackService />
      <ProductSlider />
      <ServiceSlider />
      <FeaturedVendors />
      <Banner2 />
      <NewProductLazyLoad />
      <ServiceLazyLoad />
      <SpringSale />
      <Bestseller />
      <ServiceBestseller />
      <FAQ />
      <Blog />
    </div>
  );
};
export default HomePage;