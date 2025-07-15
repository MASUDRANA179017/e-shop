// components/ButtonBar.jsx
import React, { use, useEffect, useRef, useState } from "react";
import { FaBars, FaChevronDown, FaFire } from "react-icons/fa";
import Container from "../commonLayouts/Container";
import { Link } from "react-router-dom";



const ButtonBar = () => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLimitedSaleDropdownOpen, setIsLimitedSaleDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLimitedSaleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleLimitedSaleDropdownToggle = () => {
    setIsLimitedSaleDropdownOpen(!isLimitedSaleDropdownOpen);
  };


  return (
    <div className="w-full bg-[#FF624C] text-white sticky top-0 z-50">
      <Container>
        <div className="p-4 flex items-center justify-between">
          {/* Left Nav Items */}
          <ul className="flex items-center space-x-8">

            <li>
              <Link to={'/'} className="flex items-center">
                <FaBars className="mr-2" />
                <span>All Categories</span>
              </Link>
            </li>
            <li className="relative group" ref={dropdownRef}>
              <button
                onClick={handleDropdownToggle}
                className="flex items-center"
              >
                Product
              </button>
              {isDropdownOpen && (
                <div ref={dropdownRef} className="absolute top-[50px] left-0 bg-white text-black shadow-lg rounded-md w-48">
                  <ul className='py-2 font-["Montserrat"] text-base leading-6 text-black'>
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
              <Link to={'/product'} className="flex items-center">
                <span>Blog</span>
              </Link>
            </li>
            <li>
              <Link to={'/product'} className="flex items-center">
                <span>Contact</span>
              </Link>
            </li>

          </ul>

          {/* Right Nav Items */}
          <ul className="flex items-center space-x-8">

            <li className="relative group" ref={dropdownRef}>
              <button onClick={handleLimitedSaleDropdownToggle} className="flex items-center">
                LIMITED SALE
                <FaFire className="mr-2" />
              </button>
              {isLimitedSaleDropdownOpen && (
                <div ref={dropdownRef} className="absolute top-[50px] left-0 bg-white text-black shadow-lg rounded-md w-48">
                  <ul className='py-2 font-["Montserrat"] text-base leading-6 text-black'>
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
              <Link to={'/product'} className="flex items-center gap-2">
                <span>Best Seller</span>
              </Link>
            </li>
            <li>
              <Link to={'/product'} className="flex items-center">
                <span>New Arrival</span>
              </Link>
            </li>

            <div className="absolute top-[20px] left-0 hidden group-hover:block bg-white text-black shadow-lg rounded-md w-48">
              <ul className="py-2">
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

          </ul>
        </div>
      </Container>
    </div>
  );
};

export default ButtonBar;
