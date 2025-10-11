"use client";
import { useState } from "react";
import Image from "next/image";

export default function ProductCard({ product, index }) {
    const [selectedColor, setSelectedColor] = useState('yellow');

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
                className="mx-auto"
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
            <p className="text-center text-sm text-gray-600 mb-4 text-[12px] font-light">
                {selectedColor === 'yellow' && 'Yellow Gold'}
                {selectedColor === 'white' && 'White Gold'}
                {selectedColor === 'rose' && 'Rose Gold'}
            </p>

            <h2 className="text-lg text-[15px] font-medium mb-2">{product.name}</h2>
            <p className="text-gray-600 font-normal mb-1">Price: ${product.price} USD</p>
            <p className="text-gray-600">Popularity: {(product.popularityScore * 100).toFixed(0)}%</p>
        </div>
    );
}