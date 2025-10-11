"use client";
import { useState, useEffect } from "react";
import ProductCard from "../components/Card";

export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="overflow-hidden">
      <h1 className="text-center text-[45px] font-light mb-8">Product List</h1>
      <div className="flex overflow-x-auto gap-6 px-6 pb-4">
        {products.map((product, index) => (
          <ProductCard 
            key={product.name} 
            product={product} 
            index={index} // Pass index for priority
          />
        ))}
      </div>
    </div>
  );
}