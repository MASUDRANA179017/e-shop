import React, { useState } from "react";
import {
  FaHome,
  FaThList,
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

const categories = [
  "Electronics",
  "Clothing",
  "Home Appliances",
  "Books",
  "Sports",
];

const MobileHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full bg-[#FF624C] text-white sticky top-0 z-50">
      {/* Top row */}
      <div className="flex justify-between items-center px-4 py-3">
        <button
          className="text-2xl"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <FaTimes /> : "☰"}
        </button>
        <div className="text-lg font-bold">E-Shop</div>
        <button className="text-xl">
          <FaSearch />
        </button>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="bg-white text-gray-800 shadow-md">
          <ul className="flex flex-col divide-y divide-gray-200">
            <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer">Home</li>
            <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer">Profile</li>
            <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer">Cart</li>
            <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer">
              Categories
              <ul className="mt-2 ml-2">
                {categories.map((cat) => (
                  <li
                    key={cat}
                    className="px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

const MobileBottomMenu = () => {
  const [active, setActive] = useState("home");

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow-md z-50 md:hidden">
      <div className="flex justify-around items-center py-2 text-gray-600">
        <button
          onClick={() => setActive("home")}
          className={`flex flex-col items-center text-sm ${
            active === "home" ? "text-[#FF624C]" : ""
          }`}
        >
          <FaHome className="text-xl" />
          Home
        </button>
        <button
          onClick={() => setActive("categories")}
          className={`flex flex-col items-center text-sm ${
            active === "categories" ? "text-[#FF624C]" : ""
          }`}
        >
          <FaThList className="text-xl" />
          Categories
        </button>
        <button
          onClick={() => setActive("cart")}
          className={`flex flex-col items-center text-sm ${
            active === "cart" ? "text-[#FF624C]" : ""
          }`}
        >
          <FaShoppingCart className="text-xl" />
          Cart
        </button>
        <button
          onClick={() => setActive("profile")}
          className={`flex flex-col items-center text-sm ${
            active === "profile" ? "text-[#FF624C]" : ""
          }`}
        >
          <FaUser className="text-xl" />
          Profile
        </button>
      </div>
    </div>
  );
};

export { MobileHeader, MobileBottomMenu };
