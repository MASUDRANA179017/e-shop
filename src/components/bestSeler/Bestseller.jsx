import React from 'react'
import Container from '../commonLayouts/Container'
import ProductLayout from '../commonLayouts/ProductLayout'

const Bestseller = () => {
    return (
        <div>
            <Container>
                <h2 className="text-2xl font-bold mb-4 text-start">Best Sellers</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-transparent p-4 rounded col-span-2">
                        <div className="grid grid-cols-3 gap-4 p-0">
                            <ProductLayout percentTag={true} roundTag={false} category="LAPTOP" stock={false} stockAmount="50" title="S21 Laptop Ultra HD LED Screen Feature 2025 ......" rating="5" totalRating="100" price="1070" border="true" bg="transparent" />
                            <ProductLayout percentTag={false} roundTag={true} category="SMARTPHONE" stock={false} stockAmount="30" title="S21 Smartphone Ultra HD LED Screen Feature 2025 ......" rating="4" totalRating="10" price="870" border="true" bg="transparent" />
                            <ProductLayout percentTag={false} roundTag={false} category="TABLET" stock={false} stockAmount="20" title="S21 Tablet Ultra HD LED Screen Feature 2025 ......" rating="5" totalRating="50" price="670" border="true" bg="transparent" />
                            <ProductLayout percentTag={true} roundTag={false} category="LAPTOP" stock={false} stockAmount="25" title="S21 Laptop Pro HD LED Screen Feature 2025 ......" rating="4" totalRating="75" price="970" border="true" bg="transparent" />
                            <ProductLayout percentTag={true} roundTag={false} category="SMARTPHONE" stock={false} stockAmount="15" title="S21 Smartphone Plus HD LED Screen 2025 ......" rating="5" totalRating="60" price="770" border="true" bg="transparent" />
                            <ProductLayout percentTag={false} roundTag={true} category="TABLET" stock={false} stockAmount="40" title="S21 Tablet Pro Ultra HD Screen 2025 ......" rating="4" totalRating="40" price="570" border="true" bg="transparent" />
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