
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductDetails from "../components/product/ProductDetails";

const ProductDetailsPage = () => {
  const { id } = useParams();



  return (
    <>
      <ProductDetails id={id} />
    </>
  );
};

export default ProductDetailsPage;
