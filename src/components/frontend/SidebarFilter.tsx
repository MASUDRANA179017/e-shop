'use client';
import React, { useState } from 'react';

const categories = [
    'Computers & Tablets',
    'Mobile & Accessories',
    'TV & Home Theater',
    'Audio & Headphones',
    'Cameras & Camcorders',
    'Gaming Equipment',
    'Home Appliances',
];

const brands = [
    { name: 'Apple', count: 565 },
    { name: 'Samsung', count: 428 },
    { name: 'ASUS', count: 323 },
    { name: 'Dell', count: 298 },
    { name: 'Lenovo', count: 180 },
    { name: 'HP', count: 98 },
    { name: 'Panasonic', count: 17 },
];

export default function SidebarFilter() {
    const [selectedCategory, setSelectedCategory] = useState('Mobile & Accessories');
    const [selectedBrands, setSelectedBrands] = useState(['Lenovo']);
    const [minVal, setMinVal] = useState(0);
    const [maxVal, setMaxVal] = useState(1000);

    const updateSlider = (type,value)=>{
        if (type == 'min') {
            const newMin = Math.min(parseInt(value), maxVal)
            setMinVal(newMin)
        }else {
            const newMax = Math.max(parseInt(value), minVal )
            setMaxVal(newMax)
        }
    }
    const minPercent = (minVal / 1000)*100
    const maxPercent = (minVal / 1000)*100

    const handleBrandToggle = (brand: string) => {
        setSelectedBrands((prev) =>
            prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
        );
    };

    return (
        <aside className="w-full max-w-xs p-6 bg-white rounded-2xl shadow-md space-y-6">
            {/* Categories */}
            <div>
                <h2 className="font-semibold text-lg mb-2">Categories</h2>
                <ul className="space-y-2">
                    {categories.map((category) => (
                        <li key={category} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={selectedCategory === category}
                                onChange={() => setSelectedCategory(category)}
                                className="accent-red-500"
                            />
                            <label className={`text-sm ${selectedCategory === category ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                                {category}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            <hr />

            {/* Brands */}
            <div>
                <h2 className="font-semibold text-lg mb-2">Brands</h2>
                <ul className="space-y-2">
                    {brands.map((brand) => (
                        <li key={brand.name} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={selectedBrands.includes(brand.name)}
                                    onChange={() => handleBrandToggle(brand.name)}
                                    className="accent-red-500"
                                />
                                <label className={`text-sm ${selectedBrands.includes(brand.name) ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                                    {brand.name}
                                </label>
                            </div>
                            <span className="text-sm text-gray-500">({brand.count})</span>
                        </li>
                    ))}
                </ul>
                <button className="mt-2 text-sm font-semibold underline text-gray-700">More Brands</button>
            </div>

            <hr />

            {/* Price */}
            <div className=''>
                <h2 className="font-semibold text-lg mb-2">Price</h2>
                <div className="flex space-x-4">
                    <div className="border rounded-lg px-4 py-2 text-sm text-gray-700">${minVal}</div>
                    <div className="border rounded-lg px-4 py-2 text-sm text-gray-700">${maxVal}</div>
                </div>
                <div className="relative w-full h-2.5 bg-green-500 rounded">
                    <div className="absolute h-full bg-red-500 rounded "
                    style={{left: `${minPercent}%`, width: `${maxPercent - minPercent}%`}}
                    ></div>

                    <input
                        type="range"
                        min={0}
                        max={10000}
                        value={minVal}
                        onChange={(e) => updateSlider('min', e.target.value)}
                        className="absolute w-full h-2.5 bg-transparent pointer-events-none appearance-none"
                    />
                    <input
                        type="range"
                        min={0}
                        max={10000}
                        value={maxVal}
                        onChange={(e) => updateSlider('max', e.target.value)}
                        className="absolute w-full h-2.5 bg-transparent pointer-events-none appearance-none"
                    />
                </div>
            </div>
        </aside>
    );
}
