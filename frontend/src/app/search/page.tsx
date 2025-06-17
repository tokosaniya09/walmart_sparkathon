'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';

type ProductItem = {
  name: string;
  description: string;
  image_url: string;
  product_url: string;
  price?: string;
  rating?: number;
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
const [products, setProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    if (!query) return;
    fetch(`http://localhost:8000/api/search?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => setProducts(data.products || []));
  }, [query]);

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-6 md:px-12">
      <h2 className="text-2xl font-bold mb-8 text-center">Showing results for "{query}"</h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((item, i) => <ProductCard key={i} {...item} />)}
      </div>
    </main>
  );
}