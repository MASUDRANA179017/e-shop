import React from "react";
import QuackService from "../components/quackService/QuackService";
import NewProductLazyLoad from "../components/product/NewProductLazyLoad";
import {Banner, Banner2 } from "../components/banner/Banner";
import BannerFreeShipping from "../components/banner/BannerFreeShipping";
import BannerTwo from "../components/banner/BannerTwo";
import BannerBlackFriday from "../components/banner/BannerBlackFriday";
import ProductSlider from "../components/product/ProductSlide";


const HomePage = () => {
  return (
    <div>
      <Banner />
      <QuackService />
      <ProductSlider />
      <Banner2 />
      <NewProductLazyLoad />
    </div>
  );
};
export default HomePage;