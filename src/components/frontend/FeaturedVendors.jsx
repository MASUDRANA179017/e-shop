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
              className="group block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 relative bg-white"
            >
              {/* Cover Image */}
              <div className="h-32 bg-gray-200 relative overflow-hidden">
                {store.coverImage ? (
                  <img 
                    src={store.coverImage} 
                    alt={store.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                     <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                     <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold opacity-30">
                        {store.name.charAt(0)}
                     </div>
                  </div>
                )}
              </div>

              {/* Logo & Content */}
              <div className="p-4 pt-10 relative">
                 {/* Floating Logo */}
                <div className="absolute -top-8 left-4 w-16 h-16 bg-white rounded-lg shadow-md p-1">
                   {store.imageUrl ? (
                     <img 
                       src={store.imageUrl} 
                       alt={store.name} 
                       className="w-full h-full object-cover rounded-md" 
                     />
                   ) : (
                     <div className="w-full h-full bg-blue-50 rounded-md flex items-center justify-center text-blue-600 text-xl font-bold">
                       {store.name.charAt(0)}
                     </div>
                   )}
                </div>

                <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-1 truncate">
                  {store.name}
                </h3>
                <p className="text-sm text-blue-500 font-medium mb-2 truncate">
                  {store.category?.name || "General"}
                </p>
                <div className="flex items-center justify-between">
                   <div className="flex items-center text-yellow-400 text-sm">
                      <span className="font-bold mr-1">★</span>
                      <span className="text-gray-600 font-semibold">{store.averageRating || "4.8"}</span>
                   </div>
                   <span className="text-xs text-gray-400">View Profile</span>
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
