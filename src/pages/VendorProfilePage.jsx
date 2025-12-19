import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicStoreById, followStore, unfollowStore, checkFollowStatus } from "../@Services/StoreService";
import { getProductsByStoreId } from "../@Services/ProductService";
import ProductLayout from "../components/commonLayouts/ProductLayout";
import ServiceLayout from "../components/commonLayouts/ServiceLayout";
import { FaMapMarkerAlt, FaEnvelope, FaStar, FaPhone, FaGlobe, FaUserPlus, FaUserCheck } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { getVendorBlogs } from "../@Services/BlogService";
import BlogCardLayout from "../components/commonLayouts/BlogCardLayout";

const VendorProfilePage = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storeData, productsData] = await Promise.all([
          getPublicStoreById(id),
          getProductsByStoreId(id),
        ]);
        setStore(storeData);
        setProducts(productsData);
        if (storeData?.owner?.id) {
          try {
            const vendorBlogs = await getVendorBlogs(storeData.owner.id, 3);
            setBlogs(Array.isArray(vendorBlogs) ? vendorBlogs : []);
          } catch (err) {
            console.error(err);
          }
        }

        // Check follow status
        try {
            const status = await checkFollowStatus(id);
            setIsFollowing(status.isFollowing);
        } catch {
            console.log("Not logged in or error checking follow status");
        }

      } catch (err) {
        console.error("Failed to fetch vendor data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowStore(id);
        setIsFollowing(false);
      } else {
        await followStore(id);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Failed to toggle follow status", error);
      alert("Please login to follow this store.");
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-700">Store not found.</h2>
        <p className="text-gray-500 mt-2">The vendor you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16 font-sans">
      {/* Vendor Header / Banner */}
      <div className="bg-white shadow-md relative">
        {/* Banner Background */}
        <div className="h-64 relative overflow-hidden bg-gray-200">
            {store.coverImage ? (
                 <img src={store.coverImage} alt="Cover" className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-secondary relative">
                     <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                     {/* Decorative Circles */}
                     <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
                     <div className="absolute bottom-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
                </div>
            )}
        </div>

        <div className="container mx-auto px-4">
             <div className="relative -mt-20 mb-6 flex flex-col md:flex-row items-end md:items-end">
                {/* Profile Image */}
                <div className="w-40 h-40 bg-white rounded-2xl shadow-xl p-2 z-10">
                    <div className="w-full h-full bg-orange-50 rounded-xl flex items-center justify-center text-6xl font-bold text-primary border border-orange-100 overflow-hidden">
                        {store.imageUrl ? (
                            <img src={store.imageUrl} alt={store.name} className="w-full h-full object-cover" />
                        ) : (
                            store.name.charAt(0)
                        )}
                    </div>
                </div>
                
                {/* Vendor Info */}
                <div className="mt-4 md:mt-0 md:ml-6 flex-grow pb-2">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-end">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 flex items-center">
                                {store.name}
                                <MdVerified className="text-primary ml-2 text-2xl" title="Verified Vendor" />
                            </h1>
                            <p className="text-secondary font-medium text-lg mb-2">{store.category?.name || "Professional Service"}</p>
                            
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                                <span className="flex items-center mr-4">
                                    <FaStar className="text-yellow-400 mr-1" />
                                    <span className="font-bold text-gray-700">{store.averageRating || "4.8"}</span>
                                    <span className="ml-1">(120 Reviews)</span>
                                </span>
                                <span className="flex items-center">
                                    <FaMapMarkerAlt className="mr-1 text-gray-400" />
                                    {store.city}, {store.address || "USA"}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3 mt-4 md:mt-0">
                            <button className="px-6 py-2 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-orange-600 transition-colors">
                                Contact
                            </button>
                            <button 
                                onClick={handleFollow}
                                disabled={followLoading}
                                className={`px-6 py-2 font-bold border rounded-lg shadow-sm transition-colors flex items-center ${
                                    isFollowing 
                                    ? "bg-orange-50 text-primary border-orange-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200" 
                                    : "bg-white text-primary border-orange-200 hover:bg-orange-50"
                                }`}
                            >
                                {isFollowing ? (
                                    <>
                                        <FaUserCheck className="mr-2" /> Following
                                    </>
                                ) : (
                                    <>
                                        <FaUserPlus className="mr-2" /> Follow
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
             </div>
             
             {/* Tabs / Navigation (Mock) */}
             <div className="flex space-x-8 border-b border-gray-200 text-gray-500 font-medium overflow-x-auto">
                 <button className="pb-3 border-b-2 border-primary text-primary">Services & Products</button>
                 <button className="pb-3 border-b-2 border-transparent hover:text-gray-800">About</button>
                 <button className="pb-3 border-b-2 border-transparent hover:text-gray-800">Reviews</button>
                 <button className="pb-3 border-b-2 border-transparent hover:text-gray-800">Policies</button>
             </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar / About */}
          <div className="md:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">About Vendor</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {store.description || "We provide top-notch services with a focus on quality and customer satisfaction. Our team is dedicated to meeting your needs."}
                  </p>
                  
                  <div className="space-y-3 text-sm">
                      {store.owner?.email && (
                          <div className="flex items-center text-gray-600">
                              <FaEnvelope className="mr-3 text-secondary" />
                              <span className="truncate">{store.owner.email}</span>
                          </div>
                      )}
                      <div className="flex items-center text-gray-600">
                          <FaPhone className="mr-3 text-secondary" />
                          <span>+1 (555) 123-4567</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                          <FaGlobe className="mr-3 text-secondary" />
                          <span>www.website.com</span>
                      </div>
                  </div>
              </div>

              {/* Opening Hours Mock */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Opening Hours</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between"><span>Mon - Fri</span> <span>9:00 AM - 6:00 PM</span></div>
                      <div className="flex justify-between"><span>Sat</span> <span>10:00 AM - 4:00 PM</span></div>
                      <div className="flex justify-between text-red-500"><span>Sun</span> <span>Closed</span></div>
                  </div>
              </div>
          </div>

          {/* Main Content / Products */}
          <div className="md:col-span-3">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Available Services</h2>
                <div className="text-sm text-gray-500">Showing {products.length} results</div>
            </div>
            
            {products.length === 0 ? (
                <div className="bg-white p-12 rounded-xl text-center shadow-sm">
                    <p className="text-gray-500 text-lg">No services or products found for this vendor.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id}>
                    {product.isService ? (
                        <ServiceLayout
                            id={product.id}
                            img={(product.isService && product.productGallery && product.productGallery.length > 0) ? product.productGallery[0] : (product.productThumbnail || "/frontend/products/product01.png")}
                            percentTag={product.discount > 0}
                            roundTag={false}
                            category={product.category?.name}
                            stock={product.stock > 0}
                            stockAmount={product.stock}
                            title={product.name}
                            rating={product.rating || 4}
                            totalRating={product.reviews?.length || 0}
                            price={product.price / 100}
                            border="true"
                            bg="white"
                        />
                    ) : (
                        <ProductLayout
                            id={product.id}
                            img={product.productThumbnail || "/frontend/products/product01.png"}
                            percentTag={product.discount > 0}
                            roundTag={false}
                            category={product.category?.name}
                            stock={product.stock > 0}
                            stockAmount={product.stock}
                            title={product.name}
                            rating={product.rating || 4}
                            totalRating={product.reviews?.length || 0}
                            price={product.price / 100}
                            border="true"
                            bg="white"
                        />
                    )}
                    </div>
                ))}
                </div>
            )}
            {blogs.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Latest Blogs</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs.slice(0, 3).map((b) => (
                    <BlogCardLayout
                      key={b.id}
                      id={b.id}
                      slug={b.slug || String(b.id)}
                      title={b.title}
                      image={b.image || b.thumbnail}
                      author={b.author || store?.owner?.firstName || "Author"}
                      createdAt={b.createdAt || ""}
                      content={b.content || ""}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default VendorProfilePage;
