import React from "react";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { Link } from "react-router-dom";
import Container from "../components/commonLayouts/Container";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { formatPrice } = useCurrency();

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

  return (
    <Container>
      <div className="py-10">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
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
                  {cartItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.thumbnail || item.images?.[0] || "https://via.placeholder.com/80"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md border border-gray-200"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-800">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.brand?.name}</p>
                            {item.bookingDate && (
                              <p className="text-xs text-blue-600 font-bold mt-1 bg-blue-50 px-2 py-1 rounded inline-block">
                                Booking: {new Date(item.bookingDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-800">{formatPrice(item.price)}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 border border-gray-300 rounded-md w-max px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="text-gray-500 hover:text-[#FF624C] disabled:opacity-50"
                          >
                            <FaMinus size={12} />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-gray-500 hover:text-[#FF624C]"
                          >
                            <FaPlus size={12} />
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
             <div className="mt-6 flex justify-between items-center">
                <Link to="/product" className="px-6 py-2 border border-[#FF624C] text-[#FF624C] rounded-md hover:bg-[#FF624C] hover:text-white transition-colors font-medium">
                    Continue Shopping
                </Link>
                 <button onClick={clearCart} className="px-6 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors font-medium">
                    Clear Cart
                </button>
             </div>
          </div>

          {/* Cart Summary */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Cart Summary</h2>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between mb-4 text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="flex justify-between mb-6 text-lg font-bold text-gray-800">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <Link
                to="/checkout" // You might need to create this route later or point to login
                className="block w-full bg-[#FF624C] text-white text-center py-3 rounded-md font-semibold hover:bg-[#ff4f36] transition-colors shadow-md"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CartPage;
