import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import ServiceLayout from "../../commonLayouts/ServiceLayout";
import { getAllProducts } from "../../../@Services/ProductService";

const NextArrow = ({ className, style, onClick }) => (
  <div
    className={className}
    style={{ ...style, display: "block", right: "-25px", zIndex: 10 }}
    onClick={onClick}
  >
    <FaChevronRight className="text-white text-3xl bg-blue-600 hover:bg-blue-500 rounded-full p-2" />
  </div>
);

const PrevArrow = ({ className, style, onClick }) => (
  <div
    className={className}
    style={{ ...style, display: "block", left: "-25px", zIndex: 10 }}
    onClick={onClick}
  >
    <FaChevronLeft className="text-white text-3xl bg-blue-600 hover:bg-blue-500 rounded-full p-2" />
  </div>
);

const ServiceSlide = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    getAllProducts("service")
      .then((data) => {
        const formatted = data.map((item) => ({
          id: item.id,
          title: item.name,
          description: item.description,
          currentPrice: item.price / 100,
          oldPrice: item.old_price ? item.old_price / 100 : null,
          image: (item.productGallery && item.productGallery.length > 0) ? item.productGallery[0] : (item.productThumbnail || "/frontend/products/product01.png"),
          rating: item.rating || 4,
          reviews: item.reviews || [],
          category: item.category || { name: "General" },
          discount: item.discount || null,
          type: item.type,
          stock: item.stock,
        }));
        setServices(formatted);
      })
      .catch((err) => console.error("Failed to fetch services:", err));
  }, []);

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
        breakpoint: 1400,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
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
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  if (services.length === 0) return null;

  return (
    <section className="py-16 px-4 md:py-20 lg:py-24 bg-gray-50">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Featured Services</h2>
          <Link
            to="/service"
            className="flex items-center text-blue-600 hover:text-blue-500 transition-colors duration-200 font-semibold"
          >
            View All
            <span className="ml-2">→</span>
          </Link>
        </div>

        {/* Service Slider */}
        <Slider {...settings}>
          {services.map((service) => (
            <div key={service.id} className="px-3 py-6">
                 <ServiceLayout
                    id={service.id}
                    img={service.image}
                    category={service.category.name}
                    title={service.title}
                    rating={service.rating}
                    totalRating={service.reviews.length}
                    price={service.currentPrice}
                    bg="transparent"
                    stock={service.stock > 0}
                    stockAmount={service.stock}
                    percentTag={service.discount > 0}
                 />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default ServiceSlide;
