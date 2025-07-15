import React from "react";
import Container from "../commonLayouts/Container";
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';

const MiddleBar = () => {
  return (
    <Container>
      <div>
        <div className="flex items-center justify-between p-4 bg-white shadow-sm border-b border-gray-200">
          {/* Left Section: Logo */}
          <div className="text-2xl font-bold text-gray-800">
            e-<span className="text-red-500">shop</span>
          </div>

          {/* Middle Section: Search Bar */}
          <div className="flex items-right ">
            <div className="relative ">
              <input
                type="text"
                placeholder="Search Products..."
                className="p-2 w-[332px] border border-[#cccccc]  py-[18px] px-6 rounded-[10px] "
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2  text-gray-600 rounded-full p-2 transition-colors duration-200">
                <FaSearch className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Section: Cart and User Account */}
          <div className="flex items-center space-x-6">
            {/* Cart */}
            <div className="flex items-center cursor-pointer text-gray-700 hover:text-gray-900 transition-colors duration-200">
              <FaShoppingCart className="w-6 h-6 mr-2" />
              <div>
                <div className="text-sm">Cart</div>
                <div className="text-md font-semibold text-gray-800">
                  $ 150,00
                </div>
              </div>
            </div>

            {/* Vertical Separator */}
            <div className="w-px h-8 bg-gray-300"></div>

            {/* User Account */}
            <div className="flex items-center cursor-pointer text-gray-700 hover:text-gray-900 transition-colors duration-200">
              <FaUser className="w-6 h-6 mr-2" />
              <div>
                <div className="text-sm">User</div>
                <div className="text-md font-semibold text-gray-800">
                  Account
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default MiddleBar;
