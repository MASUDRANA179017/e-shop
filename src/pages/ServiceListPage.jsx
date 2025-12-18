import React, { useState, useEffect, useMemo } from 'react'
import NewProductLazyLoad from '../components/frontend/product/NewProductLazyLoad'
import Container from '../components/commonLayouts/Container'
import SidebarFilter from '../components/frontend/SidebarFilter'
import { getAllProducts } from '../@Services/ProductService'

export const ServiceListPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all service products initially
    getAllProducts("service")
      .then(data => {
        const formatted = data.map((item) => ({
            id: item.id,
            img: item.productThumbnail,
            title: item.name,
            description: item.description,
            currentPrice: item.price / 100, // Assuming price is in cents
            oldPrice: item.old_price ? item.old_price / 100 : null,
            image: item.productThumbnail || "/frontend/products/product01.png",
            rating: item.rating || 4,
            reviews: item.reviews || [],
            category: item.category || { name: "General" },
            discount: item.discount || null,
            brand: item.brand?.name || item.brand || "", // Handle brand structure
          }));
        setAllProducts(formatted);
      })
      .catch(err => console.error("Failed to fetch services", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // Category Filter
      if (selectedCategory !== "All" && product.category.name !== selectedCategory) {
        return false;
      }
      // Brand Filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }
      // Price Filter
      if (product.currentPrice < priceRange.min || product.currentPrice > priceRange.max) {
        return false;
      }
      return true;
    });
  }, [allProducts, selectedCategory, selectedBrands, priceRange]);

  const handlePriceChange = (min, max) => {
    setPriceRange({ min, max });
  };

  return (
    <Container>
      <div className="flex flex-col md:flex-row gap-6 py-8">
        <div className="w-full md:w-[25%] lg:w-[20%]">
          <SidebarFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            minPrice={priceRange.min}
            maxPrice={priceRange.max}
            setPriceRange={handlePriceChange}
          />
        </div>
        <div className="w-full md:w-[75%] lg:w-[80%]">
           {loading ? (
             <div className="flex justify-center items-center h-64">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF624C]"></div>
             </div>
           ) : (
             <NewProductLazyLoad products={filteredProducts} type="service" />
           )}
        </div>
      </div>
    </Container>
  )
}
