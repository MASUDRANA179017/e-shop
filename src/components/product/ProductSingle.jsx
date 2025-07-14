import React from "react";
import { Link } from "react-router-dom";

const ProductSingle = ({ product }) => {
  if (!product) return null;

  console.log("PRODUCT DEBUG:", product);

  return (
    <Link to={`/product/${product.id}`} className="block">

      <div className="border border-gray-200 p-4 rounded shadow hover:shadow-lg transition-shadow duration-300">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-32 object-cover mb-2"
        />

        <p className=" font-montserrat text-sm leading-5 uppercase tracking-wide text-gray-500 mt-5 mb-2">{product.category.name}</p>
        <h3 className="font-bold text-lg">{product.title}</h3>
        <div className="flex items-center mb-2">
          <span className="text-yellow-500">
            {"★".repeat(Math.round(product.rating))}
            {"☆".repeat(5 - Math.round(product.rating))}
            ({product.reviews.length})
          </span>

        </div>
        <h3 className="text-red-600 font-semibold">${product.currentPrice}</h3>
      </div>
    </Link>
  );
};

export default ProductSingle;
