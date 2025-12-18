import React from "react";
import { Link } from "react-router-dom";
import Container from "../commonLayouts/Container";
import { FaShoppingCart, FaUser, FaSearch, FaHeart, FaWallet } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCurrency } from "../../context/CurrencyContext";

const MiddleBar = () => {
  const { cartTotal, cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { formatPrice } = useCurrency();

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  return (
    <Container>
      <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-white shadow-sm border-b border-gray-200 gap-4 md:gap-0 z-0">
        {/* Left Section: Logo */}
        <a href="/" className="flex items-center">
          {/* <img src="/logo.png" alt="Logo" className="h-8 mr-2" /> */}
          <div className="text-2xl font-bold text-gray-800">
            e-<span className="text-red-500">shop</span>
          </div>
        </a>

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

        {/* Right Section: Icons */}
        <div className="flex items-center gap-6">
          
          {/* Wishlist */}
          <Link to="/wishlist" className="flex items-center cursor-pointer text-gray-700 hover:text-red-500 transition-colors duration-200 relative">
            <div className="relative">
                <FaHeart className="w-6 h-6" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
            </div>
            <div className="hidden sm:block ml-2">
              <div className="text-sm">Wishlist</div>
            </div>
          </Link>

          {/* Wallet */}
          <Link to={(user ? (user.role === "admin" ? "/dashboard/admin/wallet" : user.role === "vendor" ? "/dashboard/vendor/wallet" : "/dashboard/user/wallet") : "/login")} className="flex items-center cursor-pointer text-gray-700 hover:text-green-600 transition-colors duration-200">
            <FaWallet className="w-6 h-6" />
            <div className="hidden sm:block ml-2">
              <div className="text-sm">Wallet</div>
            </div>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="flex items-center cursor-pointer text-gray-700 hover:text-gray-900 transition-colors duration-200">
            <div className="relative">
              <FaShoppingCart className="w-6 h-6 mr-2" />
               {cartCount > 0 && (
                  <span className="absolute -top-2 -right-1 bg-[#FF624C] text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
            </div>
            <div className="hidden sm:block">
              <div className="text-sm">Cart</div>
              <div className="text-md font-semibold text-gray-800">{formatPrice(cartTotal)}</div>
            </div>
          </Link>

          {/* Vertical Separator */}
          <div className="hidden sm:block w-px h-8 bg-gray-300"></div>

          {/* User Account */}
          <Link
            to={user ? (user.role === "admin" ? "/dashboard/admin" : user.role === "vendor" ? "/dashboard/vendor" : "/dashboard/user") : "/login"}
            className="flex items-center cursor-pointer text-gray-700 hover:text-gray-900 transition-colors duration-200"
          >
            <FaUser className="w-6 h-6 mr-2" />
            <div className="hidden sm:block">
              {user ? (
                <>
                  <div className="text-sm">{user.firstName}</div>
                  <div className="text-md font-semibold text-gray-800">
                    My Account
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm">Welcome</div>
                  <div className="text-md font-semibold text-gray-800">
                    Login/Register
                  </div>
                </>
              )}
            </div>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default MiddleBar;
