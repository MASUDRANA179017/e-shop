import React, { useEffect, useState } from 'react'
import Container from './commonLayouts/Container'
import ProductLayout from './commonLayouts/ProductLayout'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";


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




const SpringSale = () => {
    const [products, setProducts] = useState([]);
    const [timerLeft, setTimerLeft] = useState(calculateTimeLeft())
    function calculateTimeLeft() {
        const saleEndDate = new Date("December 1, 2025 10:00 AM +06").getTime()
        const now = new Date().getTime()
        const difference = saleEndDate - now;

        if (difference < 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 }
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60) / 1000)),
        }
    }


    useEffect(() => {
        const timer = setInterval(() => {
            setTimerLeft(calculateTimeLeft())
        }, 1000)

        return () => calculateTimeLeft(timer)
    })

    useEffect(() => {
        fetch("/data/products.json")
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

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        nextArrow: <NextArrow />,
        // prevArrow: <PrevArrow />,

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

    return (
        <div className='mb-[50px]'>
            <Container>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="w-full h-auto flex flex-col justify-center align-middle ">
                        <h3 className="font-['Montserrat'] text-[56px] font-bold">Spring Sale</h3>
                        <div className='flex flex-row justify-start align-middle'>
                            <div className='flex flex-col px-5'>
                                <span className="text-[#FF624C] font-['Poppins'] text-[36px]">{timerLeft.days}</span>
                                <span className="text-[#303030] text-[15px] front-['Montserrat']">Day</span>
                            </div>
                            <span className="text-[#FF624C] text-[36px]">:</span>
                            <div className='flex flex-col px-5'>
                                <span className="text-[#FF624C] font-['Poppins'] text-[36px]">{timerLeft.hours}</span>
                                <span className="text-[#303030] text-[15px] front-['Montserrat']">Hours</span>
                            </div>
                            <span className="text-[#FF624C] text-[36px]">:</span>
                            <div className='flex flex-col px-5'>
                                <span className="text-[#FF624C] font-['Poppins'] text-[36px]">{timerLeft.minutes}</span>
                                <span className="text-[#303030] text-[15px] front-['Montserrat']">Minutes</span>
                            </div>
                            <span className="text-[#FF624C] text-[36px]">:</span>
                            <div className='flex flex-col px-5'>
                                <span className="text-[#FF624C] font-['Poppins'] text-[36px]">{timerLeft.seconds}</span>
                                <span className="text-[#303030] text-[15px] front-['Montserrat']">Seconds</span>
                            </div>

                        </div>
                    </div>
                    <div className="bg-transparent p-4 rounded col-span-2">
                        <div className="grid grid-cols-1 gap-4 p-0">
                            {/* Product Slider */}
                            <Slider {...settings}>
                                {products.map((product) => (
                                    <div key={product.id} className="px-3 py-6">
                                        {/* <ProductSingle product={product} /> */}
                                        <ProductLayout id={product.id} percentTag={false} roundTag={true} category={product.category.name} stock={true} stockAmount="50" title={product.title} rating={product.rating} totalRating={product.reviews.length} price={product.currentPrice} border="true" bg="transparent" />
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>

                </div>
            </Container>
        </div>
    )
}

export default SpringSale