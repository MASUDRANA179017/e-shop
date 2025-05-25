import React, { useState } from "react";
import { BsTwitter } from "react-icons/bs";
import { FaAngleDown, FaFacebook, FaLinkedin } from "react-icons/fa";

const TopRIghtComponent = () => {
  const Countries = [
    {
      name: "United States",
      code: "US",
      flag: "https://flagcdn.com/16x12/us.png",
    },
    { name: "Canada", code: "CA", flag: "https://flagcdn.com/16x12/ca.png" },
    { name: "Australia", code: "AU", flag: "https://flagcdn.com/16x12/au.png" },
    { name: "Germany", code: "DE", flag: "https://flagcdn.com/16x12/de.png" },
    { name: "France", code: "FR", flag: "https://flagcdn.com/16x12/fr.png" },
    { name: "Italy", code: "IT", flag: "https://flagcdn.com/16x12/it.png" },
    { name: "Spain", code: "ES", flag: "https://flagcdn.com/16x12/es.png" },
  ];
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const handleSelect = (country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex gap-[50px] items-center">
      <div className="flex relative after:content-[''] after:absolute after:w-[2px] after:h-[32px] after:bg-[#BFBFBF] after:top-[50%] after:right-[-20px] after:-translate-y-1/2">
        USD
      </div>
      <div className="flex w-[150px] relative after:content-[''] after:absolute after:w-[2px] after:h-[32px] after:bg-[#BFBFBF] after:top-[50%] after:right-[-20px] after:-translate-y-1/2">
        <div className=" relative w-full ">
          <select
            name="country"
            className="w[150px] hidden "
            value={selectedCountry?.value || ""}
            onChange={(e) => {
              const country = Countries.find((c) => c.value === e.target.value);
              setSelectedCountry(country);
            }}
          >
            {Countries.map((country) => (
              <option key={country.code} value={country.value}>
                {country.name}
              </option>
            ))}
          </select>

          {/* Custom Dropdown */}

          <div
            className="top-0 left-0 w-full h-full bg-white shadow:lg rounded-md z-10"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedCountry ? (
              <div className="flex justify-between items-center gap-2 p-2 cursor-pointer">
                <div className="flex items-center gap-2">
                  <img
                    src={selectedCountry?.flag}
                    alt={selectedCountry?.name}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-['Montserrat']">
                    {selectedCountry?.name}
                  </span>
                </div>
                <FaAngleDown />
              </div>
            ) : (
              <span>Select a Country</span>
            )}
          </div>
          {/* option list*/}
          {isDropdownOpen && (
            <div className="w-full h-full shadow:lg rounded-md z-10">
              <ul className="absolute top-[40px] left-0 w-full h-full rounded-md z-10">
                {Countries.map((country) => (
                  <li
                    key={country.code}
                    className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      handleSelect(country);
                    }}
                  >
                    <img
                      src={country.flag}
                      alt={country.name}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-['Montserrat']">
                      {country.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* Facebook Icon */}
        <a
          href="#" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-white transform hover:scale-125 transition duration-300 ease-in-out
                   rounded-full p-2 hover:bg-blue-600 shadow-md hover:shadow-lg
                   flex items-center justify-center w-10 h-10"
          aria-label="Facebook"
        >
          <FaFacebook className="text-2xl" />
        </a>

        {/* Twitter (X) Icon */}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-white transform hover:scale-125 transition duration-300 ease-in-out
                   rounded-full p-2 hover:bg-blue-400 shadow-md hover:shadow-lg
                   flex items-center justify-center w-10 h-10"
          aria-label="Twitter (X)"
        >
          <BsTwitter className="text-2xl" />
        </a>

        {/* LinkedIn Icon */}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 hover:text-white transform hover:scale-125 transition duration-300 ease-in-out
                   rounded-full p-2 hover:bg-blue-700 shadow-md hover:shadow-lg
                   flex items-center justify-center w-10 h-10"
          aria-label="LinkedIn"
        >
          <FaLinkedin className="text-2xl" />
        </a>
      </div>
    </div>
  );
};

export default TopRIghtComponent;
