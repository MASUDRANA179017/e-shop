import React, { useState } from "react";
import { BsTwitter } from "react-icons/bs";
import { FaAngleDown, FaFacebook, FaLinkedin } from "react-icons/fa";
import { MdDarkMode } from "react-icons/md";
import { useCurrency } from "../../../context/CurrencyContext";

const TopRightComponent = () => {
  const { selectedCountry, updateCountry, countries, currency } = useCurrency();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelect = (country) => {
    updateCountry(country);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex sm:flex-row gap-3 sm:gap-[30px] md:gap-[50px] items-center">
      {/* Currency */}
      <div className="flex relative text-sm md:text-base font-bold text-gray-700">
        {currency}
      </div>

      {/* Country Dropdown */}
      <div className="flex relative w-[180px] z-60">
        <div className="relative w-full">
          {/* Custom Dropdown Trigger */}
          <div
            className="w-full border border-gray-300 rounded-md p-2 flex items-center justify-between cursor-pointer bg-white hover:bg-gray-50 transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedCountry ? (
              <div className="flex items-center gap-2">
                <img src={selectedCountry.flag} alt={selectedCountry.name} className="w-5 h-4 object-contain" />
                <span className="text-sm font-['Montserrat'] truncate font-medium">{selectedCountry.name}</span>
              </div>
            ) : (
              <span className="text-gray-500 text-sm">Select a Country</span>
            )}
            <FaAngleDown className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown List */}
          {isDropdownOpen && (
            <ul className="absolute top-[42px] left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-[200px] overflow-y-auto z-50">
              {countries.map((country) => (
                <li
                  key={country.code}
                  className={`flex items-center gap-2 p-2 cursor-pointer hover:bg-red-50 transition-colors ${selectedCountry?.code === country.code ? 'bg-red-50' : ''}`}
                  onClick={() => handleSelect(country)}
                >
                  <img src={country.flag} alt={country.name} className="w-5 h-4 object-contain" />
                  <span className="text-sm font-['Montserrat']">{country.name}</span>
                  <span className="text-xs text-gray-400 ml-auto">{country.currency}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Social Icons */}
      <div className="flex items-center gap-3 sm:gap-4">
        <a
          href="#"
          className="text-blue-600 hover:text-white transform hover:scale-110 transition duration-300 
          rounded-full p-2 hover:bg-blue-600 shadow-md flex items-center justify-center w-9 h-9 md:w-10 md:h-10"
          aria-label="Facebook"
        >
          <FaFacebook className="text-lg md:text-2xl" />
        </a>
        <a
          href="#"
          className="text-blue-400 hover:text-white transform hover:scale-110 transition duration-300 
          rounded-full p-2 hover:bg-blue-400 shadow-md flex items-center justify-center w-9 h-9 md:w-10 md:h-10"
          aria-label="Twitter"
        >
          <BsTwitter className="text-lg md:text-2xl" />
        </a>
        <a
          href="#"
          className="text-blue-700 hover:text-white transform hover:scale-110 transition duration-300 
          rounded-full p-2 hover:bg-blue-700 shadow-md flex items-center justify-center w-9 h-9 md:w-10 md:h-10"
          aria-label="LinkedIn"
        >
          <FaLinkedin className="text-lg md:text-2xl" />
        </a>
      </div>
    </div>
  );
};

export default TopRightComponent;
