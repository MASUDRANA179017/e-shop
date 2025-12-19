import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { createOrder } from "../@Services/CheckoutService";
import { useNavigate, useLocation } from "react-router-dom";
import Container from "../components/commonLayouts/Container";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart, removeFromCart } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Check for direct buy items from navigation state
  const { checkoutItems: directItems, isDirectBuy, checkoutType } = location.state || {};
  
  // Use direct items if available, otherwise fall back to cart items
  const itemsToCheckout = directItems || cartItems;
  
  const isServiceCheckout = checkoutType === 'service' || itemsToCheckout.some(item => item.isService || item.bookingDate);

  // Calculate total for direct items
  const totalToCheckout = directItems 
     ? directItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
     : cartTotal;

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please login or create an account to proceed with checkout.");
      navigate("/login", { 
        state: { 
          from: "/checkout",
          checkoutState: location.state // Pass current state to be restored later
        } 
      });
    } else {
      // Pre-fill from local storage if available
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.firstName && user.lastName) {
            setName(`${user.firstName} ${user.lastName}`);
          }
          // If user object has phone or address in future, we can pre-fill here too
        }
      } catch (e) {
        console.error("Failed to parse user from local storage");
      }
    }
  }, [navigate, location.state]);

  if (itemsToCheckout.length === 0) {
    navigate("/cart");
    return null;
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address || !name || !phone) {
      alert("Please fill in all required fields (Name, Phone, Address)");
      return;
    }

    setLoading(true);
    try {
      // Map items to order items, ensuring bookingDate is mapped to serviceDate
      const items = itemsToCheckout.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        serviceDate: item.bookingDate || null, // Map bookingDate to serviceDate
      }));

      const payload = {
        shippingAddress: address,
        customerName: name,
        customerPhone: phone,
        notes: notes,
        items: items,
      };

      await createOrder(payload);
      
      // Only clear cart if we are checking out from cart
      if (!isDirectBuy) {
        // clearCart();
        // Remove only the items that were just purchased to preserve other types of items
        itemsToCheckout.forEach(item => {
            removeFromCart(item.id);
        });
      }
      
      // Determine if this was primarily a booking or product order
      const hasBooking = items.some(item => item.serviceDate);
      
      navigate("/success", { 
        state: { 
          isBooking: hasBooking 
        } 
      });
    } catch (err) {
      console.error("Order creation failed", err);
      alert(err?.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="py-10 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Checkout</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            {isDirectBuy ? "Booking/Order Summary" : "Cart Summary"}
          </h2>
          <div className="space-y-4 mb-6">
            {itemsToCheckout.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{item.name} x {item.quantity}</p>
                  {item.bookingDate && (
                    <p className="text-xs text-blue-600 font-bold">
                      Booking: {new Date(item.bookingDate).toLocaleDateString()} {item.bookingTime ? `at ${item.bookingTime}` : ''}
                    </p>
                  )}
                </div>
                <p className="font-semibold text-gray-600">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
            <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(totalToCheckout)}</span>
            </div>
          </div>

          <form onSubmit={handlePlaceOrder}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Full Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Phone Number</label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 234 567 8900"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                  {isServiceCheckout ? "Service Location Address" : "Shipping Address"}
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder={isServiceCheckout ? "Enter the address where service will be performed..." : "Enter your full delivery address..."}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2">
                  {isServiceCheckout ? "Booking Notes / Special Instructions" : "Order Notes / Instructions (Optional)"}
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder={isServiceCheckout ? "Any specific instructions for the service provider..." : "Gate code, special requests, etc."}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-bold py-3 rounded-lg shadow-md transition-colors ${loading ? "opacity-70 cursor-not-allowed" : ""} ${isServiceCheckout ? "bg-blue-600 hover:bg-blue-700" : "bg-[#FF624C] hover:bg-[#ff4f36]"}`}
            >
              {loading ? "Processing..." : (isServiceCheckout ? "Confirm Booking" : "Place Order")}
            </button>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default CheckoutPage;
