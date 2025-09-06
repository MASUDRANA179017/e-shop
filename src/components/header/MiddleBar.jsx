import React from "react";
import Container from "../commonLayouts/Container";
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";

const MiddleBar = () => {
  return (
    <Container>
      <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-white shadow-sm border-b border-gray-200 gap-4 md:gap-0 z-0">
        {/* Left Section: Logo */}
        <div className="text-2xl font-bold text-gray-800">
          e-<span className="text-red-500">shop</span>
        </div>

        {/* Middle Section: Search Bar */}
        <div className="w-full md:w-[350px] relative">
          <input
            type="text"
            placeholder="Search Products..."
            className="w-full border border-[#cccccc] py-2 md:py-[10px] px-4 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 transition-colors duration-200">
            <FaSearch className="w-5 h-5" />
          </button>
        </div>

        {/* Right Section: Cart and User Account */}
        <div className="flex items-center gap-6">
          {/* Cart */}
          <div className="flex items-center cursor-pointer text-gray-700 hover:text-gray-900 transition-colors duration-200">
            <FaShoppingCart className="w-6 h-6 mr-2" />
            <div className="hidden sm:block">
              <div className="text-sm">Cart</div>
              <div className="text-md font-semibold text-gray-800">$150.00</div>
            </div>
          </div>

          {/* Vertical Separator */}
          <div className="hidden sm:block w-px h-8 bg-gray-300"></div>

          {/* User Account */}
          <div className="flex items-center cursor-pointer text-gray-700 hover:text-gray-900 transition-colors duration-200">
            <FaUser className="w-6 h-6 mr-2" />
            <div className="hidden sm:block">
              <div className="text-sm">User</div>
              <div className="text-md font-semibold text-gray-800">
                Account
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default MiddleBar;
