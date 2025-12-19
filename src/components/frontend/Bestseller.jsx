import React, { useEffect, useState } from 'react'
import Container from '../commonLayouts/Container'
import ProductLayout from '../commonLayouts/ProductLayout'
import { getAllProducts } from "../../@Services/ProductService";

const Bestseller = () => {
    const [products, setProducts] = useState([]);
    // console.log(products);

    useEffect(() => {
        getAllProducts("product")
            .then((data) => {
                const formatted = data.map((item) => ({
                    id: item.id,
                    title: item.name,
                    description: item.description,
                    currentPrice: item.price / 100,
                    oldPrice: item.old_price ? item.old_price / 100 : null,
                    image: item.productThumbnail || "/frontend/products/product01.png",
                    rating: item.rating || 4,
                    reviews: item.reviews || [],
                    category: item.category || { name: "General" },
                    discount: item.discount || null,
                    type: item.type,
                    stock: item.stock,
                }));
                setProducts(formatted);
            })
            .catch((err) => console.error("Failed to fetch products:", err));
    }, []);
    return (
        <div>
            <Container>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-start">Best Sellers</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Product Grid */}
                    <div className="bg-transparent p-2 sm:p-4 rounded col-span-1 lg:col-span-2">
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                            {products.slice(0, 6).map((product) => (
                                <div key={product.id} className="">
                                    <ProductLayout
                                        id={product.id}
                                        img={product.image}
                                        percentTag={true}
                                        roundTag={false}
                                        category={product.category.name}
                                        stock={product.stock > 0}
                                        stockAmount={product.stock}
                                        title={product.title}
                                        rating={product.rating}
                                        totalRating={product.reviews.length}
                                        price={product.currentPrice}
                                        border="true"
                                        bg="transparent"
                                        type={product.type}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Banner Image */}
                    <div className="bg-gray-200 p-2 sm:p-4 rounded col-span-1 w-full">
                        <img
                            src="frontend/banner/bestSell.png"
                            alt="Best Seller Image"
                            className="w-full h-auto rounded object-cover"
                        />
                    </div>
                </div>
            </Container>
        </div>

    )
}

export default Bestseller