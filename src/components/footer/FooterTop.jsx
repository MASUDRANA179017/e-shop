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
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12">
        {/* Column 1: Logo and Contact Info */}
        <div className="col-span-1 lg:col-span-1">
          <div className="text-3xl font-bold text-black mb-6">
            e-<span className="text-red-500">shop.</span>
          </div>
          <div className="space-y-4">
            {/* Hardcoded contact info as it's typically singular, but could also be mapped */}
            <div className="flex items-center text-gray-400 hover:text-primary-orange transition-colors duration-200">
              <FaPhone className="mr-3 text-lg" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center text-gray-400 hover:text-primary-orange transition-colors duration-200">
              <FaEnvelope className="mr-3 text-lg" />
              <span>information@eshop.com</span>
            </div>
            <div className="flex items-start text-gray-400 hover:text-primary-orange transition-colors duration-200">
              <FaMapMarkerAlt className="mr-3 mt-1 text-lg flex-shrink-0" />
              <span>123 Main Street, Suite 105, Anytown USA</span>
            </div>
          </div>
        </div>

        {/* Column 2: Links - Using map */}
        <div className="col-span-1">
          <h4 className="text-xl font-semibold text-black mb-6">Links</h4>
          <ul className="space-y-3">
            {linksData.map((link, index) => (
              <li key={index}>
                {" "}
                {/* Using index as key is okay for static lists that don't reorder */}
                <a
                  href={link.href}
                  className="hover:text-primary-orange transition-colors duration-200"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Supports - Using map */}
        <div className="col-span-1">
          <h4 className="text-xl font-semibold text-black mb-6">Supports</h4>
          <ul className="space-y-3">
            {supportsData.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="hover:text-primary-orange transition-colors duration-200"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Categories - Using map */}
        <div className="col-span-1">
          <h4 className="text-xl font-semibold text-black mb-6">Categories</h4>
          <ul className="space-y-3">
            {categoriesData.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="hover:text-primary-orange transition-colors duration-200"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 5: Payments & Follow Us */}
        <div className="col-span-1">
          {/* Payments - Still assuming direct image usage for now */}
          <h4 className="text-xl font-semibold text-black mb-6">Payments</h4>
          <div className="flex items-center space-x-3 mb-8">
            {/* Uncomment if you have the images in public/images/ */}
            {/* <Image src="/images/visa.png" alt="Visa" width={40} height={25} />
            <Image src="/images/mastercard.png" alt="Mastercard" width={40} height={25} />
            <Image src="/images/paypal.png" alt="PayPal" width={40} height={25} /> */}
          </div>

          {/* Follow Us - Using map */}
          <h4 className="text-xl font-semibold text-black mb-6">Follow Us</h4>
          <div className="flex flex-col space-y-3">
            {socialLinksData.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="flex items-center hover:text-primary-orange transition-colors duration-200"
              >
                {/* React component for the icon */}
                <link.icon className="mr-3 text-lg" /> {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default FooterTop;
