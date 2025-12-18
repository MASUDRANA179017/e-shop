import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicStoreById } from "../@Services/StoreService";
import { getProductsByStoreId } from "../@Services/ProductService";
import ProductLayout from "../components/commonLayouts/ProductLayout";

const VendorProfilePage = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storeData, productsData] = await Promise.all([
          getPublicStoreById(id),
          getProductsByStoreId(id),
        ]);
        setStore(storeData);
        setProducts(productsData);
      } catch (err) {
        console.error("Failed to fetch vendor data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p>Loading Store...</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p>Store not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Vendor Header / Banner */}
      <div className="bg-white shadow-md">
        <div className="h-48 bg-blue-600 relative">
             {/* Banner Image would go here */}
             <div className="absolute -bottom-12 left-8 md:left-16 flex items-end">
                <div className="w-32 h-32 bg-white rounded-lg shadow-lg p-1">
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-500">
                        {store.name.charAt(0)}
                    </div>
                </div>
                <div className="ml-6 mb-2 text-white">
                    <h1 className="text-3xl font-bold">{store.name}</h1>
                    <p className="text-blue-100">{store.category?.name}</p>
                </div>
             </div>
        </div>
        <div className="container mx-auto px-4 pt-16 pb-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="md:col-span-2">
                     <h3 className="text-xl font-semibold mb-2">About Us</h3>
                     <p className="text-gray-600">{store.description || "No description provided."}</p>
                 </div>
                 <div className="bg-gray-50 p-4 rounded-lg">
                     <h3 className="text-xl font-semibold mb-2">Contact</h3>
                     <p className="text-gray-600">Email: {store.owner?.email}</p>
                     <p className="text-gray-600">Address: {store.address}</p>
                     <p className="text-gray-600">City: {store.city}</p>
                 </div>
             </div>
        </div>
      </div>

      {/* Vendor Products */}
      <div className="container mx-auto px-4 mt-12">
        <h2 className="text-2xl font-bold mb-6">Products from {store.name}</h2>
        
        {products.length === 0 ? (
            <p className="text-gray-500">No products found for this store.</p>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
                <div key={product.id} className="px-2">
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
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default VendorProfilePage;
