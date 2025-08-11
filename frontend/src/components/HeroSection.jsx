// components/HeroSection.jsx
export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-20 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">
          Welcome to Your CRM Website
        </h1>
        <p className="text-xl mb-8">
          Discover amazing products 
        </p>
        <div>
          <a
            href="#get-started"
            className="inline-block bg-white text-blue-700 font-semibold px-8 py-3 rounded-md hover:bg-gray-200 transition"
          >
            Shop Now
          </a>
        </div>
      </div>
    </section>
  );
}
