import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Left Section - Info */}
        <div className="bg-[#FF624C] text-white p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="mb-6 text-lg leading-relaxed">
            We'd love to hear from you! Whether you have a question about our
            products, services, pricing, or anything else, our team is ready to
            answer all your questions.
          </p>

          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-xl" />
              <span>+880 1234 567 890</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-xl" />
              <span>support@example.com</span>
            </li>
            <li className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-xl" />
              <span>Dhaka, Bangladesh</span>
            </li>
          </ul>
        </div>

        {/* Right Section - Form */}
        <div className="p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Us</h2>
          <form className="space-y-5">
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF624C] outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF624C] outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Message
              </label>
              <textarea
                rows="4"
                placeholder="Write your message..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF624C] outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF624C] text-white font-semibold py-3 rounded-lg hover:bg-[#e0523e] transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
