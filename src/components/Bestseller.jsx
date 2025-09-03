import React, { useEffect, useState } from 'react'
import Container from './commonLayouts/Container'
import ProductLayout from './commonLayouts/ProductLayout'

const Bestseller = () => {
    const [products, setProducts] = useState([]);
    // console.log(products);
    
    useEffect(() => {
        fetch("/data/products.json")
            .then((res) => res.json())
            .then((data) => {
                const formatted = data.map((item) => ({
                    id: item.id,
                    title: item.name,
                    description: item.description,
                    currentPrice: item.price / 100,
                    oldPrice: item.old_price ? item.old_price / 100 : null,
                    image: item.image || "/frontend/products/product01.png",
                    rating: item.rating || 4,
                    reviews: item.reviews || 100,
                    category: item.category || "Laptop",
                    discount: item.discount || null,
                }));
                setProducts(formatted);
            })
            .catch((err) => console.error("Failed to fetch products:", err));
    }, []);
    return (
        <div>
            <Container>
                <h2 className="text-2xl font-bold mb-4 text-start">Best Sellers</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-transparent p-4 rounded col-span-2">
                        <div className="grid grid-cols-3 gap-4 p-0">
                            {products.slice(0, 6).map((product) => (
                                <div key={product.id} className="px-3">
                                    <ProductLayout 
                                        id={product.id} 
                                        percentTag={true} 
                                        roundTag={false} 
                                        category={product.category.name} 
                                        stock={false} 
                                        stockAmount="50" 
                                        title={product.title} 
                                        rating={product.rating} 
                                        totalRating={product.reviews.length} 
                                        price={product.currentPrice} 
                                        border="true" 
                                        bg="transparent" 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-200 p-4 rounded col-span-1 w-full cover-fill">
                        <img src="frontend/banner/bestSell.png" alt="Best Seller Image" className="w-full h-auto rounded" />
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Bestseller