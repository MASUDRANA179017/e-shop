import React, { useEffect, useState } from "react";
import ProductSingle from "./ProductSingle";
import ProductLayout from "../commonLayouts/ProductLayout";

const PRODUCTS_PER_LOAD = 8;

const NewProductLazyLoad = () => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(PRODUCTS_PER_LOAD);
  const [selectedCategory, setSelectedCategory] = useState("Featured Products");

  useEffect(() => {
    fetch("http://localhost:3000/product/getAll")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item) => ({
          id: item.id,
          title: item.name,
          description: item.description,
          currentPrice: item.price / 100,
          oldPrice: item.old_price ? item.old_price / 100 : null,
          image: item.image || "/frontend/products/product01.png",
          rating: item.rating || 4,
          reviews: item.reviews || 100,
          category: item.category || "Laptop",
          discount: item.discount || null,
        }));
        setProducts(formatted);
      })
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  const handleLoadMore = () => {
    if (visibleProducts >= products.length) {
      window.location.href = `/Product`;
    } else {
      setVisibleProducts((prev) => prev + PRODUCTS_PER_LOAD);
    }
  };

  const hasMoreProducts = visibleProducts < products.length;
  const buttonText = hasMoreProducts
    ? "Load More"
    : `View All ${selectedCategory}`;

  const visibleItems = products.slice(0, visibleProducts);

  if (visibleItems.length === 0 && selectedCategory !== "Featured Products") {
    return (
      <section className="bg-gray-900 py-16 px-4 md:py-20 lg:py-24 text-white text-center">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-4">{selectedCategory}</h2>
          <p>No products found in this category.</p>
        </div>
      </section>
    );
  }


  // console.log(products);
  

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {visibleItems.map((product) => (
          <div key={product.id} className="px-3">
            {/* <ProductSingle product={product} /> */}
            <ProductLayout id={product.id} percentTag={true} roundTag={false} category={product.category.name} stock={false} stockAmount="50" title={product.title} rating={product.rating} totalRating={product.reviews.length} price={product.currentPrice} border="true" bg="transparent" />
          </div>
        ))}
      </div>

      {products.length > PRODUCTS_PER_LOAD && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="bg-[#FF624C] hover:bg-[#FF3B2F] text-white font-semibold py-2 px-4 rounded"
          >
            {buttonText}
          </button>
        </div>
      )}
    </section>
  );
};

export default NewProductLazyLoad;
