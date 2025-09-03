import React from "react";
import TopBar from "./TopBar";
import MiddleBar from "./MiddleBar";
import ButtonBar from "./ButtonBar";
import { MobileBottomMenu, MobileHeader } from "./MobileHeader";


const Header = () => {
  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block">
        <TopBar />
        <MiddleBar />
        <ButtonBar />
      </div>

      {/* Mobile View */}
      <div className="block md:hidden">
        <MobileHeader />
        <MobileBottomMenu />
      </div>
    </>
  );
};

export default Header;
