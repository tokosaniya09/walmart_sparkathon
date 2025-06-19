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
  const image = searchParams.get('image') || '';

  const [products, setProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query && !image) return;

      const formData = new FormData();
      formData.append('text', query);

      if (image) {
        try {
          const blob = await fetch(image).then((r) => r.blob());
          formData.append('image', blob, 'image.jpg');
        } catch (err) {
          console.error('Failed to fetch image blob:', err);
          return;
        }
      }

      try {
        const res = await fetch('http://localhost:8000/api/search', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        console.log('✅ Products from backend:', data);
        setProducts(data.products || []);
      } catch (err) {
        console.error('❌ Search failed:', err);
      }
    };

    fetchProducts();
  }, [query, image]);

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-6 md:px-12">
      <h2 className="text-2xl font-bold mb-8 text-center">
        {image ? (
          <>Showing results for the <span className="text-blue-600">uploaded image</span></>
        ) : (
          <>Showing results for "{query}"</>
        )}
      </h2>

      {image && (
        <div className="flex justify-center mb-6">
          <img src={image} alt="Search" className="max-h-40 rounded-lg" />
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((item, i) => <ProductCard key={i} {...item} />)}
      </div>
    </main>
  );
}
