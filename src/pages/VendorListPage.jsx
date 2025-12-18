import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPublicStores } from "../@Services/StoreService";

const VendorListPage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPublicStores()
      .then((data) => {
        setStores(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch stores", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p>Loading Vendors...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Vendors</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stores.map((store) => (
          <div
            key={store.id}
            className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {/* Store Banner or Placeholder */}
            <div className="h-40 bg-gray-200 flex items-center justify-center overflow-hidden">
                {/* You can add a banner image here if available in store data */}
                 <span className="text-4xl text-gray-400 font-bold">{store.name.charAt(0)}</span>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-4">
                 {/* Store Logo or Placeholder */}
                 <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl mr-4">
                     {store.name.charAt(0)}
                 </div>
                 <div>
                    <h2 className="text-xl font-bold">{store.name}</h2>
                    <p className="text-sm text-gray-600">{store.category?.name || "General"}</p>
                 </div>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {store.description || "No description available."}
              </p>
              
              <div className="flex justify-between items-center">
                 <span className="text-yellow-500 font-bold">
                    ★ {store.averageRating || "N/A"}
                 </span>
                 <Link
                    to={`/vendor/${store.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                 >
                    Visit Store
                 </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorListPage;
