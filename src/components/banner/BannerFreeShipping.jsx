import React from "react";
import Container from "../commonLayouts/Container";



const BannerFreeShipping = () => {
  return (
    <>
      <Container>
         <section className="relative w-full bg-gray-100 py-20 px-8 lg:py-24 lg:px-16 flex items-center overflow-hidden min-h-[500px]">
          <div className="absolute inset-0 z-0">
            <img src="frontend/banner/freeSheeping.png" alt="Banner Product" className="w-full h-full object-cover" />

            <div className="absolute inset-0 bg-gray-100 opacity-60 md:opacity-50"></div>
          </div>

          {/* Content (Left Side - Text and Button) */}
          <div className="relative z-10 max-w-xl text-left bg-gray-100 bg-opacity-80 p-6 rounded-lg md:bg-transparent md:bg-opacity-100 md:p-0">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              Your One-Stop <br /> Electronic Market
            </h1>
            <p className="text-lg lg:text-xl text-gray-700 mb-8 max-w-md">
              Welcome to e-shop, a place where you can buy everything about
              electronics. Sale every day!
            </p>
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-md shadow-lg transition-colors duration-300 cursor-pointer">
              Shop Now
            </button>
          </div>
        </section>
       
      </Container>
    </>
  );
};

export default BannerFreeShipping;
