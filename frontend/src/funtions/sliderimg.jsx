import React, { useEffect, useState } from "react";
export const Sliderimg = ({ images })=> {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400">No Image</span>
      </div>
    );
  }
  const imageUrl = `http://localhost:5500/upload/rooms/${images[currentIndex].image_url}`;

  return (
    <div className="relative h-48 overflow-hidden">
      <div
        className="h-48 bg-gray-200 bg-cover bg-center transition-all duration-700 ease-in-out group-hover:scale-105"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />

      {images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {images.map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 
                ${i === currentIndex ? "bg-white " : "bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
