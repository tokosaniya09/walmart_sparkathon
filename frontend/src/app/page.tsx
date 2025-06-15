'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, CameraIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const mockSuggestions = ['Shampoo', 'Wireless Headphones', 'Sneakers', 'Organic Snacks'];

  const handleSearch = async () => {
    const res = await fetch(`http://localhost:8000/search?query=${query}`);
    const data = await res.json();
    setResults(data.results || []);
    setShowSuggestions(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Walmart</h1>
        <p className="text-gray-600 mb-8">Search for your favorite products by text or image</p>

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
              className="w-full p-[10px] pl-[40px] h-[40px] border-none rounded-full shadow-sm focus:outline-none text-gray-800 text-[15px]"
            />
            <CameraIcon className="h-[50px] mt-[8px] text-gray-400" />
            <button
              onClick={handleSearch}
              className="relative right-[10px] top-[6px] bg-blue-800 hover:bg-blue-700 hover:cursor-pointer text-white rounded-full text-sm h-[80%] w-[90px] ml-[13px]"
            >
              Search
            </button>

            {showSuggestions && query && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow top-[60px] border rounded-full max-h-60 overflow-y-auto py-[10px]">
                {mockSuggestions
                  .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
                  .map((suggestion, index) => (
                    <div
                      key={index}
                      className="pl-[50px] pb-[2px] hover:bg-gray-100 cursor-pointer text-left text-sm"
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
        {results.map((item: any, i) => (
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
  );
}
