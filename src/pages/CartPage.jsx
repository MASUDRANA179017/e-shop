import React from "react";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/commonLayouts/Container";
import { FaTrash, FaMinus, FaPlus, FaCalendarCheck, FaShoppingBag } from "react-icons/fa";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const serviceItems = cartItems.filter(item => item.isService);
  const productItems = cartItems.filter(item => !item.isService);

  const serviceTotal = serviceItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const productTotal = productItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Your Cart is Empty</h2>
          <p className="text-gray-500">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/product"
            className="bg-[#FF624C] text-white px-6 py-2 rounded-md hover:bg-[#ff4f36] transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </Container>
    );
  }

  const handleCheckout = (type) => {
      let itemsToCheckout = [];
      if (type === 'service') {
          itemsToCheckout = serviceItems;
      } else {
          itemsToCheckout = productItems;
      }
      
      if (itemsToCheckout.length === 0) return;

      navigate('/checkout', { 
        state: { 
          checkoutItems: itemsToCheckout,
          checkoutType: type
        } 
      });
  };

  return (
    <Container>
      <div className="py-10">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Cart</h1>

        {/* Services Section */}
        {serviceItems.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <FaCalendarCheck className="text-[#FF624C]" /> Service Bookings
            </h2>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="py-4 px-6 text-sm font-semibold text-gray-600">Service</th>
                        <th className="py-4 px-6 text-sm font-semibold text-gray-600">Booking Date</th>
                        <th className="py-4 px-6 text-sm font-semibold text-gray-600">Price</th>
                        <th className="py-4 px-6 text-sm font-semibold text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {serviceItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              <img
                                src={item.thumbnail || item.image || "https://via.placeholder.com/80"}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-md border border-gray-200"
                              />
                              <div>
                                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                <p className="text-sm text-gray-500">{item.brand?.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-700">
                            {item.bookingDate ? (
                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                    {new Date(item.bookingDate).toLocaleDateString()} {item.bookingTime ? `at ${item.bookingTime}` : ''}
                                </span>
                            ) : (
                                <span className="text-gray-400 italic">No date selected</span>
                            )}
                          </td>
                          <td className="py-4 px-6 font-semibold text-gray-800">
                            {formatPrice(item.price)}
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Remove Service"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Service Summary */}
              <div className="w-full lg:w-80">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                  <h3 className="text-lg font-bold mb-4 text-gray-800">Booking Summary</h3>
                  <div className="flex justify-between mb-4 text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>{formatPrice(serviceTotal)}</span>
                  </div>
                  <button
                    onClick={() => handleCheckout('service')}
                    className="block w-full bg-[#FF624C] text-white text-center py-3 rounded-md font-semibold hover:bg-[#ff4f36] transition-colors shadow-md"
                  >
                    Proceed to Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Section */}
        {productItems.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <FaShoppingBag className="text-blue-600" /> Physical Products
            </h2>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="py-4 px-6 text-sm font-semibold text-gray-600">Product</th>
                        <th className="py-4 px-6 text-sm font-semibold text-gray-600">Price</th>
                        <th className="py-4 px-6 text-sm font-semibold text-gray-600">Quantity</th>
                        <th className="py-4 px-6 text-sm font-semibold text-gray-600">Total</th>
                        <th className="py-4 px-6 text-sm font-semibold text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {productItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              <img
                                src={item.thumbnail || item.image || "https://via.placeholder.com/80"}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-md border border-gray-200"
                              />
                              <div>
                                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                <p className="text-sm text-gray-500">{item.brand?.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-semibold text-gray-800">
                            {formatPrice(item.price)}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1 w-max">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="text-gray-500 hover:text-[#FF624C] transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <FaMinus size={10} />
                              </button>
                              <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="text-gray-500 hover:text-[#FF624C] transition-colors"
                              >
                                <FaPlus size={10} />
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-semibold text-gray-800">
                            {formatPrice(item.price * item.quantity)}
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                 <div className="mt-4 flex justify-end">
                     <button onClick={clearCart} className="text-red-500 hover:underline text-sm">Clear All Items</button>
                 </div>
              </div>
              
              {/* Product Summary */}
              <div className="w-full lg:w-80">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                  <h3 className="text-lg font-bold mb-4 text-gray-800">Order Summary</h3>
                  <div className="flex justify-between mb-2 text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(productTotal)}</span>
                  </div>
                  <div className="flex justify-between mb-4 text-gray-600">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-gray-200 my-4"></div>
                  <div className="flex justify-between mb-6 text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>{formatPrice(productTotal)}</span>
                  </div>
                  <button
                    onClick={() => handleCheckout('product')}
                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-md"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default CartPage;