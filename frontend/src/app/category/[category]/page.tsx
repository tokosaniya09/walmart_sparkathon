'use client';

import { useParams } from 'next/navigation';
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

export default function CategoryPage() {
  const { category } = useParams();
const [products, setProducts] = useState<ProductItem[]>([]);
  useEffect(() => {
    if (!category) return;
    fetch(`http://localhost:8000/api/category/${category}`)
      .then(res => res.json())
      .then(data => setProducts(data.products || []));
  }, [category]);

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-6 md:px-12">
      <h2 className="text-2xl font-bold mb-8 text-center">{decodeURIComponent(category as string)}</h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((item, i) => <ProductCard key={i} {...item} />)}
      </div>
    </main>
  );
}