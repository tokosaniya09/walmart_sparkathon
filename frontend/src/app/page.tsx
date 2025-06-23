'use client';

import { useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CameraIcon } from '@heroicons/react/24/outline';
import ProductCard from '@/components/ProductCard';
import CameraModal from '@/components/CameraModal';
import ImageSearchButton from '@/components/ImageSearchButton';


type ProductItem = {
  name: string;
  description: string;
  image_url: string;
  product_url: string;
  price?: string;
  rating?: number;
};

const categories = [
  "Home Decor",
  "Kitchen Essentials",
  "Furniture",
  "Apparel",
  "Bags & Shoes",
  "Electronics",
  "Jewellery",
  "Beauty & Health",
];

// ...sampleProducts stays as is...
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
  const router = useRouter();
  const [results, setResults] = useState<ProductItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [imageFile, setImageFile] = useState<File | string | null>(null);
const [suggestions, setSuggestions] = useState<string[]>([]);

useEffect(() => {
  if (!query) {
    setSuggestions([]);
    return;
  }
  const timeoutId = setTimeout(() => {
    fetch(`http://localhost:8000/api/search-suggestions?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => setSuggestions(data.suggestions || []))
      .catch(() => setSuggestions([]));
    setShowSuggestions(true);
  }, 300); // debounce

  return () => clearTimeout(timeoutId);
}, [query]);


  const handleImageSelect = (file: File | string) => {
    setImageFile(file);
  };

  const handleImageSearch = async () => {
    if (!imageFile) return;

    let imageUrl: string;
    if (typeof imageFile === "string") {
  // base64 string from webcam
    imageUrl = imageFile;
      } else if (imageFile instanceof File) {
  // file object from file input
    imageUrl = URL.createObjectURL(imageFile);
      } else {
    return; // handle error if needed
    }
  router.push(`/search?image=${encodeURIComponent(imageUrl)}`);
  }

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

  // const handleSearch = async () => {
  //   if (!query) return;
  //   try {
  //     const res = await fetch(`http://localhost:8000/search?query=${encodeURIComponent(query)}`);
  //     const data = await res.json();
  //     setResults(data.results || []);
  //     setShowSuggestions(true);
  //   } catch (err) {
  //     setResults([]);
  //     setShowSuggestions(false);
  //   }
  // };

  const handleSearch = () => {
  if (!query) return;
  router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleCategoryClick = (cat: string) => {
    router.push(`/category/${encodeURIComponent(cat)}`);
  };

  const displayProducts = results.length > 0 ? results : sampleProducts;

  return (
    <>
      {/* Categories Bar */}
      <nav className="w-full bg-gray-50 shadow z-10 sticky top-0 border-gray-90">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex flex-nowrap overflow-x-auto no-scrollbar gap-6 py-3 justify-center">
            {categories.map((cat) => (
              <li key={cat} className="flex-shrink-0">
                <button
                  onClick={() => handleCategoryClick(cat)}
                  className="whitespace-nowrap px-4 py-2 rounded-full hover:bg-gray-100 font-medium text-gray-700 transition text-center"
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <main className="min-h-screen bg-gray-50 py-10 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-900 mb-5 text-xl">
            Search for your favorite products by text or image
          </p>
          <div className="relative flex justify-center mb-10">
            <div className="flex relative w-full sm:w-3/4 md:w-3/4 lg:w-3/4 border border-gray-300 rounded-full shadow-sm">
              <input
                type="text"
                placeholder="Search by text..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                className="w-full py-2 pl-10 h-12 border-none rounded-full shadow-sm focus:outline-none text-gray-800 text-base"
              />
              <CameraIcon className="h-10 w-10 my-auto mx-2 text-gray-800 cursor-pointer" 
              onClick={() => setShowCameraModal(true)} />
              <button
                type="button"
                onClick={handleSearch}
                className="relative right-2 top-2 bg-blue-800 hover:bg-blue-700 hover:cursor-pointer text-white rounded-full text-sm h-8 w-24 ml-3"
              >
                Search
              </button>
              {showSuggestions && query && suggestions.length > 0 && (
  <div className="absolute z-10 left-0 top-full w-full bg-white border-x border-b border-gray-200 rounded-b-xl shadow max-h-60 overflow-y-auto py-2">
    {suggestions.map((suggestion, index) => (
      <div
        key={index}
        className="pl-10 pb-1 hover:bg-gray-100 cursor-pointer text-left text-sm"
        onClick={() => {
          setQuery(suggestion);
          setShowSuggestions(false);
          router.push(`/search?q=${encodeURIComponent(suggestion)}`);
        }}
      >
              {/* {showSuggestions && query && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow top-12 max-h-60 overflow-y-auto py-2">
                  {mockSuggestions
                    .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
                    .map((suggestion, index) => (
                      <div
                        key={index}
                        className="pl-10 pb-1 hover:bg-gray-100 cursor-pointer text-left text-sm"
                        onClick={() => {
                          setQuery(suggestion);
                          setShowSuggestions(false);
                          router.push(`/search?q=${encodeURIComponent(suggestion)}`);
                        }}
                      > */}
                        {suggestion}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
            {/* Show image preview and search button if image attached */}
        {imageFile && (
          <div className="text-center mb-6">
            <img
              src={
                 typeof imageFile === "string"
            ? imageFile // base64 string from webcam
            : URL.createObjectURL(imageFile)
          }
              alt="Selected"
              className="mx-auto max-h-40 rounded-lg my-4"
            />
            <ImageSearchButton onClick={handleImageSearch} onCancel={() => setImageFile(null)} />
          </div>
        )}

        {/* Camera Modal */}
        <CameraModal
          open={showCameraModal}
          onClose={() => setShowCameraModal(false)}
          onImageSelect={handleImageSelect}
        />
        </div>

        {/* Card grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayProducts.map((item, i) => (
            <ProductCard key={i} {...item} />
          ))}
        </div>
      </main>
    </>
  );
}