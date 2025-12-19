import React, { useEffect, useState } from "react";
import ServiceLayout from "../../commonLayouts/ServiceLayout";
import { getAllProducts } from "../../../@Services/ProductService";

const PRODUCTS_PER_LOAD = 8;

const ServiceLazyLoad = ({ products: propProducts }) => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(PRODUCTS_PER_LOAD);
  const [selectedCategory, setSelectedCategory] = useState("Featured Services");

  useEffect(() => {
    if (propProducts) {
      setProducts(propProducts);
    } else {
      getAllProducts("service")
        .then((data) => {
          const formatted = data.map((item) => ({
            id: item.id,
            img: item.productThumbnail,
            title: item.name,
            description: item.description,
            currentPrice: item.price / 100,
            oldPrice: item.old_price ? item.old_price / 100 : null,
            // Use 2nd image for services (first from gallery)
            image: (item.productGallery && item.productGallery.length > 0) 
                   ? item.productGallery[0] 
                   : (item.productThumbnail || "/frontend/products/product01.png"),
            rating: item.rating || 4,
            reviews: item.reviews || [],
            category: item.category || { name: "General" },
            discount: item.discount || null,
            type: item.type,
            stock: item.stock,
          }));
          setProducts(formatted);
        })
        .catch((err) => console.error("Failed to fetch services:", err));
    }
  }, [propProducts]);

  const handleLoadMore = () => {
    setVisibleProducts((prev) => prev + PRODUCTS_PER_LOAD);
  };

  const hasMoreProducts = visibleProducts < products.length;
  const buttonText = hasMoreProducts
    ? "Load More"
    : `View All ${selectedCategory}`;

  const visibleItems = products.slice(0, visibleProducts);

  if (visibleItems.length === 0 && selectedCategory !== "Featured Services") {
    return (
      <section className="bg-gray-900 py-16 px-4 md:py-20 lg:py-24 text-white text-center">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-4">{selectedCategory}</h2>
          <p>No services found in this category.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
        {visibleItems.map((product) => (
          <div key={product.id} className="">
            <ServiceLayout 
                id={product.id} 
                img={product.image} 
                percentTag={true} 
                roundTag={false} 
                category={product.category.name} 
                stock={product.stock > 0} 
                stockAmount={product.stock} 
                title={product.title} 
                rating={product.rating} 
                totalRating={product.reviews.length} 
                price={product.currentPrice} 
                border="true" 
                bg="transparent" 
            />
          </div>
        ))}
      </div>

      {products.length > PRODUCTS_PER_LOAD && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="bg-[#0071dc] hover:bg-[#005bb5] text-white font-semibold py-2 px-4 rounded"
          >
            {buttonText}
          </button>
        </div>
      )}
    </section>
  );
};

export default ServiceLazyLoad;
