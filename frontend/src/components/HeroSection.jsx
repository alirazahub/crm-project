"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ShoppingCart, Eye } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

const images = [
  "/hero1.jpeg",
  "/hero2.jpeg",
  "/hero3.jpeg",
  "/hero4.jpeg",
]

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const timeoutRef = useRef(null)

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  useEffect(() => {
    resetTimeout()
    timeoutRef.current = setTimeout(
      () =>
        setCurrentImageIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        ),
      5000
    )

    return () => resetTimeout()
  }, [currentImageIndex])

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  return (
    <section className="bg-gradient-to-br from-gray-950 to-black text-white py-20 px-6 overflow-hidden relative">
      <div className="max-w-7xl mx-auto z-10 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <div className="text-center lg:text-left animate-in fade-in slide-in-from-left-5 duration-1000">
            <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight text-balance">
              Welcome to Your
              <span className="block text-primary drop-shadow-lg">Premium Store</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0 text-pretty">
              Discover amazing products with our modern shopping experience. Quality meets style in every item we offer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild className="px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-primary/30 transition-all group">
                <a href="/customer/filter">
                  <ShoppingCart className="mr-3 h-5 w-5 group-hover:rotate-6 transition-transform" /> Shop Now
                </a>
              </Button>
              <Button asChild variant="outline" className="px-8 py-6 text-lg rounded-xl border-2 border-white text-white hover:bg-white hover:text-black transition-all group">
                <a href="#featured">
                  <Eye className="mr-3 h-5 w-5 group-hover:-translate-y-1 transition-transform" /> View Featured
                </a>
              </Button>
            </div>
          </div>

          {/* Image Slider Side */}
          <div className="relative w-full h-[500px] rounded-3xl shadow-2xl overflow-hidden border border-gray-800 animate-in fade-in slide-in-from-right-5 duration-1000 delay-200">
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt="Premium shopping experience"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            {/* Slider Controls */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white z-20"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white z-20"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? "bg-primary w-5" : "bg-gray-400/70"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>

            {/* Floating elements for modern touch */}
            <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 z-10 animate-in fade-in zoom-in-90 duration-500 delay-500">
              <span className="text-white text-sm font-medium flex items-center gap-2">
                Premium Quality
              </span>
            </div>

            <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 z-10 animate-in fade-in zoom-in-90 duration-500 delay-700">
              <span className="text-white text-sm font-medium flex items-center gap-2">
                Fast Delivery
              </span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-300">
          <div className="border-r border-gray-800 last:border-r-0 px-4">
            <div className="text-4xl font-bold text-primary mb-2">1000+</div>
            <div className="text-gray-400 text-sm">Products</div>
          </div>
          <div className="border-r border-gray-800 last:border-r-0 px-4">
            <div className="text-4xl font-bold text-primary mb-2">10k+</div>
            <div className="text-gray-400 text-sm">Happy Customers</div>
          </div>
          <div className="border-r border-gray-800 last:border-r-0 px-4">
            <div className="text-4xl font-bold text-primary mb-2">79%</div>
            <div className="text-gray-400 text-sm">Satisfaction</div>
          </div>
          <div className="px-4">
            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
            <div className="text-gray-400 text-sm">Support</div>
          </div>
        </div>
      </div>
      {/* Background blobs for visual interest */}
      <div className="absolute -top-1/4 left-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute -bottom-1/4 right-1/2 w-[500px] h-[500px] bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    </section>
  )
}