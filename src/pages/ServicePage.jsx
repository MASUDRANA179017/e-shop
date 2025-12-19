import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getAllPublicStores } from "../@Services/StoreService";
import { getProductsByStoreId } from "../@Services/ProductService";
import { FaSearch, FaStar, FaMapMarkerAlt, FaFilter, FaArrowRight, FaBars, FaTimes } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import SidebarFilter from "../components/frontend/SidebarFilter";

const ServicePage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storesData] = await Promise.all([
          getAllPublicStores()
        ]);

        // Fetch products for each store
        const storesWithProducts = await Promise.all(
          storesData.map(async (store) => {
            try {
              const products = await getProductsByStoreId(store.id);
              return { ...store, products };
            } catch (err) {
              console.error(`Failed to fetch products for store ${store.id}`, err);
              return { ...store, products: [] };
            }
          })
        );
        setStores(storesWithProducts);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter stores based on search and category
  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = store.name.toLowerCase().includes(term) ||
                            (store.description && store.description.toLowerCase().includes(term)) ||
                            (store.address && store.address.toLowerCase().includes(term)) ||
                            (store.city && store.city.toLowerCase().includes(term));
      
      const matchesCategory = selectedCategory === "All" || 
                              (store.category?.name || "General") === selectedCategory ||
                              (store.products && store.products.some(p => p.category?.name === selectedCategory));
      
      return matchesSearch && matchesCategory;
    });
  }, [stores, searchTerm, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-30">
        <span className="font-bold text-gray-800">Filters</span>
        <button onClick={() => setShowMobileSidebar(!showMobileSidebar)} className="text-gray-600">
          {showMobileSidebar ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Sidebar */}
          <div className={`w-full md:w-1/4 bg-white md:bg-transparent p-4 md:p-0 rounded-lg shadow-lg md:shadow-none fixed md:static inset-0 z-20 overflow-y-auto md:overflow-visible transition-transform duration-300 ${showMobileSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-4">
              <div className="flex justify-between items-center mb-6 md:hidden">
                <h3 className="font-bold text-xl">Filters</h3>
                <button onClick={() => setShowMobileSidebar(false)}><FaTimes /></button>
              </div>

              {/* Search */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FaSearch className="text-secondary" /> Search
                </h3>
                <input
                  type="text"
                  placeholder="Find service..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Categories */}
              <SidebarFilter 
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                showBrands={false}
                showPrice={false}
                clean={true}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            {/* Header */}
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedCategory === "All" ? "All Services" : `${selectedCategory} Services`}
                <span className="ml-3 text-sm font-normal text-gray-500 bg-white px-2 py-1 rounded-full border border-gray-200">
                  {filteredStores.length} results
                </span>
              </h2>
            </div>

            {/* Grid */}
            {filteredStores.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredStores.map((store) => (
                  <div key={store.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Store Image */}
                      <div className="w-full sm:w-48 h-48 flex-shrink-0 relative overflow-hidden rounded-lg bg-gray-100">
                         {store.imageUrl ? (
                           <img src={store.imageUrl} alt={store.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-300">
                             {store.name.charAt(0)}
                           </div>
                         )}
                         <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-700 shadow-sm">
                           {store.category?.name || "General"}
                         </div>
                      </div>

                      {/* Content */}
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors">
                            {store.name}
                            {store.isVerified && <MdVerified className="inline-block ml-1 text-primary" />}
                          </h3>
                          <div className="flex items-center gap-1 text-yellow-400 text-sm bg-yellow-50 px-2 py-1 rounded-full">
                            <FaStar /> <span className="font-bold text-gray-700">{store.rating || "4.8"}</span>
                          </div>
                        </div>

                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{store.description}</p>

                        {/* Store Products Preview */}
                        {store.products && store.products.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Popular Services</h4>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                              {store.products.slice(0, 4).map((product) => (
                                <div key={product.id} className="flex-shrink-0 w-20 group/prod">
                                  <div className="w-20 h-16 rounded-md overflow-hidden bg-gray-50 mb-1 border border-gray-100">
                                    <img 
                                      src={product.productThumbnail || "https://via.placeholder.com/150"} 
                                      alt={product.name} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <p className="text-[10px] font-medium text-gray-700 truncate">{product.name}</p>
                                  <p className="text-[10px] text-primary font-bold">${(product.price / 100).toFixed(2)}</p>
                                </div>
                              ))}
                              {store.products.length > 4 && (
                                <div className="flex-shrink-0 w-20 h-16 flex items-center justify-center bg-gray-50 rounded-md border border-gray-100 text-xs text-gray-500 font-medium">
                                  +{store.products.length - 4} more
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                          <div className="flex items-center text-gray-500 text-sm">
                            <FaMapMarkerAlt className="mr-1 text-gray-400" />
                            {store.address || "Dhaka, Bangladesh"}
                          </div>
                          <Link
                            to={`/vendor/${store.id}`}
                            className="inline-flex items-center text-primary font-semibold hover:text-orange-600 text-sm"
                          >
                            View Profile <FaArrowRight className="ml-2 text-xs" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-300 text-6xl mb-4 flex justify-center"><FaSearch /></div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No services found</h3>
                <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
                <button 
                  onClick={() => {setSearchTerm(""); setSelectedCategory("All");}}
                  className="mt-6 text-primary font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;
