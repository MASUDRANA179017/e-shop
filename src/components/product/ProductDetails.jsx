
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/data/products.json`)
      .then((res) => res.json())
      .then((data) => {
        const foundProduct = data.find((item) => item.id === parseInt(id));
        setProduct(foundProduct || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="p-6">Loading product...</p>;
  if (!product) return <p className="p-6">Product not found.</p>;

  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
      product.reviews.length
      : 4;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Link to="/" className="text-blue-500 hover:underline mb-4 block">
        ← Back to Products
      </Link>

      <div className="bg-white rounded shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>

        <div className="mb-4">
          <strong className="text-xl text-red-600">
            ${product.price}
          </strong>
        </div>


        <p className="text-sm text-gray-500 mb-2">
          Category: {product.category?.name || "Uncategorized"}
        </p>

        <p className="text-sm text-gray-500 mb-2">
          Store: {product.store?.name}
        </p>

        <p className="text-sm text-gray-500 mb-4">
          Vendor: {product.vendor?.firstName} {product.vendor?.lastName}
        </p>

        <p className="text-sm font-semibold">
          ⭐ Rating: {averageRating.toFixed(1)} ({product.reviews.length}{" "}
          reviews)
        </p>

        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Customer Reviews:</h3>
          {product.reviews.length > 0 ? (
            <ul className="space-y-2">
              {product.reviews.map((review) => (
                <li
                  key={review.id}
                  className="border p-2 rounded text-sm text-gray-700"
                >
                  <strong>⭐ {review.rating}</strong> – {review.comment}
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
