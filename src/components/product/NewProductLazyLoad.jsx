import React, { useEffect, useState } from "react";
import ProductSingle from "./ProductSingle";

const NewProductLazyLoad = () => {
     const [products, setProducts] = useState([]);
  
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
            image: item.image || "/frontend/products/product01.png", // fallback
            rating: item.rating || 4,
            reviews: item.reviews || 100,
            category: item.category || "Laptop",
            discount: item.discount || null,
          }));
          setProducts(formatted);
        })
        .catch((err) => console.error("Failed to fetch products:", err));
    }, []);

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="px-3">
            <ProductSingle product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewProductLazyLoad;
