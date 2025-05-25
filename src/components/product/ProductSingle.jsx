
import React from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt, FaShoppingCart, FaHeart, FaShareAlt } from 'react-icons/fa';

const RatingStars = ({ rating, reviews }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="text-yellow-500" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-gray-400" />);
    }
  }
  return (
    <div className="flex items-center text-sm">
      {stars}
      <span className="ml-2 text-gray-500">({reviews})</span>
    </div>
  );
};

const ProductSingle = ({ product }) => {
  return (
    <div className="relative overflow-hidden group"> 
      <div className="bg-gray-200 rounded-lg shadow-md p-4 relative overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] h-full flex flex-col">
        {/* Discount Badge */}
        {product.discount && (
          <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
            {product.discount}
          </span>
        )}

        {/* Hover Action Icons */}
        <div className="absolute top-4 right-4 flex flex-col space-y-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <button className="bg-white p-2 rounded-full shadow-md text-gray-700 hover:text-red-500 transition-colors duration-200">
            <FaShoppingCart className="text-lg" />
          </button>
          <button className="bg-white p-2 rounded-full shadow-md text-gray-700 hover:text-red-500 transition-colors duration-200">
            <FaHeart className="text-lg" />
          </button>
          <button className="bg-white p-2 rounded-full shadow-md text-gray-700 hover:text-red-500 transition-colors duration-200">
            <FaShareAlt className="text-lg" />
          </button>
        </div>

        {/* Product Image */}
        <div className="relative w-full h-48 mb-4 flex items-center justify-center bg-gray-100 rounded-md">
          <img
            src={product.image}
            alt={product.title}
            layout="fill"
            objectFit="cover"
            width={200}
            height={200}
            loading="lazy"
            className="rounded-md"
          />
        </div>

        {/* Product Info */}
        <div className="text-left flex-grow"> 
          <p className="text-gray-400 text-xs uppercase font-medium mb-1">
            {product.category}
          </p>
          <h3 className="text-lg font-semibold text-[#303030] leading-tight mb-2">
            {product.title}
          </h3>
          <RatingStars rating={product.rating} reviews={product.reviews} />
        </div>

        {/* Price Info (at the bottom) */}
        <div className="mt-auto flex items-baseline pt-3"> 
          <span className="text-2xl font-bold text-red-500">
            ${product.currentPrice.toFixed(2)}
          </span>
          {product.oldPrice && (
            <span className="ml-3 text-gray-500 line-through text-md">
              ${product.oldPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSingle;