import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductSingle from "./ProductSingle";
import Slider from "react-slick";
import { Link } from "react-router-dom";



const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-slick-arrow next-arrow`}
      style={{ ...style, display: "block", right: "-40px", zIndex: 10 }}
      onClick={onClick}
    >
      <FaChevronRight className="text-white text-3xl bg-gray-700 hover:bg-gray-600 rounded-full p-2" />
    </div>
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-slick-arrow prev-arrow`}
      style={{ ...style, display: "block", left: "-40px", zIndex: 10 }}
      onClick={onClick}
    >
      <FaChevronLeft className="text-white text-3xl bg-gray-700 hover:bg-gray-600 rounded-full p-2" />
    </div>
  );
};

const ProductSlider = () => {
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
  // console.log("hello rana kemon acho?" );
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="py-16 px-4 md:py-20 lg:py-24">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">Featured Products</h2>
          <Link
            to="/product"
            className="flex items-center text-red-500 hover:text-red-400 transition-colors duration-200 font-semibold"
          >
            View All
            <span className="ml-2">→</span>
          </Link>
        </div>

        {/* Product Slider */}
        <Slider {...settings}>
          {products.map((product) => (
            <div key={product.id} className="px-3">
              <ProductSingle product={product} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default ProductSlider;
