'use client';
import React, { useState, useEffect } from 'react';
import { getAllCategory } from '../../@Services/CategoryService';
import { getAllBrands } from '../../@Services/BrandService';

export default function SidebarFilter({ 
    selectedCategory, 
    setSelectedCategory, 
    selectedBrands, 
    setSelectedBrands,
    minPrice,
    maxPrice,
    setPriceRange,
    showBrands = true,
    showPrice = true,
    clean = false
}) {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [minVal, setMinVal] = useState(minPrice || 0);
    const [maxVal, setMaxVal] = useState(maxPrice || 10000);

    useEffect(() => {
        // Fetch Categories
        getAllCategory()
            .then(data => setCategories(data))
            .catch(err => console.error("Failed to fetch categories", err));

        if (showBrands) {
            // Fetch Brands
            getAllBrands()
                .then(data => setBrands(data))
                .catch(err => console.error("Failed to fetch brands", err));
        }
    }, [showBrands]);

    useEffect(() => {
        if (minPrice !== undefined) setMinVal(minPrice);
        if (maxPrice !== undefined) setMaxVal(maxPrice);
    }, [minPrice, maxPrice]);

    const handleBrandToggle = (brandName) => {
        if (!setSelectedBrands) return;
        if (selectedBrands.includes(brandName)) {
            setSelectedBrands(selectedBrands.filter(b => b !== brandName));
        } else {
            setSelectedBrands([...selectedBrands, brandName]);
        }
    };

    const updateSlider = (type, value) => {
        const val = parseInt(value);
        if (type === 'min') {
            if (val > maxVal) return;
            setMinVal(val);
            if (setPriceRange) setPriceRange(val, maxVal);
        } else {
            if (val < minVal) return;
            setMaxVal(val);
            if (setPriceRange) setPriceRange(minVal, val);
        }
    };

    const minPercent = (minVal / 10000) * 100;
    const maxPercent = (maxVal / 10000) * 100;

    const Container = clean ? 'div' : 'aside';
    const containerClass = clean ? 'w-full' : 'w-full bg-white p-4 rounded-lg shadow';

    return (
        <Container className={containerClass}>
            {/* Categories */}
            <div className="mb-6">
                <h2 className="font-semibold text-lg mb-2">Categories</h2>
                <ul className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                    <li className="flex items-center space-x-2">
                        <input
                            type="radio" // Changed to radio for single selection or maintain checkbox for multiple? 
                            // The original code used checkbox but state was a string `selectedCategory`. 
                            // So it was acting like a radio. Let's stick to that.
                            name="category"
                            checked={selectedCategory === 'All' || !selectedCategory}
                            onChange={() => setSelectedCategory('All')}
                            className="accent-red-500"
                        />
                        <label className={`text-sm ${selectedCategory === 'All' ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                            All Categories
                        </label>
                    </li>
                    {categories.map((category) => (
                        <li key={category.id || category.name} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="category"
                                checked={selectedCategory === category.name}
                                onChange={() => setSelectedCategory(category.name)}
                                className="accent-red-500"
                            />
                            <label className={`text-sm ${selectedCategory === category.name ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                                {category.name}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            {showBrands && (
                <>
                    <hr />
                    {/* Brands */}
                    <div>
                        <h2 className="font-semibold text-lg mb-2">Brands</h2>
                        <ul className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                            {brands.map((brand) => (
                                <li key={brand.id || brand.name} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedBrands?.includes(brand.name)}
                                            onChange={() => handleBrandToggle(brand.name)}
                                            className="accent-red-500"
                                        />
                                        <label className={`text-sm ${selectedBrands?.includes(brand.name) ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                                            {brand.name}
                                        </label>
                                    </div>
                                    {/* <span className="text-sm text-gray-500">({brand.count || 0})</span> */}
                                </li>
                            ))}
                        </ul>
                        {/* <button className="mt-2 text-sm font-semibold underline text-gray-700">More Brands</button> */}
                    </div>
                </>
            )}

            {showPrice && (
                <>
                    <hr />
                    {/* Price */}
                    <div className=''>
                        <h2 className="font-semibold text-lg mb-2">Price</h2>
                        <div className="flex space-x-4 mb-4">
                            <div className="flex items-center border rounded-lg px-2 py-2 bg-gray-50">
                                <span className="text-gray-500 mr-1">$</span>
                                <input
                                    type="number"
                                    value={minVal}
                                    onChange={(e) => updateSlider('min', e.target.value)}
                                    className="w-full bg-transparent outline-none text-sm text-gray-700"
                                    min={0}
                                    max={maxVal}
                                />
                            </div>
                            <div className="flex items-center border rounded-lg px-2 py-2 bg-gray-50">
                                <span className="text-gray-500 mr-1">$</span>
                                <input
                                    type="number"
                                    value={maxVal}
                                    onChange={(e) => updateSlider('max', e.target.value)}
                                    className="w-full bg-transparent outline-none text-sm text-gray-700"
                                    min={minVal}
                                    max={10000}
                                />
                            </div>
                        </div>
                        <div className="relative w-full h-2.5 bg-gray-200 rounded">
                            <div className="absolute h-2.5 bg-red-500 rounded"
                            style={{left: `${minPercent}%`, width: `${maxPercent - minPercent}%`}}
                            ></div>

                            <input
                                type="range"
                                min={0}
                                max={10000}
                                value={minVal}
                                onChange={(e) => updateSlider('min', e.target.value)}
                                className="absolute w-full h-2.5 bg-transparent pointer-events-none appearance-none -top-0 z-20"
                            />
                            <input
                                type="range"
                                min={0}
                                max={10000}
                                value={maxVal}
                                onChange={(e) => updateSlider('max', e.target.value)}
                                className="absolute w-full h-2.5 bg-transparent pointer-events-none appearance-none -top-0 z-20"
                            />
                        </div>
                    </div>
                </>
            )}
        </Container>
    );
}
