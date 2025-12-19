import React from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTwitter,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";

const linksData = [
  { name: "Products List", href: "#" },
  { name: "Order Tracking", href: "#" },
  { name: "Products Guide", href: "#" },
  { name: "Shopping Cart", href: "#" },
  { name: "Tech Blog", href: "#" },
];

const supportsData = [
  { name: "About Us", href: "#" },
  { name: "Privacy Policy", href: "#" },
  { name: "Return Policy", href: "#" },
  { name: "Help Centre", href: "#" },
  { name: "Store Locations", href: "#" },
  { name: "Careers", href: "#" },
];

const categoriesData = [
  { name: "Computers & Tablets", href: "#" },
  { name: "Mobile Phones & Accessories", href: "#" },
  { name: "TV & Home Theater", href: "#" },
  { name: "Audio & Headphones", href: "#" },
  { name: "Cameras & Camcorders", href: "#" },
  { name: "Gaming Equipment", href: "#" },
  { name: "Home Appliances", href: "#" },
];

const socialLinksData = [
  { name: "Twitter", href: "#", icon: FaTwitter },
  { name: "Instagram", href: "#", icon: FaInstagram },
  { name: "Facebook", href: "#", icon: FaFacebook },
];

const FooterTop = () => {
  return (
    <div>
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 pt-12">
        {/* Column 1: Logo and Contact Info */}
        <div className="col-span-1 lg:col-span-1">
          <div className="text-3xl font-bold text-white mb-6">
            e-<span className="text-primary">shop.</span>
          </div>
          <div className="space-y-4">
            {/* Hardcoded contact info as it's typically singular, but could also be mapped */}
            <div className="flex items-center text-gray-300 hover:text-primary transition-colors duration-200">
              <FaPhone className="mr-3 text-lg" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center text-gray-300 hover:text-primary transition-colors duration-200">
              <FaEnvelope className="mr-3 text-lg" />
              <span>information@eshop.com</span>
            </div>
            <div className="flex items-start text-gray-300 hover:text-primary transition-colors duration-200">
              <FaMapMarkerAlt className="mr-3 mt-1 text-lg flex-shrink-0" />
              <span>123 Main Street, Suite 105, Anytown USA</span>
            </div>
          </div>
        </div>

        {/* Column 2: Links - Using map */}
        <div className="col-span-1">
          <h4 className="text-xl font-semibold text-white mb-6">Links</h4>
          <ul className="space-y-3 text-gray-300">
            {linksData.map((link, index) => (
              <li key={index}>
                {" "}
                {/* Using index as key is okay for static lists that don't reorder */}
                <a
                  href={link.href}
                  className="hover:text-primary transition-colors duration-200"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Supports - Using map */}
        <div className="col-span-1">
          <h4 className="text-xl font-semibold text-white mb-6">Supports</h4>
          <ul className="space-y-3 text-gray-300">
            {supportsData.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="hover:text-primary transition-colors duration-200"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Categories - Using map */}
        <div className="col-span-1">
          <h4 className="text-xl font-semibold text-white mb-6">Categories</h4>
          <ul className="space-y-3 text-gray-300">
            {categoriesData.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="hover:text-primary transition-colors duration-200"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 5: Social Media */}
        <div className="col-span-1">
          <h4 className="text-xl font-semibold text-white mb-6">Follow Us</h4>
          <div className="flex space-x-4">
            {socialLinksData.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="text-gray-300 hover:text-primary transition-colors duration-200 text-2xl"
              >
                <social.icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterTop;
