import React from "react";
import { FaCartPlus, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";


const ProductLayout = ({ id, percentTag, roundTag, category, title, rating, totalRating, price, border, bg, stock, stockAmount }) => {
    let [ratingValue, setRatingValue] = React.useState(new Array(+rating).fill(rating));
    return (
        <div style={{ background: bg }} className="border-2 border-gray-200 rounded-lg w-full flex-row justify-center group p-4 hover:shadow-lg hover:shadow-[#FF624C] transition-shadow duration-300 ">
            <div className="relative mb-4">
                <img className="object-cover w-full h-[300px]" src="frontend/products/product01.png" alt="product" />
                {percentTag && (
                    <div className="absolute top-0 right-0 text-white bg-[#FF624C] text-[14px] font-semibold px-2 py-1 rounded-[5px]">
                        10%
                    </div>
                )}
                {roundTag && (
                    <div className="absolute top-0 right-0 text-white bg-[#FF624C] text-[14px] font-semibold px-2 py-3 rounded-full">
                        10%
                    </div>
                )}
                <div className="flex items-center justify-between absolute bottom-[6px] left-[50%] translate-x-[-50%] gap-4 scale-0 group-hover:scale-100 group-hover:flex duration-300 ">
                    <div className="w-[50px] h-[50px] border bg-white border-[#FF624C] text-[#FF624C] hover:bg-[#FF624C] hover:text-white duration-300 cursor-pointer rounded-full flex items-center justify-center text-[25px]">
                        <FaCartPlus />
                    </div>
                    <div className="w-[50px] h-[50px] border bg-white border-[#FF624C] text-[#FF624C] hover:bg-[#FF624C] hover:text-white duration-300 cursor-pointer rounded-full flex items-center justify-center text-[25px]">
                        <FaCartPlus />
                    </div>
                    <div className="w-[50px] h-[50px] border bg-white border-[#FF624C] text-[#FF624C] hover:bg-[#FF624C] hover:text-white duration-300 cursor-pointer rounded-full flex items-center justify-center text-[25px]">
                        <FaCartPlus />
                    </div>

                </div>
            </div>

            {/* <div className="div cursor-pointer"> */}
            <Link to={`/product/${id}`} className="block">

                <p className="text-sm font-['Montserrat'] leading-5 uppercase tracking-[5px] font-semibold mt-[4px] mb-4">{category}</p>
                <h3 className="text-lg font-['Montserrat'] font-semibold text-5 leading-[30px] hover:underline">{title}</h3>
                <div className="flex items-center gap-2">
                    {ratingValue.map((_, index) => (
                        <FaStar key={index} className="text-yellow-500" />
                    ))}

                    <span className="text-gray-500">({totalRating})</span>
                </div>
                <p className="text-lg font-['Montserrat'] font-semibold">${price}</p>
                {stock && <div className="w-full h-[30px] bg-[#333] rounded-[25px] relative">
                    <div className="w-1/2 h-full bg-[#FF624C] rounded-[25px]"></div>
                    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-white font-['Montserrat'] font-bold text-sm">
                        {stockAmount} in stock
                    </div>
                </div>}
            </Link>

            {/* </div> */}
        </div>
    );
}

export default ProductLayout;