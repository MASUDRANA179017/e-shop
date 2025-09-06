// components/ButtonBar.jsx
import React, { useEffect, useRef, useState } from "react";
import { FaBars, FaFire, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import Container from "../commonLayouts/Container";

const ButtonBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLimitedSaleDropdownOpen, setIsLimitedSaleDropdownOpen] =
    useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);

  const productRef = useRef(null);
  const saleRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (productRef.current && !productRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (saleRef.current && !saleRef.current.contains(event.target)) {
        setIsLimitedSaleDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-[#FF624C] text-white sticky top-0 z-40">
      <Container>
        <div className="p-4 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-6">
            {/* Mobile toggle button */}
            <button
              className="md:hidden text-2xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Desktop All Categories toggle */}
            <button
              onClick={() => setIsCategoryDrawerOpen(true)}
              className="hidden md:flex items-center gap-2 font-semibold"
            >
              <FaBars /> <span>All Categories</span>
            </button>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-8 font-medium">
            <li ref={productRef} className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center hover:underline"
              >
                Product
              </button>
              {isDropdownOpen && (
                <div className="absolute top-[45px] left-0 bg-white text-black shadow-lg rounded-md w-48 animate-fadeIn">
                  <ul className='py-2 font-["Montserrat"] text-base leading-6'>
                    <li className="px-4 py-2 hover:bg-gray-100">
                      <Link to="#">Submenu Item 1</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100">
                      <Link to="#">Submenu Item 2</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100">
                      <Link to="#">Submenu Item 3</Link>
                    </li>
                  </ul>
                </div>
              )}
            </li>
            <li>
              <Link to={"/blog"} className="hover:underline">
                Blog
              </Link>
            </li>
            <li>
              <Link to={"/contact"} className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>

          {/* Right Section */}
          <ul className="hidden md:flex items-center space-x-8 font-medium">
            <li ref={saleRef} className="relative">
              <button
                onClick={() =>
                  setIsLimitedSaleDropdownOpen(!isLimitedSaleDropdownOpen)
                }
                className="flex items-center gap-2 font-bold text-yellow-200"
              >
                <FaFire /> LIMITED SALE
              </button>
              {isLimitedSaleDropdownOpen && (
                <div className="absolute top-[45px] right-0 bg-white text-black shadow-lg rounded-md w-48 animate-fadeIn">
                  <ul className='py-2 font-["Montserrat"] text-base leading-6'>
                    <li className="px-4 py-2 hover:bg-gray-100">
                      <Link to="#">Deal 1</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100">
                      <Link to="#">Deal 2</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100">
                      <Link to="#">Deal 3</Link>
                    </li>
                  </ul>
                </div>
              )}
            </li>
            <li>
              <Link to={"/product"} className="hover:underline">
                Best Seller
              </Link>
            </li>
            <li>
              <Link to={"/product"} className="hover:underline">
                New Arrival
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      {/* Category Drawer (Desktop All Categories) */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-white text-black shadow-lg p-6 transform transition-transform duration-300 ease-in-out z-50 ${isCategoryDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Close button */}
        <button
          className="text-2xl mb-4"
          onClick={() => setIsCategoryDrawerOpen(false)}
        >
          <FaTimes />
        </button>

        <h2 className="text-lg font-bold mb-4">All Categories</h2>
        <ul className="space-y-3 font-medium">
          <li><Link to="#">Electronics</Link></li>
          <li><Link to="#">Clothing</Link></li>
          <li><Link to="#">Home & Kitchen</Link></li>
          <li><Link to="#">Sports</Link></li>
          <li><Link to="#">Beauty</Link></li>
          <li><Link to="#">Books</Link></li>
        </ul>
      </div>

      {/* Mobile Menu - Side Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#FF624C] text-white p-4 space-y-4 transform transition-transform duration-300 ease-in-out z-50 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Close button */}
        <button
          className="text-2xl mb-4"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FaTimes />
        </button>

        <Link to={"/"} className="block hover:underline">
          All Categories
        </Link>

        <button
          className="block w-full text-left hover:underline"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          Product
        </button>
        {isDropdownOpen && (
          <div className="bg-white text-black rounded-md shadow-md p-2">
            <Link to="#" className="block px-2 py-1 hover:bg-gray-100">
              Submenu Item 1
            </Link>
            <Link to="#" className="block px-2 py-1 hover:bg-gray-100">
              Submenu Item 2
            </Link>
            <Link to="#" className="block px-2 py-1 hover:bg-gray-100">
              Submenu Item 3
            </Link>
          </div>
        )}

        <Link to={"/blog"} className="block hover:underline">
          Blog
        </Link>
        <Link to={"/contact"} className="block hover:underline">
          Contact
        </Link>

        <button
          className="block w-full text-left text-yellow-200 font-bold hover:underline"
          onClick={() =>
            setIsLimitedSaleDropdownOpen(!isLimitedSaleDropdownOpen)
          }
        >
          LIMITED SALE
        </button>
        {isLimitedSaleDropdownOpen && (
          <div className="bg-white text-black rounded-md shadow-md p-2">
            <Link to="#" className="block px-2 py-1 hover:bg-gray-100">
              Deal 1
            </Link>
            <Link to="#" className="block px-2 py-1 hover:bg-gray-100">
              Deal 2
            </Link>
            <Link to="#" className="block px-2 py-1 hover:bg-gray-100">
              Deal 3
            </Link>
          </div>
        )}

        <Link to={"/product"} className="block hover:underline">
          Best Seller
        </Link>
        <Link to={"/product"} className="block hover:underline">
          New Arrival
        </Link>
      </div>
    </div>
  );
};

export default ButtonBar;
