import React, { useEffect, useState } from 'react'
import Container from '../../commonLayouts/Container'
import ServiceLayout from '../../commonLayouts/ServiceLayout'
import { getAllProducts } from "../../../@Services/ProductService";

const ServiceBestseller = () => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        getAllProducts("service")
            .then((data) => {
                const formatted = data.map((item) => ({
                    id: item.id,
                    title: item.name,
                    description: item.description,
                    currentPrice: item.price / 100,
                    oldPrice: item.old_price ? item.old_price / 100 : null,
                    image: (item.productGallery && item.productGallery.length > 0) ? item.productGallery[0] : (item.productThumbnail || "/frontend/products/product01.png"),
                    rating: item.rating || 4,
                    reviews: item.reviews || [],
                    category: item.category || { name: "General" },
                    discount: item.discount || null,
                    type: item.type,
                    stock: item.stock,
                }));
                setServices(formatted);
            })
            .catch((err) => console.error("Failed to fetch services:", err));
    }, []);

    return (
        <div>
            <Container>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-start">Top Services</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Service Grid */}
                    <div className="bg-transparent p-2 sm:p-4 rounded col-span-1 lg:col-span-2">
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {services.slice(0, 6).map((service) => (
                                <div key={service.id} className="px-1 sm:px-3">
                                    <ServiceLayout
                                        id={service.id}
                                        img={service.image}
                                        category={service.category.name}
                                        title={service.title}
                                        rating={service.rating}
                                        totalRating={service.reviews.length}
                                        price={service.currentPrice}
                                        bg="transparent"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Banner Image */}
                    <div className="bg-gray-200 p-2 sm:p-4 rounded col-span-1 w-full">
                        <img
                            src="/frontend/banner/bestSell.png"
                            alt="Top Services"
                            className="w-full h-auto rounded object-cover"
                        />
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default ServiceBestseller
