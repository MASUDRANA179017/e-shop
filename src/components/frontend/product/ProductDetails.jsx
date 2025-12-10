// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductImageSlider from "../../commonLayouts/ProductImageSlide";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [storeProducts, setStoreProducts] = useState([]);

  const country = localStorage.getItem("selectedCountry")
  const { code, currency, flag, name } = country;



  useEffect(() => {
    fetch("http://localhost:3000/product/getAll")
      .then((res) => res.json())
      .then((data) => {
        const foundProduct = data.find((item) => item.id === parseInt(id));
        setProduct(foundProduct || null);

        if (foundProduct) {
          setRelatedProducts(
            data.filter(
              (p) => p.category?.id === foundProduct.category?.id && p.id !== foundProduct.id
            )
          );

          setStoreProducts(
            data.filter(
              (p) => p.store?.id === foundProduct.store?.id && p.id !== foundProduct.id
            )
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    alert(`${product.name} added to cart!`);
  };

  if (loading) return <p className="p-6 text-center">Loading product...</p>;
  if (!product) return <p className="p-6 text-center">Product not found.</p>;

  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 4;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <Link to="/" className="text-blue-500 hover:underline mb-6 block">
        ← Back to Products
      </Link>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Product Slider */}
        <div className="lg:w-1/2 shadow-lg rounded-lg overflow-hidden">
          <ProductImageSlider product={product} />
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-gray-700 text-lg">{product.description}</p>

          <div className="flex items-center gap-2 mt-2">
            {flag && <img src={flag} alt={name} className="w-6 h-4 rounded" />}
            {code && <span className="text-gray-600 text-sm">{code}</span>}
            <div className="text-3xl text-red-600 font-bold">
              {currency || "$"} {product.price}
            </div>
          </div>



          <div className="mt-2 text-gray-600 text-sm space-y-1">
            <p>
              Category: <span className="font-medium">{product.category?.name || "Uncategorized"}</span>
            </p>
            <p>
              Vendor: <span className="font-medium">{product.vendor?.firstName} {product.vendor?.lastName}</span>
            </p>
          </div>

          <div className="mt-4">
            <p className="font-semibold">
              ⭐ Rating: {averageRating.toFixed(1)} ({product.reviews.length} reviews)
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Add to Cart
          </button>

          {/* Facilities */}
          <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold mb-2">Facilities & Services</h3>
            <ul className="grid grid-cols-2 gap-2 text-gray-700">
              <li> Free Delivery</li>
              <li>30 Days Return</li>
              <li> 1 Year Warranty</li>
              <li>24/7 Support</li>
            </ul>
          </div>

          {/* Customer Reviews */}
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-3">Customer Reviews</h3>
            {product.reviews.length > 0 ? (
              <ul className="space-y-3 max-h-64 overflow-y-auto">
                {product.reviews.map((review) => (
                  <li key={review.id} className="border p-3 rounded-lg text-gray-700 shadow-sm">
                    <div className="flex justify-between">
                      <strong>⭐ {review.rating}</strong>
                      <span className="text-sm text-gray-500">{review.date || ""}</span>
                    </div>
                    <p className="mt-1">{review.comment}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-4">Related Products</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                className="border rounded-lg p-3 hover:shadow-lg transition-transform transform hover:scale-105"
              >
                <img
                  src={p.productThumbnail || "/frontend/products/product01.png"}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded"
                />
                <h4 className="mt-2 text-sm font-semibold">{p.name}</h4>
                <p className="text-red-600 font-semibold">${p.price}</p>
                <Link
                  to={`/product/${p.id}`}
                  className="text-blue-500 text-xs hover:underline"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Store Details with banner, logo, and products */}
      {product.store && (
        <div className="mt-16">
          {/* Banner */}
          {product.store.bannerUrl && (
            <div className="w-full h-48 sm:h-64 rounded-lg overflow-hidden mb-4 shadow-md">
              <img
                src={product.store.bannerUrl}
                alt={product.store.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-4 mb-4">
            {/* Logo */}
            {product.store.logoUrl ? (
              <img
                src={product.store.logoUrl}
                alt={product.store.name}
                className="w-16 h-16 rounded-full border shadow-sm object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                {product.store.name.charAt(0)}
              </div>
            )}

            <div>
              <h3 className="text-2xl font-bold">{product.store.name}</h3>
              <p className="text-gray-600">{product.store.description}</p>
            </div>
          </div>

          {/* Store Products */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-4">
            {storeProducts.length > 0 ? (
              storeProducts.map((p) => (
                <div
                  key={p.id}
                  className="border rounded-lg p-3 hover:shadow-lg transition-transform transform hover:scale-105"
                >
                  <img
                    src={p.productThumbnail || "/frontend/products/product01.png"}
                    alt={p.name}
                    className="w-full h-40 object-cover rounded"
                  />
                  <h4 className="mt-2 text-sm font-semibold">{p.name}</h4>
                  <p className="text-red-600 font-semibold">${p.price}</p>
                  <Link
                    to={`/product/${p.id}`}
                    className="text-blue-500 text-xs hover:underline"
                  >
                    View
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No other products in this store.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
