import React from "react";
import BannerProduct from "./BannerProduct";
import BannerFreeShipping from "./BannerFreeShipping";
import BannerBlackFriday from "./BannerBlackFriday";
import Container from "../commonLayouts/Container";

export const Banner = () => {
  return (
    <>
      <BannerProduct />
    </>
  );
};

export const Banner2 = () => {
  return (
    <>
      <Container>
        <div className=" flex justify-between ">
          <div className="m-2 w-full">
            <BannerFreeShipping />
          </div>
          <div className="m-2 w-full">

            <BannerBlackFriday />
          </div>
        </div>
      </Container>
    </>
  )
}


