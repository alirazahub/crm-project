export default function HeroSection() {
  return (
    <section className="bg-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-balance">
              Welcome to Your
              <span className="text-gray-300"> Premium Store</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 text-pretty max-w-lg">
              Discover amazing products with our modern shopping experience. Quality meets style in every item we offer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="/customer/filter"
                className="inline-block bg-white text-black font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:shadow-lg"
              >
                Shop Now
              </a>
              <a
                href="#featured"
                className="inline-block border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-black transition-all duration-200"
              >
                View Featured
              </a>
            </div>
          </div>

          {/* Image Side */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800">
              <img
                src="/hero3.jpeg"
                alt="Premium shopping experience"
                className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay for better text contrast if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

              {/* Floating elements for modern touch */}
              <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
                <span className="text-white text-sm font-medium">Premium Quality</span>
              </div>

              <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
                <span className="text-white text-sm font-medium">Fast Delivery</span>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="border-r border-gray-800 last:border-r-0">
            <div className="text-3xl font-bold text-white mb-2">1000+</div>
            <div className="text-gray-400 text-sm">Products</div>
          </div>
          <div className="border-r border-gray-800 last:border-r-0">
            <div className="text-3xl font-bold text-white mb-2">10k+</div>
            <div className="text-gray-400 text-sm">Happy Customers</div>
          </div>
          <div className="border-r border-gray-800 last:border-r-0">
            <div className="text-3xl font-bold text-white mb-2">79%</div>
            <div className="text-gray-400 text-sm">Satisfaction</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-gray-400 text-sm">Support</div>
          </div>
        </div>
      </div>
    </section>
  )
}
