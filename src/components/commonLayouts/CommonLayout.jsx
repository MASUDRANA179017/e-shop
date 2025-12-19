import React from "react";
import { Outlet } from "react-router-dom";
import Container from "./Container";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CommonLayout = () => {
  return (
    <div>
      <Header />
      <ToastContainer limit={1} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default CommonLayout;
