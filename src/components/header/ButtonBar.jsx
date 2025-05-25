// components/ButtonBar.jsx
import React from "react";
import { FaBars, FaChevronDown, FaFire } from "react-icons/fa";
import Container from "../commonLayouts/Container";
import { Link } from "react-router-dom";

// Data for Left Navigation Items
const leftNavItems = [
  {
    id: 1,
    label: "All Categories",
    icon: FaBars,
    hasDropdown: false,
    link: "#",
  },
  {
    id: 2,
    label: "Home",
    icon: null,
    hasDropdown: false,
    link: "/",
  },
  {
    id: 3,
    label: "Products",
    icon: null,
    hasDropdown: true,
    link: "#",
  },
  {
    id: 4,
    label: "Blog",
    icon: null,
    hasDropdown: false,
    link: "/",
  },
  {
    id: 5,
    label: "Contact",
    icon: null,
    hasDropdown: false,
    link: "#",
  },
];

// Data for Right Navigation Items
const rightNavItems = [
  {
    id: 1,
    label: "LIMITED SALE",
    icon: FaFire,
    hasDropdown: true,
    color: "text-orange-300",
    link: "#",
  },
  {
    id: 2,
    label: "Best Seller",
    icon: null,
    hasDropdown: false,
    link: "#",
  },
  {
    id: 3,
    label: "New Arrival",
    icon: null,
    hasDropdown: false,
    link: "#",
  },
];

const ButtonBar = () => {
  return (
    <div className="w-full bg-[#FF624C] text-white sticky top-0 z-50">
      <Container>
        <div className="p-4 flex items-center justify-between">
          {/* Left Nav Items */}
          <ul className="flex items-center space-x-8">
            {leftNavItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center cursor-pointer hover:underline"
              >
                <Link to={item.link} className="flex items-center">
                  {item.icon && <item.icon className="mr-2" />}
                  {item.label}
                  {item.hasDropdown && (
                    <FaChevronDown className="ml-1 text-xs" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Nav Items */}
          <ul className="flex items-center space-x-8">
            {rightNavItems.map((item) => (
              <li
                key={item.id}
                className={`flex items-center cursor-pointer hover:underline ${
                  item.label === "LIMITED SALE" ? "font-bold" : ""
                }`}
              >
                {item.icon && (
                  <item.icon className={`mr-1 ${item.color || ""}`} />
                )}
                {item.label}
                {item.hasDropdown && <FaChevronDown className="ml-1 text-xs" />}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  );
};

export default ButtonBar;
