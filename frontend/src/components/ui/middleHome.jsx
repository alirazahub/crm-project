"use client";
import React from 'react';
import { ArrowRight } from 'lucide-react';

const FashionCollections = () => {
  const collections = [
    {
      id: 1,
      title: "Women's Trendy Styles",
      description: "Explore the latest fashion trends for women. From chic dresses to casual styles for every occasion.",
      image: "/slider3.jpeg",
      category: "women"
    },
    {
      id: 2,
      title: "Men's Fashion Essentials",
      description: "Shop a curated collection of must-have men's styles, from classic pieces to modern fashion statements.",
      image: "/slider1.jpg",
      category: "men"
    },
    {
      id: 3,
      title: "Accessories to Complete",
      description: "Find stylish accessories to elevate any outfit. From bags to jewelry, add the perfect finishing touch.",
      image: "/slider2.jpg",
      category: "accessories"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="group relative overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative h-96 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2 transform transition-transform duration-500 group-hover:translate-y-0 translate-y-2">
                    {collection.title}
                  </h3>
                  <p className="text-sm text-gray-200 mb-4 opacity-90 leading-relaxed transform transition-all duration-500 delay-75 group-hover:translate-y-0 translate-y-2">
                    {collection.description}
                  </p>
                  
                  {/* CTA Button */}
                  <button className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 w-fit transform group-hover:translate-y-0 translate-y-2 delay-100 hover:gap-3">
                    Show More
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FashionCollections;