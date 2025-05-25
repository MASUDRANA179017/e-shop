import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductSingle from "./ProductSingle";
import Slider from "react-slick";

const featuredProducts = [
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
    category: "HEADPHONE",
    title: "Wireless Earbuds Pro Max with Noise Can...",
    rating: 4,
    reviews: 80,
    currentPrice: 129.0,
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
];

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
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
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
          <a
            href="#"
            className="flex items-center text-red-500 hover:text-red-400 transition-colors duration-200 font-semibold"
          >
            View All
            <span className="ml-2">→</span>
          </a>
        </div>

        {/* Product Slider */}
        <Slider {...settings}>
          {featuredProducts.map((product) => (
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
