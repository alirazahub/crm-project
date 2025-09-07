"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ShoppingCart, Eye, Sparkles, Award, Truck, Clock } from "lucide-react"

const images = ["/hero2.jpg","/hero1.jpg","/hero3.jpg","/hero4.jpg"]

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
      () => setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1)),
      3000,
    )

    return () => resetTimeout()
  }, [currentImageIndex])

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  return (
    <section className="relative bg-black text-white overflow-hidden max-h-screen flex flex-col font-sans">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {images.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={src || "/placeholder.svg"}
              alt="Premium fashion showcase"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          </div>
        ))}
      </div>

      {/* Main Content Container - Now takes available space and pushes stats down */}
      <div className="relative z-10 flex-grow flex items-center py-16"> {/* Added py-16 for vertical padding */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content Side */}
            <div className="space-y-8 animate-in fade-in slide-in-from-left-5 duration-1000">
              {/* Brand Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-medium tracking-wide">
                <Sparkles className="w-4 h-4" />
                PREMIUM COLLECTION
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-6xl lg:text-8xl font-bold leading-none tracking-tight text-balance">
                  EXPRESS
                  <span className="block text-white/60">YOUR</span>
                  <span className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    STYLE
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl font-light text-white/80 max-w-lg text-pretty leading-relaxed">
                  Elevate Your Fashion Game with Contemporary Streetwear & Premium Quality
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  className="group px-8 py-4 bg-white text-black font-semibold text-lg tracking-wide hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <a href="/customer/filter">
                    <ShoppingCart className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    SHOP NOW
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="group px-8 py-4 border-2 border-white text-white bg-transparent font-semibold text-lg tracking-wide hover:bg-white hover:text-black transition-all duration-300"
                >
                  <a href="/customer/filter">
                    <Eye className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    VIEW COLLECTION
                  </a>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-8 pt-8 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Premium Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Image Slider Side - Enhanced */}
            <div className="relative lg:ml-auto animate-in fade-in slide-in-from-right-5 duration-1000 delay-200">
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/3 rounded-full blur-2xl" />

              {/* Main Image Container */}
              <div className="relative w-full max-w-lg h-[600px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                {/* Slider Controls */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white z-20 backdrop-blur-sm border border-white/20"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white z-20 backdrop-blur-sm border border-white/20"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>

                {/* Dots Navigation */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex ? "bg-white w-8" : "bg-white/40 w-2 hover:bg-white/60"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </section>
  )
}