import React from "react";
import { BiPhoneCall } from "react-icons/bi";
import { CiLocationOn } from "react-icons/ci";
import { Link } from "react-router-dom";

const TopLeftComponent = () => {
  return (
    <div className="flex gap-[50px] relative after:content-[''] after:absolute after:w-[2px] after:h-[32px] after:bg-[#BFBFBF] after:top-[50%] after:right-[40%] after:-translate-y-1/2">
      <Link to={"#"} className="flex items-center text-[#303030]">
        <CiLocationOn />
        <span className=' font-["Montserrat"] px-2'>
          123 Main Street, Anytown USA
        </span>
      </Link>
      <Link to={"#"} className="flex items-center text-[#303030]">
        <BiPhoneCall />
        <span className=' font-["Montserrat"] px-2'>+1 (555) 123-4567</span>
      </Link>
    </div>
  );
};

export default TopLeftComponent;
