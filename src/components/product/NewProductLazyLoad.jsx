// components/NewProductLazyLoad.jsx
import React, { useState, useEffect } from "react";
import ProductSingle from "./ProductSingle";

const PRODUCTS_PER_LOAD = 5;

const NewProductLazyLoad = ({ initialCategory = "All Categories" }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [visibleProducts, setVisibleProducts] = useState(PRODUCTS_PER_LOAD);

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
        setAllProducts(formatted);
      })
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  const uniqueCategories = [
    "All Categories",
    ...new Set(allProducts.map((product) => product.category.toUpperCase())),
  ];

  const filteredProducts =
    selectedCategory === "All Categories"
      ? allProducts
      : allProducts.filter(
          (product) =>
            product.category.toUpperCase() === selectedCategory.toUpperCase()
        );

  useEffect(() => {
    setVisibleProducts(PRODUCTS_PER_LOAD);
  }, [selectedCategory]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleLoadMore = () => {
    if (visibleProducts >= filteredProducts.length) {
      window.location.href = `/Product-list`;
    } else {
      setVisibleProducts((prevCount) => prevCount + PRODUCTS_PER_LOAD);
    }
  };

  const hasMoreProducts = visibleProducts < filteredProducts.length;
  const buttonText = hasMoreProducts
    ? "Load More"
    : `View All ${selectedCategory}`;

  if (
    filteredProducts.length === 0 &&
    selectedCategory !== "Featured Products"
  ) {
    return (
      <section className="bg-gray-900 py-16 px-4 md:py-20 lg:py-24 text-white text-center">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-4">{selectedCategory}</h2>
          <p>No products found in this category.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 px-4 md:py-20 lg:py-24 text-black">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">{selectedCategory}</h2>
          <div className="relative">
            <span>Sort by</span>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="appearance-none bg-gray-100 text-[20px] font-bold py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none cursor-pointer"
            >
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.95 4.95z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredProducts.slice(0, visibleProducts).map((product) => (
            <ProductSingle key={product.id} product={product} />
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <button
            onClick={handleLoadMore}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewProductLazyLoad;
