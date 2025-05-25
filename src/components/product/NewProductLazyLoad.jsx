// components/NewProductLazyLoad.jsx
import React, { useState, useEffect } from "react";
import ProductSingle from "./ProductSingle";

// Sample Product Data
const allProducts = [
  {
    id: 1,
    image: "/frontend/products/product01.png",
    category: "PHONE",
    title: "JPhone 13 High Quality Value Buy Best Cam...",
    rating: 5,
    reviews: 50,
    currentPrice: 999.0,
  },
  {
    id: 2,
    image: "/frontend/products/product01.png",
    category: "AUDIO",
    title: "WH-1000XM4 Wireless Headphones High Qu...",
    rating: 4.5,
    reviews: 120,
    currentPrice: 59.0,
    oldPrice: 118.0,
    discount: "50%",
  },
  {
    id: 3,
    image: "/frontend/products/product01.png",
    category: "LAPTOP",
    title: "S21 Laptop Ultra HD LED Screen Feature 2023 ...",
    rating: 4,
    reviews: 100,
    currentPrice: 1199.0,
  },
  {
    id: 4,
    image: "/frontend/products/product01.png",
    category: "CAMERA",
    title: "Mini Polaroid Camera for Girls with Flash Li...",
    rating: 4,
    reviews: 70,
    currentPrice: 79.0,
  },
  {
    id: 5,
    image: "/frontend/products/product01.png",
    category: "TELEVISION",
    title: "AG OLED65CXPUA 4K Smart OLED TV New ...",
    rating: 3.5,
    reviews: 20,
    currentPrice: 2799.0,
  },
  {
    id: 6,
    image: "/frontend/products/product01.png",
    category: "PHONE",
    title: "Newest Model Smartphone with AI Camera",
    rating: 4.7,
    reviews: 90,
    currentPrice: 899.0,
  },
  {
    id: 7,
    image: "/frontend/products/product01.png",
    category: "SMARTWATCH",
    title: "Smartwatch X20 with Health Tracking & GPS",
    rating: 4.8,
    reviews: 150,
    currentPrice: 249.0,
  },
  {
    id: 8,
    image: "/frontend/products/product01.png",
    category: "AUDIO",
    title: "Bluetooth Earbuds with Long Battery Life",
    rating: 4.2,
    reviews: 60,
    currentPrice: 45.0,
  },
  {
    id: 9,
    image: "/frontend/products/product01.png",
    category: "LAPTOP",
    title: "Lightweight Ultrabook for Business & Travel",
    rating: 4.6,
    reviews: 110,
    currentPrice: 1399.0,
  },
  {
    id: 10,
    image: "/frontend/products/product01.png",
    category: "CAMERA",
    title: "Professional DSLR Camera with 4K Video",
    rating: 4.9,
    reviews: 200,
    currentPrice: 1899.0,
  },
  {
    id: 11,
    image: "/frontend/products/product01.png",
    category: "TELEVISION",
    title: "75-inch 8K Smart TV with Quantum Display",
    rating: 4.3,
    reviews: 30,
    currentPrice: 4999.0,
  },
  {
    id: 12,
    image: "/frontend/products/product01.png",
    category: "PHONE",
    title: "Compact Mini Phone with Dual Sim",
    rating: 3.9,
    reviews: 40,
    currentPrice: 299.0,
  },
];

const PRODUCTS_PER_LOAD = 4;

const NewProductLazyLoad = ({ initialCategory = "All Categories" }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [visibleProducts, setVisibleProducts] = useState(PRODUCTS_PER_LOAD);

  // Derive unique categories from allProducts for the dropdown
  const uniqueCategories = [
    "All Categories",
    ...new Set(allProducts.map((product) => product.category.toUpperCase())),
  ];

  // Filter products based on the selected category state
  const filteredProducts =
    selectedCategory === "All Categories"
      ? allProducts
      : allProducts.filter(
          (product) =>
            product.category.toUpperCase() === selectedCategory.toUpperCase()
        );

  // Reset visible products whenever the selected category changes
  useEffect(() => {
    setVisibleProducts(PRODUCTS_PER_LOAD);
  }, [selectedCategory]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleLoadMore = () => {
    // If all products are already visible, redirect to the category page
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
          {/* Dropdown for Categories */}
          <div className="relative">
            <span>Sort by</span>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="appearance-none bg-gray-100 text-[20px] font-bold py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none  cursor-pointer"
            >
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow to maintain consistency */}
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

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, visibleProducts).map((product) => (
            <ProductSingle key={product.id} product={product} />
          ))}
        </div>

        {/* Load More Button */}
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
