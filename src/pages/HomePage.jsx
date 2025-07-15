import React from "react";
import QuackService from "../components/quackService/QuackService";
import NewProductLazyLoad from "../components/product/NewProductLazyLoad";
import {Banner, Banner2 } from "../components/banner/Banner";
import ProductSlider from "../components/product/ProductSlide";
import Bestseller from "../components/bestSeler/bestseller";
import FAQ from "../components/faq/FAQ";



const HomePage = () => {
  return (
    <div>
      <Banner />
      <QuackService />
      <ProductSlider />
      <Banner2 />
      <NewProductLazyLoad />
      <Bestseller />
      <FAQ />
    </div>
  );
};
export default HomePage;