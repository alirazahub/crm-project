'use client'

import { useState } from 'react';

export default function DisplayImg({ imgs }) {
  const [displayAll, setDisplayAll] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % imgs.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + imgs.length) % imgs.length);
  };

  return (
    <>
      {displayAll ? (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={() => setDisplayAll(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl font-bold"
          >
            ✕
          </button>

          {/* Left button */}
          <button
            onClick={prevImage}
            className="absolute left-4 text-white hover:text-gray-300 text-5xl"
          >
            ❮
          </button>

          {/* Main Image */}
          <img
            key={activeIndex}
            src={imgs[activeIndex]}
            alt={`Listing Image ${activeIndex + 1}`}
            className="max-h-[80vh] max-w-[80vw] object-contain rounded-lg shadow-lg"
          />

          {/* Right button */}
          <button
            onClick={nextImage}
            className="absolute right-4 text-white hover:text-gray-300 text-5xl"
          >
            ❯
          </button>
        </div>
      ) : (
        <div>
          <button onClick={() => setDisplayAll(true)}>
            <img
              key={0}
              src={imgs[0]}
              alt={`Listing Image 1`}
              className="w-32 h-32 object-cover rounded-md border cursor-pointer"
            />
          </button>
        </div>
      )}
    </>
  );
}
