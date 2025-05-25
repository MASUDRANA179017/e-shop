import React from "react";
import Banner from "../components/banner/Banner";
import QuackService from "../components/quackService/QuackService";
import Product from "../components/product/Product";

const HomePage = () => {
  return (
    <div>
      <Banner />
      <QuackService />
      <Product/>
    </div>
  );
};
export default HomePage;