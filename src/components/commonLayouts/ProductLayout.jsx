import React from "react";
import { FaCartPlus, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const ProductLayout = ({ id, percentTag, roundTag, category, title, rating, totalRating, price, bg, stock, stockAmount }) => {
    const intRating = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    const emptyStars = 5 - intRating - (hasHalf ? 1 : 0);

    return (
        <div
            style={{ background: bg }}
            className="border border-gray-200 rounded-lg w-full flex flex-col justify-center group p-3 sm:p-4 hover:shadow-lg hover:shadow-[#FF624C] transition-shadow duration-300"
        >
            <div className="relative mb-3 sm:mb-4">
                <img
                    className="object-cover w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px]"
                    src="frontend/products/product01.png"
                    alt="product"
                />
                {percentTag && (
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 text-white bg-[#FF624C] text-[10px] sm:text-[12px] font-semibold px-2 py-1 rounded-[5px]">
                        10%
                    </div>
                )}
                {roundTag && (
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 text-white bg-[#FF624C] text-[10px] sm:text-[12px] font-semibold px-2 py-2 rounded-full">
                        10%
                    </div>
                )}
                <div className="flex items-center justify-center gap-2 sm:gap-3 absolute bottom-1 sm:bottom-2 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-300">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] border bg-white border-[#FF624C] text-[#FF624C] hover:bg-[#FF624C] hover:text-white duration-300 cursor-pointer rounded-full flex items-center justify-center text-[18px] sm:text-[22px]"
                        >
                            <FaCartPlus />
                        </div>
                    ))}
                </div>
            </div>

            <a href={`/product/${id}`} className="block">
                <p className="text-xs sm:text-sm font-['Montserrat'] leading-4 uppercase tracking-[1px] sm:tracking-[2px] font-semibold mb-1 sm:mb-2">
                    {category}
                </p>
                <h3 className="text-sm sm:text-base md:text-lg font-['Montserrat'] font-semibold leading-[20px] sm:leading-[24px] hover:underline mb-1 sm:mb-2">
                    {title}
                </h3>
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    {Array.from({ length: intRating }).map((_, i) => (
                        <FaStar key={i} className="text-yellow-500 text-[12px] sm:text-sm" />
                    ))}
                    {hasHalf && <FaStarHalfAlt className="text-yellow-500 text-[12px] sm:text-sm" />}
                    {Array.from({ length: emptyStars }).map((_, i) => (
                        <FaRegStar key={i} className="text-gray-400 text-[12px] sm:text-sm" />
                    ))}
                    <span className="text-gray-500 text-[10px] sm:text-xs">({totalRating})</span>
                </div>
                <p className="text-base sm:text-lg font-['Montserrat'] font-semibold mb-1 sm:mb-2">${price}</p>
                {stock && (
                    <div className="w-full h-[20px] sm:h-[25px] bg-[#333] rounded-[20px] relative">
                        <div className="w-1/2 h-full bg-[#FF624C] rounded-[20px]"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-['Montserrat'] font-bold text-[10px] sm:text-xs">
                            {stockAmount} in stock
                        </div>
                    </div>
                )}
            </a>
        </div>
    );
};

export default ProductLayout;
