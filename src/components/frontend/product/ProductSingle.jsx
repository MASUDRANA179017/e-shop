import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaRegHeart, FaCalendarCheck } from "react-icons/fa";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useCurrency } from "../../../context/CurrencyContext";
import { toast } from "react-toastify";

const ProductSingle = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  if (!product) return null;

  const isService = product.type === 'service' || (product.category?.name?.toLowerCase().includes("service") || product.category?.name?.toLowerCase().includes("booking"));

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isService) {
        navigate(`/product/${product.id}`);
        return;
    }

    // Normalize product data for cart
    addToCart({
      id: product.id,
      name: product.title,
      price: product.currentPrice,
      image: product.image,
      thumbnail: product.image, // fallback
      brand: product.brand
    });
    toast.success("Added to cart");
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
                className={`p-2 rounded-full transition-colors duration-300 ${isService ? 'bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white' : 'bg-gray-100 hover:bg-[#FF624C] text-gray-800 hover:text-white'}`}
                title={isService ? "Book Now" : "Add to Cart"}
            >
                {isService ? <FaCalendarCheck size={16} /> : <FaShoppingCart size={16} />}
            </button>
        </div>
      </div>
    </Link>
    </div>
  );
};

export default ProductSingle;
