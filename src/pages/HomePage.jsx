import React from "react";
import Banner from "../components/banner/Banner";
import QuackService from "../components/quackService/QuackService";
import Product from "../components/product/Product";
import NewProductLazyLoad from "../components/product/NewProductLazyLoad";

const HomePage = () => {
  return (
    <div>
      <Banner />
      <QuackService />
      <Product/>
      <NewProductLazyLoad/>
    </div>
  );
};
export default HomePage;