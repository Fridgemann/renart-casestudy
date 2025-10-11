"use client";
import { useState } from "react";
import Image from "next/image";

export default function ProductCard({ product, index }) {
    const [selectedColor, setSelectedColor] = useState('yellow');

    // Convert popularity score (0-1) to star rating (0-5) with half stars
    const getStarRating = (popularityScore) => {
        return popularityScore * 5; // Maps 0-1 to 0-5
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => {
            const starValue = i + 1;
            if (rating >= starValue) {
                // Full star
                return (
                    <span key={i} className="text-xl text-amber-400">
                        ★
                    </span>
                );
            } else if (rating >= starValue - 0.5) {
                // Half star
                return (
                    <span key={i} className="text-xl relative">
                        <span className="text-gray-200">★</span>
                        <span 
                            className="absolute left-0 top-0 text-amber-400 overflow-hidden"
                            style={{ width: '50%' }}
                        >
                            ★
                        </span>
                    </span>
                );
            } else {
                // Empty star
                return (
                    <span key={i} className="text-xl text-gray-200">
                        ★
                    </span>
                );
            }
        });
    };

    const starRating = getStarRating(product.popularityScore);

    return (
        <div className="p-8 w-80 min-w-80">
            <Image 
                src={product.images[selectedColor]} 
                alt={`${product.name} - ${selectedColor} gold`} 
                width={300} 
                height={300} 
                priority={index === 0} 
                style={{
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '280px',
                    maxHeight: '280px'
                }}
                className="mx-auto border-border border-gray-200 rounded-lg mb-4 object-contain"
            />
            
            {/* Color Selection Buttons - Circular */}
            <div className="flex justify-center gap-4 mt-6 mb-6">
                <button 
                    onClick={() => setSelectedColor('yellow')}
                    className={`w-10 h-10 rounded-full transition-all ${
                        selectedColor === 'yellow' 
                        ? 'ring-2 ring-gray-400 ring-offset-2' 
                        : 'hover:ring-1 hover:ring-gray-300 hover:ring-offset-1'
                    }`}
                    style={{ backgroundColor: '#E6CA97' }}
                    title="Yellow Gold"
                />
                <button 
                    onClick={() => setSelectedColor('white')}
                    className={`w-10 h-10 rounded-full transition-all ${
                        selectedColor === 'white' 
                        ? 'ring-2 ring-gray-400 ring-offset-2' 
                        : 'hover:ring-1 hover:ring-gray-300 hover:ring-offset-1'
                    }`}
                    style={{ backgroundColor: '#D9D9D9' }}
                    title="White Gold"
                />
                <button 
                    onClick={() => setSelectedColor('rose')}
                    className={`w-10 h-10 rounded-full transition-all ${
                        selectedColor === 'rose' 
                        ? 'ring-2 ring-gray-400 ring-offset-2' 
                        : 'hover:ring-1 hover:ring-gray-300 hover:ring-offset-1'
                    }`}
                    style={{ backgroundColor: '#E1A4A9' }}
                    title="Rose Gold"
                />
            </div>

            {/* Color Label */}
            <p className="text-center text-gray-600 mb-4 text-[12px] font-avenir-book">
                {selectedColor === 'yellow' && 'Yellow Gold'}
                {selectedColor === 'white' && 'White Gold'}
                {selectedColor === 'rose' && 'Rose Gold'}
            </p>

            <h2 className="text-[15px] font-montserrat-medium mb-2">{product.name}</h2>
            <p className="text-gray-600 font-montserrat-regular text-[15px] mb-1">Price: ${product.price} USD</p>
            
            {/* Star Rating */}
            <div className="flex items-center gap-2">
                <div className="flex">
                    {renderStars(starRating)}
                </div>
                <span className="text-gray-600 text-[14px] font-avenir-book">{starRating.toFixed(1)}/5</span>
            </div>
        </div>
    );
}