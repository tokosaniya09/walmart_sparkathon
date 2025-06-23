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
  const params = useParams();
  const category = params?.category as string;

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!category) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`http://localhost:8000/api/category/${encodeURIComponent(category)}`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-6 md:px-12">
      <h2 className="text-2xl font-bold mb-8 text-center">
        Showing results for category: <span className="text-blue-600">{decodeURIComponent(category)}</span>
      </h2>

      {error && (
        <p className="text-center text-red-500 mb-6">{error}</p>
      )}

      {loading ? (
        <p className="text-center">Loading products...</p>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((item, i) => (
            <ProductCard key={i} {...item} />
          ))}
        </div>
      )}
    </main>
  );
}
