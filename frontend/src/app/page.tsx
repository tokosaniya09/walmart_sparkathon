'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, CameraIcon } from '@heroicons/react/24/outline';

type ProductItem = {
  name: string;
  description: string;
  image_url: string;
  product_url: string;
};

export default function HomePage() {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<ProductItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const mockSuggestions: string[] = ['Shampoo', 'Wireless Headphones', 'Sneakers', 'Organic Snacks'];

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
      // Optionally handle errors here
    }
  };

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

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((item, i) => (
            <div key={i} className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition duration-200">
              <img src={item.image_url} alt={item.name} className="w-full h-48 object-contain mb-4" />
              <h2 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.description}</p>
              <a
                href={item.product_url}
                target="_blank"
                className="text-blue-600 font-medium hover:underline"
                rel="noopener noreferrer"
              >
                View Product →
              </a>
            </div>
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