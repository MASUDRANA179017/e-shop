import React from "react";
import { BiPhoneCall } from "react-icons/bi";
import { CiLocationOn } from "react-icons/ci";
import { Link } from "react-router-dom";

const TopLeftComponent = () => {
  return (
    <div
      className="
        flex md:flex-row md:gap-[50px] gap-3 
        relative 
        md:after:content-[''] md:after:absolute md:after:w-[2px] md:after:h-[32px] 
        md:after:bg-[#BFBFBF] md:after:top-[50%] md:after:right-[40%] md:after:-translate-y-1/2
      "
    >
      {/* Location */}
      <Link
        to={"#"}
        className="flex items-center text-[#303030] text-[12px] md:text-base"
      >
        <CiLocationOn className="text-[12px] md:text-xl" />
        <span className='font-["Montserrat"] px-2'>
          123 Main Street, Anytown USA
        </span>
      </Link>

      {/* Phone */}
      <Link
        to={"#"}
        className="flex items-center text-[#303030] text-[12px] md:text-base"
      >
        <BiPhoneCall className="text-[12px] md:text-xl" />
        <span className='font-["Montserrat"] px-2'>+880 1521-471432</span>
      </Link>
    </div>
  );
};

export default TopLeftComponent;
