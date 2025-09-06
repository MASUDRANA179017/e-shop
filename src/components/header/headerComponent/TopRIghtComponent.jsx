import React, { useEffect, useState } from "react";
import { BsTwitter } from "react-icons/bs";
import { FaAngleDown, FaFacebook, FaLinkedin } from "react-icons/fa";

const TopRightComponent = () => {
  const Countries = [
    { name: "United States", code: "US", flag: "https://flagcdn.com/16x12/us.png", currency: "USD" },
    { name: "Canada", code: "CA", flag: "https://flagcdn.com/16x12/ca.png", currency: "CAD" },
    { name: "Australia", code: "AU", flag: "https://flagcdn.com/16x12/au.png", currency: "AUD" },
    { name: "Germany", code: "DE", flag: "https://flagcdn.com/16x12/de.png", currency: "EUR" },
    { name: "France", code: "FR", flag: "https://flagcdn.com/16x12/fr.png", currency: "EUR" },
    { name: "Italy", code: "IT", flag: "https://flagcdn.com/16x12/it.png", currency: "EUR" },
    { name: "Spain", code: "ES", flag: "https://flagcdn.com/16x12/es.png", currency: "EUR" },
  ];

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const storedCountry = localStorage.getItem("selectedCountry");
    if (storedCountry) {
      setSelectedCountry(JSON.parse(storedCountry));
    } else {
      // Set default country here
      const defaultCountry = Countries[0];
      setSelectedCountry(defaultCountry);
      localStorage.setItem("selectedCountry", JSON.stringify(defaultCountry));
    }
  }, []);

  const handleSelect = (country) => {
    setSelectedCountry(country);
    localStorage.setItem("selectedCountry", JSON.stringify(country));
    setIsDropdownOpen(false);
  };

  const currency = selectedCountry ? selectedCountry.currency : "default";

  return (
    <div className="flex sm:flex-row gap-3 sm:gap-[30px] md:gap-[50px] items-center">
      {/* Currency */}
      <div className="flex relative text-sm md:text-base">
        {currency}
      </div>

      {/* Country Dropdown */}
      <div className="flex relative w-[180px] z-30">
        <div className="relative w-full">
          {/* Custom Dropdown Trigger */}
          <div
            className="w-full border border-gray-300 rounded-md p-2 flex items-center justify-between cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedCountry ? (
              <div className="flex items-center gap-2">
                <img src={selectedCountry.flag} alt={selectedCountry.name} className="w-4 h-4" />
                <span className="text-sm font-['Montserrat'] truncate">{selectedCountry.name}</span>
              </div>
            ) : (
              <span className="text-gray-500 text-sm">Select a Country</span>
            )}
            <FaAngleDown />
          </div>

          {/* Dropdown List */}
          {isDropdownOpen && (
            <ul className="absolute top-[42px] left-0 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-[200px] overflow-y-auto z-5">
              {Countries.map((country) => (
                <li
                  key={country.code}
                  className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect(country)}
                >
                  <img src={country.flag} alt={country.name} className="w-4 h-4" />
                  <span className="text-sm font-['Montserrat']">{country.name}</span>
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
