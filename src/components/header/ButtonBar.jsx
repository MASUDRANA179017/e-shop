import React from "react";
import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaBars,
  FaChevronDown,
  FaFire,
} from "react-icons/fa";
import Container from "../commonLayouts/Container";
const ButtonBar = () => {
  return (
    <div className="w-full bg-[#FF624C] text-white sticky top-0 z-50">
      <Container>
        <div className=" p-4 flex items-center justify-between">
          {/* Left Nav Items */}
          <ul className="flex items-center space-x-8">
            <li className="flex items-center cursor-pointer hover:underline">
              <FaBars className="mr-2" />
              All Categories
            </li>
            <li className="flex items-center cursor-pointer hover:underline">
              Products <FaChevronDown className="ml-1 text-xs" />
            </li>
            <li className="cursor-pointer hover:underline">Blog</li>
            <li className="cursor-pointer hover:underline">Contact</li>
          </ul>

          {/* Right Nav Items */}
          <ul className="flex items-center space-x-8">
            <li className="flex items-center cursor-pointer font-bold hover:underline">
              <FaFire className="mr-1 text-orange-300" />{" "}
              {/* Adjust color if needed */}
              LIMITED SALE <FaChevronDown className="ml-1 text-xs" />
            </li>
            <li className="cursor-pointer hover:underline">Best Seller</li>
            <li className="cursor-pointer hover:underline">New Arrival</li>
          </ul>
        </div>
      </Container>
    </div>
  );
};

export default ButtonBar;
