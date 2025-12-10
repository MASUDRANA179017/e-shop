import React from "react";
import BannerFreeShipping from "./BannerFreeShipping";
import BannerBlackFriday from "./BannerBlackFriday";


const BannerTwo = () => {
    return (
        <>
            <div className=" flex flex-row">
                <div className="m-2">
                    {/* <BannerFreeShipping /> */}
                    hello One
                </div>
                <div className="m-2">

                    {/* <BannerBlackFriday /> */}
                    hello two
                </div>
            </div>
        </>
    )
}


export default BannerTwo;