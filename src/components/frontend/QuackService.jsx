import React from "react";
import { FaSyncAlt, FaShippingFast, FaRecycle } from "react-icons/fa";
import { GrSecure } from "react-icons/gr";
import Container from "../commonLayouts/Container";

// Data structure for the service items
const serviceData = [
  {
    id: 1,
    icon: FaSyncAlt,
    title: "Responsive",
    description: "Customer service available 24/7",
  },
  {
    id: 2,
    icon: GrSecure,
    title: "Secure",
    description: "Certified marketplace since 2017",
  },
  {
    id: 3,
    icon: FaShippingFast,
    title: "Shipping",
    description: "Free, fast, and reliable worldwide",
  },
  {
    id: 4,
    icon: FaRecycle,
    title: "Transparent",
    description: "Hassle-free return policy",
  },
];

const QuackService = () => {
  return (
    <section className=" py-2 px-4 md:py-6 lg:py-6">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {serviceData.map((service) => (
            <div
              key={service.id}
              className="flex flex-row items-center text-start p-2"
            >
              <div className="">
                <service.icon className="text-5xl text-[#303030]" />
              </div>

              <div className="ml-4">
                <h3 className="text-xl md:text-2xl font-semibold text-[#303030] mb-2">
                  {service.title}
                </h3>

                <p className="text-[#303030] text-[14px] md:text-base">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default QuackService;
