"use client";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules'; // Removed Autoplay
import ProductCard from "../components/Card";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-600">Loading jewelry collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-600">Error loading products: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-gray-200 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-center text-[45px] mb-16 font-avenir-book">
        Product List
      </h1>
      
      <div className="w-full min-w-screen px-8 md:px-12 lg:px-16">
        <Swiper
          modules={[Navigation, Pagination]} // Removed Autoplay
          spaceBetween={32}
          slidesPerView={1}
          centeredSlides={false}
          navigation={true}
          pagination={{ 
            clickable: true,
            el: '.custom-pagination',
          }}
          // Removed autoplay configuration
          loop={true}
          speed={800}
          effect="slide"
          watchSlidesProgress={false}
          autoHeight={false}
          style={{ minHeight: '600px' }}
          breakpoints={{
            640: { 
              slidesPerView: 1,
              spaceBetween: 24
            },
            768: { 
              slidesPerView: 2,
              spaceBetween: 28
            },
            1024: { 
              slidesPerView: 3,
              spaceBetween: 32
            },
            1280: { 
              slidesPerView: 4,
              spaceBetween: 36
            },
            1536: {
              slidesPerView: 5,
              spaceBetween: 40
            }
          }}
          className="product-carousel mb-8"
        >
          {products.map((product, index) => (
            <SwiperSlide key={product.name} style={{ height: 'auto' }}>
              <div style={{ transform: 'none' }}>
                <ProductCard product={product} index={index} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        <div className="custom-pagination mt-8 flex justify-center"></div>
      </div>
    </div>
  );
}