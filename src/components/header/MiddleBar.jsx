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
            e-<span className="text-red-500">shop.</span>
          </div>

          {/* Middle Section: Search Bar */}
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-gray-50 flex-grow max-w-lg mx-4">
            <input
              type="text"
              placeholder="Search Products..."
              className="p-2 flex-grow outline-none bg-transparent text-gray-700 placeholder-gray-500"
            />
            <button className="p-2 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
              <FaSearch className="w-5 h-5" />
            </button>
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
