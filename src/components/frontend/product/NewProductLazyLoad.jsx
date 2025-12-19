import React, { useEffect, useState } from "react";
import ProductLayout from "../../commonLayouts/ProductLayout";
import { getAllProducts } from "../../../@Services/ProductService";

const PRODUCTS_PER_LOAD = 8;

const NewProductLazyLoad = ({ type = "product", products: propProducts }) => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(PRODUCTS_PER_LOAD);
  const [selectedCategory, setSelectedCategory] = useState("Featured Products");

  useEffect(() => {
    if (propProducts) {
      setProducts(propProducts);
    } else {
      getAllProducts(type)
        .then((data) => {
          const formatted = data.map((item) => ({
            id: item.id,
            img: item.productThumbnail,
            title: item.name,
            description: item.description,
            currentPrice: item.price / 100,
            oldPrice: item.old_price ? item.old_price / 100 : null,
            image: item.productThumbnail || "/frontend/products/product01.png",
            rating: item.rating || 4,
            reviews: item.reviews || [],
            category: item.category || { name: "General" },
            discount: item.discount || null,
            type: item.type,
            stock: item.stock,
          }));
          setProducts(formatted);
        })
        .catch((err) => console.error("Failed to fetch products:", err));
    }
  }, [type, propProducts]);

  const handleLoadMore = () => {
    if (visibleProducts >= products.length) {
      window.location.href = `/product`;
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
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
        {visibleItems.map((product) => (
          <div key={product.id} className="">
             <ProductLayout id={product.id} img={product.image} percentTag={true} roundTag={false} category={product.category.name} stock={product.stock > 0} stockAmount={product.stock} title={product.title} rating={product.rating} totalRating={product.reviews.length} price={product.currentPrice} border="true" bg="transparent" />
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
