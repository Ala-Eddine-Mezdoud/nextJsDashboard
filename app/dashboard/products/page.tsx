"use client";

import React, { useState, useEffect } from 'react';

interface Product {
    id: number;
    name: string;
    price: string;
    stock_quantity: number | null;
    images: { src: string }[];
    categories: { id: number; name: string }[];
}

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch('https://baba4shop.com/wp-json/wc/v3/products', {
            headers: {
                'Authorization': 'Basic ' + btoa('ck_41c261b6e95a655655d5e08f50590b796504984d:cs_833b93d92b10c6d72b5d2e0fa882c7deff8edf7f')
            }
        })
            .then(response => response.json())
            .then((data: Product[]) => {
                setProducts(data);
                const uniqueCategories = Array.from(new Set(
                    data.flatMap(product => product.categories.map(cat => cat.name))
                ));
                setCategories(uniqueCategories);
            })
            .catch(error => console.error('Error fetching products:', error))
            .finally(() => setLoading(false));
    }, []);

    const handleCategoryChange = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(cat => cat !== category)
                : [...prev, category]
        );
    };

    const filteredProducts = selectedCategories.length > 0
        ? products.filter(product =>
            product.categories.some(cat => selectedCategories.includes(cat.name))
        )
        : products;

    return (
        <div className="flex gap-6 p-6">
            {/* Sidebar for categories */}
            <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
                <h2 className="font-bold text-lg mb-4">Categories</h2>
                <div className="flex flex-col gap-2">
                    {categories.map((category, index) => (
                        <label key={index} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                value={category}
                                checked={selectedCategories.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                                className="h-4 w-4"
                            />
                            {category}
                        </label>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div className="w-3/4">
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-pulse bg-gray-300 h-10 w-10 rounded-full" />
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-6">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="border border-gray-100 p-3 rounded-lg bg-white hover:border-gray-900 transition duration-300">
                                <img
                                    src={product.images[0]?.src || '/placeholder.png'}
                                    alt={product.name}
                                    className="w-full h-40 object-cover rounded-lg mb-3"
                                />
                                <h2 className="text-lg text-gray-800">{product.name}</h2>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">${product.price}</span>
                                    <span className="text-sm text-green-600">
                                        {product.stock_quantity !== null ? `${product.stock_quantity} in stock` : 'Out of stock'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
