import React from "react";
import { useParams } from "react-router-dom";
import ServiceDetails from "../components/frontend/service/ServiceDetails";

const ServiceDetailsPage = () => {
  const { id } = useParams();

  return (
    <>
      <ServiceDetails id={id} />
    </>
  );
};

export default ServiceDetailsPage;
