import React from "react";

type ProductCardProps = {
  name: string;
  image_url: string;
  price?: string;
  description?: string;
  rating?: number;
  product_url: string;
};

export default function ProductCard({
  name,
  image_url,
  price,
  description,
  rating,
  product_url,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 p-5 flex flex-col">
      <a href={product_url} target="_blank" rel="noopener noreferrer">
        <img
          src={image_url}
          alt={name}
          className="w-full h-48 object-cover rounded mb-4"
        />
      </a>
      <h2 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">{name}</h2>
      {price && <div className="text-pink-600 font-bold text-lg mb-1">{price}</div>}
      {rating !== undefined && (
        <div className="flex items-center mb-2">
          <span className="text-yellow-400 mr-1">★</span>
          <span className="text-sm text-gray-600">{rating.toFixed(1)}</span>
        </div>
      )}
      {description && (
        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{description}</p>
      )}
      <a
        href={product_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-block bg-blue-800 text-white rounded-full py-2 px-4 text-center hover:bg-blue-700 font-medium"
      >
        View Product
      </a>
    </div>
  );
}