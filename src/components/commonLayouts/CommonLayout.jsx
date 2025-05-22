import React from "react";
import { Outlet } from "react-router-dom";
import Container from "./Container";
import Header from "../header/Header";
import Footer from "../footer/Footer";

const CommonLayout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default CommonLayout;
