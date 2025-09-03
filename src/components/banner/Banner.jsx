import React from "react";
import BannerProduct from "./BannerProduct";
import BannerFreeShipping from "./BannerFreeShipping";
import BannerBlackFriday from "./BannerBlackFriday";
import Container from "../commonLayouts/Container";

// Full-width main banner
export const Banner = () => {
  return (
    <div className="w-full">
      <BannerProduct />
    </div>
  );
};

// Two side-by-side banners
export const Banner2 = () => {
  return (
    <Container>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Free Shipping Banner */}
        <div className="w-full">
          <BannerFreeShipping />
        </div>

        {/* Black Friday Banner */}
        <div className="w-full">
          <BannerBlackFriday />
        </div>
      </div>
    </Container>
  );
};
