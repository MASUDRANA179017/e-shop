import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaRegHeart } from "react-icons/fa";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useCurrency } from "../../../context/CurrencyContext";

const ProductSingle = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  if (!product) return null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Normalize product data for cart
    addToCart({
      id: product.id,
      name: product.title,
      price: product.currentPrice,
      image: product.image,
      thumbnail: product.image, // fallback
      brand: product.brand
    });
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
    } else {
        addToWishlist({
            id: product.id,
            name: product.title,
            price: product.currentPrice,
            image: product.image,
            thumbnail: product.image,
            brand: product.brand
        });
    }
  };

  const isWishlisted = isInWishlist(product.id);

  // console.log("PRODUCT DEBUG:", product);

  return (
    <div className="relative group">
    <Link to={`/product/${product.id}`} className="block">

      <div className="border bg-white border-gray-200 p-4 rounded shadow hover:shadow-lg transition-shadow duration-300 relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-32 object-cover mb-2"
        />
        
        {/* Hover Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <button
                onClick={handleToggleWishlist}
                className={`p-2 rounded-full shadow-md transition-colors ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:text-red-500'}`}
                title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                {isWishlisted ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
              </button>
        </div>


        <p className=" font-montserrat text-sm leading-5 uppercase tracking-wide text-gray-500 mt-5 mb-2">{product.category?.name}</p>
        <h3 className="font-bold text-lg">{product.title}</h3>
        <div className="flex items-center mb-2">
          <span className="text-yellow-500">
            {"★".repeat(Math.round(product.rating))}
            {"☆".repeat(5 - Math.round(product.rating))}
            ({product.reviews?.length || 0})
          </span>

        </div>
        <div className="flex justify-between items-center mt-2">
            <h3 className="text-red-600 font-semibold">{formatPrice(product.currentPrice)}</h3>
            <button
                onClick={handleAddToCart}
                className="bg-gray-100 hover:bg-[#FF624C] hover:text-white text-gray-800 p-2 rounded-full transition-colors duration-300"
                title="Add to Cart"
            >
                <FaShoppingCart size={16} />
            </button>
        </div>
      </div>
    </Link>
    </div>
  );
};

export default ProductSingle;
