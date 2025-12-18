// components/ButtonBar.jsx
import React, { useEffect, useRef, useState } from "react";
import { FaBars, FaFire, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import Container from "../commonLayouts/Container";
import { getAllCategory } from "../../@Services/CategoryService";

const ButtonBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLimitedSaleDropdownOpen, setIsLimitedSaleDropdownOpen] =
    useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const productRef = useRef(null);
  const saleRef = useRef(null);

  useEffect(() => {
    // Fetch categories
    getAllCategory()
      .then((data) => {
        setCategories(data);
      })
      .catch(err => console.error("Failed to fetch categories", err));
  }, []);

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
            <li>
              <Link to={"/"} className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to={"/vendors"} className="hover:underline">
                Vendors
              </Link>
            </li>
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
                      <Link to="/product">Submenu Item 1</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100">
                      <Link to="/product">Submenu Item 2</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100">
                      <Link to="/product">Submenu Item 3</Link>
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
        <ul className="space-y-4 font-medium h-[calc(100vh-100px)] overflow-y-auto pb-10 scrollbar-hide">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <li key={cat.id}>
                <div className="font-bold mb-1 text-gray-800 hover:text-[#FF624C] transition-colors">
                  <Link to={`/product?category=${cat.id}`} onClick={() => setIsCategoryDrawerOpen(false)}>
                    {cat.name}
                  </Link>
                </div>
                {cat.children && cat.children.length > 0 && (
                  <ul className="pl-3 space-y-1 text-sm text-gray-600 border-l-2 border-gray-100">
                    {cat.children.map(sub => (
                      <li key={sub.id}>
                        <Link to={`/product?category=${sub.id}`} onClick={() => setIsCategoryDrawerOpen(false)} className="hover:text-[#FF624C] block py-0.5 transition-colors">
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Loading categories...</p>
          )}
        </ul>
      </div>

      
    </div>
  );
};

export default ButtonBar;
