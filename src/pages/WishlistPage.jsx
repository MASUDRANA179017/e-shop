import React from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { Link } from "react-router-dom";
import Container from "../components/commonLayouts/Container";
import { FaTrash, FaShoppingCart, FaCalendarCheck } from "react-icons/fa";

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const handleAddToCart = (product) => {
    addToCart(product);
    // Optional: remove from wishlist after adding to cart
    // removeFromWishlist(product.id);
  };

  if (wishlistItems.length === 0) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Your Wishlist is Empty</h2>
          <p className="text-gray-500">Save items you love to your wishlist.</p>
          <Link
            to="/service"
            className="bg-[#FF624C] text-white px-6 py-2 rounded-md hover:bg-[#ff4f36] transition-colors"
          >
            Explore Products
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-10">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">My Wishlist</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <Link to={`/product/${item.id}`} className="block relative h-48 overflow-hidden group">
                 <img
                  src={item.thumbnail || item.images?.[0] || "https://via.placeholder.com/300"}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </Link>
              
              <div className="p-4">
                <Link to={`/product/${item.id}`}>
                    <h3 className="font-semibold text-gray-800 mb-1 truncate hover:text-[#FF624C] transition-colors">{item.name}</h3>
                </Link>
                <p className="text-sm text-gray-500 mb-3">{item.brand?.name}</p>
                
                <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-[#FF624C]">{formatPrice(item.price)}</span>
                </div>

                <div className="flex gap-2">
                  {(item.isService || item.category?.name?.toLowerCase().includes("service") || item.category?.name?.toLowerCase().includes("booking")) ? (
                      <Link
                        to={`/product/${item.id}`}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-semibold"
                      >
                        <FaCalendarCheck size={14} /> Book Now
                      </Link>
                  ) : (
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
                      >
                        <FaShoppingCart size={14} /> Add to Cart
                      </button>
                  )}
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-gray-500 hover:text-red-500 hover:border-red-500 transition-colors"
                    title="Remove from Wishlist"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default WishlistPage;
