'use client';

import { useState } from 'react';
import { CameraIcon } from '@heroicons/react/24/outline';
import ProductCard from '@/components/ProductCard';

type ProductItem = {
  name: string;
  description: string;
  image_url: string;
  product_url: string;
  price?: string;
  rating?: number;
};

// Expanded sample products in various categories
const sampleProducts: ProductItem[] = [
  // Dresses & Apparel
  {
    name: 'Elegant Summer Dress',
    description: 'Floral print, lightweight, perfect for outings.',
    image_url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&q=80',
    product_url: '#',
    price: '$49.99',
    rating: 4.6,
  },
  {
    name: 'Classic Denim Jacket',
    description: 'Timeless denim, unisex fit, all seasons.',
    image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
    product_url: '#',
    price: '$59.99',
    rating: 4.8,
  },
  // Home Decor
  {
    name: 'Nordic Table Lamp',
    description: 'Minimalist bedside lamp for cozy evenings.',
    image_url: 'https://plus.unsplash.com/premium_photo-1706072613979-e2bddb367f41?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    product_url: '#',
    price: '$34.99',
    rating: 4.5,
  },
  {
    name: 'Modern Wall Clock',
    description: 'Simple, silent wall clock for living room decor.',
    image_url: 'https://images.unsplash.com/photo-1642071272153-d64e1c557434?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    product_url: '#',
    price: '$24.99',
    rating: 4.1,
  },
  // Furniture
  {
    name: 'Wooden Coffee Table',
    description: 'Handcrafted oak coffee table, modern style.',
    image_url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&q=80',
    product_url: '#',
    price: '$149.99',
    rating: 4.9,
  },
  {
    name: 'Ergonomic Desk Chair',
    description: 'Comfortable mesh chair for office and study.',
    image_url: 'https://images.unsplash.com/photo-1688578735427-994ecdea3ea4?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    product_url: '#',
    price: '$99.99',
    rating: 4.7,
  },
  // Kitchen Essentials
  {
    name: 'Ceramic Dinner Plate Set',
    description: 'Set of 6 dinner plates, dishwasher safe.',
    image_url: 'https://images.unsplash.com/photo-1631008788516-e6d34ad2bbc0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    product_url: '#',
    price: '$29.99',
    rating: 4.4,
  },
  {
    name: 'Professional Chef Knife',
    description: 'Stainless steel kitchen knife, ultra sharp.',
    image_url: 'https://images.unsplash.com/photo-1570643509348-4fe54c998566?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    product_url: '#',
    price: '$19.99',
    rating: 4.8,
  },
  // Instruments
  {
    name: 'Acoustic Guitar',
    description: 'Beginner-friendly 6-string acoustic guitar.',
    image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
    product_url: '#',
    price: '$119.99',
    rating: 4.6,
  },
  {
    name: 'Digital Piano Keyboard',
    description: '61-key portable electronic piano for learners.',
    image_url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&q=80',
    product_url: '#',
    price: '$179.99',
    rating: 4.9,
  },
  // Add more categories as you like
  {
    name: 'Scented Candle Set',
    description: '3-pack of aromatic candles for home ambiance.',
    image_url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&q=80',
    product_url: '#',
    price: '$14.99',
    rating: 4.3,
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Keeps beverages hot/cold for 24 hours.',
    image_url: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3e16?w=400&q=80',
    product_url: '#',
    price: '$12.99',
    rating: 4.7,
  },
];

export default function HomePage() {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<ProductItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const mockSuggestions: string[] = [
    'Shampoo',
    'Wireless Headphones',
    'Sneakers',
    'Organic Snacks',
    'Table Lamp',
    'Coffee Table',
    'Acoustic Guitar',
    'Chef Knife',
  ];

  const handleSearch = async () => {
    if (!query) return;
    try {
      const res = await fetch(`http://localhost:8000/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
      setShowSuggestions(true);
    } catch (err) {
      setResults([]);
      setShowSuggestions(false);
    }
  };

  // Use sampleProducts as default cards if no search results
  const displayProducts = results.length > 0 ? results : sampleProducts;

  return (
    <>
      {/* Header */}
      <header className="w-full bg-blue-800 py-10">
        <h1 className="text-center text-4xl font-bold text-yellow-400 tracking-widest ">
          Walmart
        </h1>
      </header>

      <main className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-900 mb-5 mt-1">Search for your favorite products by text or image</p>

          <div className="relative flex justify-center mb-10">
            <div className="flex relative w-full sm:w-2/3 border border-gray-300 rounded-full shadow-sm">
              <input
                type="text"
                placeholder="Search by text..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                className="w-full py-2 pl-10 h-10 border-none rounded-full shadow-sm focus:outline-none text-gray-800 text-base"
              />
              <CameraIcon className="h-10 w-10 my-auto mx-2 text-gray-800" />
              <button
                type="button"
                onClick={handleSearch}
                className="relative right-2 top-1 bg-blue-800 hover:bg-blue-700 hover:cursor-pointer text-white rounded-full text-sm h-8 w-24 ml-3"
              >
                Search
              </button>

              {showSuggestions && query && (
                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow top-16 max-h-60 overflow-y-auto py-2">
                  {mockSuggestions
                    .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
                    .map((suggestion, index) => (
                      <div
                        key={index}
                        className="pl-10 pb-1 hover:bg-gray-100 cursor-pointer text-left text-sm"
                        onClick={() => {
                          setQuery(suggestion);
                          setShowSuggestions(false);
                          handleSearch();
                        }}
                      >
                        {suggestion}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayProducts.map((item, i) => (
            <ProductCard key={i} {...item} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-blue-800 py-4 mt-12">
        <div className="text-center text-yellow-400 font-medium">
          © {new Date().getFullYear()} Walmart Search Demo. All rights reserved.
        </div>
      </footer>
    </>
  );
}