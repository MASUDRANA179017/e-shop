import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPublicStores } from "../../@Services/StoreService";

const FeaturedVendors = () => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    getAllPublicStores()
      .then((data) => {
        // Just show first 4 stores
        setStores(data.slice(0, 4));
      })
      .catch((err) => console.error("Failed to fetch featured vendors", err));
  }, []);

  if (stores.length === 0) return null;

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Top Vendors</h2>
          <Link
            to="/vendors"
            className="text-blue-600 font-semibold hover:underline"
          >
            View All Vendors
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stores.map((store) => (
            <Link
              to={`/vendor/${store.id}`}
              key={store.id}
              className="group block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-32 bg-gray-100 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-400 group-hover:text-blue-500 transition-colors">
                  {store.name.charAt(0)}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                  {store.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {store.category?.name || "General"}
                </p>
                <div className="flex items-center text-yellow-500 text-sm">
                  <span className="font-bold mr-1">★</span>
                  {store.averageRating || "N/A"}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedVendors;
