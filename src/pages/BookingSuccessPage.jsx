import React from "react";
import { Link, useLocation } from "react-router-dom";
import Container from "../components/commonLayouts/Container";
import { FaCheckCircle } from "react-icons/fa";

const BookingSuccessPage = () => {
  const location = useLocation();
  const { isBooking } = location.state || { isBooking: false };

  return (
    <Container>
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
          <div className="flex justify-center">
            <FaCheckCircle className="h-24 w-24 text-green-500" />
          </div>
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isBooking ? "Booking Confirmed!" : "Order Placed Successfully!"}
          </h2>
          
          <p className="mt-2 text-sm text-gray-600">
            {isBooking 
              ? "Your service has been successfully booked. You can view the details in your dashboard."
              : "Thank you for your purchase. Your order has been received and is being processed."
            }
          </p>

          <div className="mt-8 space-y-4">
            <Link
              to={isBooking ? "/dashboard/user/bookings" : "/dashboard/user/orders"}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              View {isBooking ? "My Bookings" : "My Orders"}
            </Link>
            
            <Link
              to="/service"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default BookingSuccessPage;
