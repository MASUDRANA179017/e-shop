import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getAllPublicStores } from "../@Services/StoreService";
import { getProductsByStoreId } from "../@Services/ProductService";
import { FaSearch, FaStar, FaMapMarkerAlt, FaFilter, FaArrowRight } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { useCurrency } from "../context/CurrencyContext";

const VendorListPage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("relevance");
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storesData = await getAllPublicStores();
        
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

  // Extract unique categories from stores
  const categories = useMemo(() => {
    const cats = stores
      .map((store) => store.category?.name || "General")
      .filter((value, index, self) => self.indexOf(value) === index);
    return ["All", ...cats];
  }, [stores]);

  // Filter stores based on search and category
  const filteredStores = useMemo(() => {
    const base = stores.filter((store) => {
      const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (store.description && store.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || (store.category?.name || "General") === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    const sorted = [...base];
    if (selectedSort === "rating_desc") {
      sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    } else if (selectedSort === "name_asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedSort === "name_desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }
    return sorted;
  }, [stores, searchTerm, selectedCategory, selectedSort]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <div className="relative bg-secondary text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-4 py-20 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Find the Perfect <span className="text-accent">Service</span> <br /> for Your Needs
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Connect with top-rated professionals for home repairs, beauty, cleaning, and more. Quality services at your fingertips.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-white rounded-full p-2 flex shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
            <div className="flex-grow flex items-center px-4">
              <FaSearch className="text-gray-400 text-xl mr-3" />
              <input
                type="text"
                placeholder="What service are you looking for?"
                className="w-full bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold text-lg transition-colors duration-300">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        
        {/* Categories / Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
                selectedCategory === cat
                  ? "bg-primary text-white border-primary shadow-lg scale-105"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-400 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedCategory === "All" ? "All Services" : `${selectedCategory} Services`}
            <span className="text-gray-500 text-lg font-normal ml-2">({filteredStores.length})</span>
          </h2>
          {/* Sort */}
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-600" />
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="border border-gray-300 rounded-md text-sm px-2 py-1 bg-white"
            >
              <option value="relevance">Relevance</option>
              <option value="rating_desc">Top Rated</option>
              <option value="name_asc">Name A–Z</option>
              <option value="name_desc">Name Z–A</option>
            </select>
          </div>
        </div>

        {filteredStores.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No services found</h3>
            <p className="text-gray-500">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row gap-6 p-6">
                  {/* Left: Vendor Image */}
                  <div className="w-full sm:w-48 h-48 flex-shrink-0 relative overflow-hidden rounded-lg bg-gray-100">
                    {store.imageUrl ? (
                      <img
                        src={store.imageUrl}
                        alt={store.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-300">
                        {store.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-700 shadow-sm">
                      {store.category?.name || "General"}
                    </div>
                  </div>

                  {/* Right: Vendor Info */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {store.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="flex items-center mr-4">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span className="font-bold text-gray-700">{store.averageRating || "4.8"}</span>
                          </span>
                          <span className="flex items-center text-gray-500">
                            <FaMapMarkerAlt className="mr-1 text-gray-400" />
                            {store.city || "Available Online"}
                          </span>
                        </div>
                      </div>
                      <div className="hidden sm:block">
                        <span className="inline-flex items-center bg-blue-50 text-blue-600 px-2 py-1 rounded-md border border-blue-100 text-xs font-bold">
                          <MdVerified className="mr-1 text-blue-500" /> Verified
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">
                      {store.description || "Professional services tailored to your needs. Dedicated to quality and customer satisfaction."}
                    </p>

                    {/* Featured Services */}
                    {store.products && store.products.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Popular Services</h4>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                          {store.products.slice(0, 4).map((product) => (
                            <div key={product.id} className="flex-shrink-0 w-24">
                              <div className="w-24 h-16 rounded-md overflow-hidden bg-gray-50 mb-1 border border-gray-100">
                                <img
                                  src={product.productThumbnail || "/frontend/products/product01.png"}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="text-[11px] font-semibold text-gray-800 truncate">{product.name}</div>
                              <div className="text-[11px] text-blue-600 font-bold">{formatPrice(Number(product.price) || 0)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* View Profile */}
                    <div className="mt-4">
                      <Link
                        to={`/vendor/${store.id}`}
                        className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 text-sm"
                      >
                        View Profile <FaArrowRight className="ml-2 text-xs" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How it Works Section */}
      <div className="bg-white py-20 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
                {[
                    { title: "Search", desc: "Find the service you need from our extensive list of professionals.", icon: "🔍" },
                    { title: "Choose", desc: "Compare ratings, reviews, and prices to pick the best match.", icon: "✅" },
                    { title: "Book", desc: "Connect directly and get your service done hassle-free.", icon: "📅" }
                ].map((step, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors duration-300">
                        <div className="text-5xl mb-4">{step.icon}</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                        <p className="text-gray-500">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default VendorListPage;
