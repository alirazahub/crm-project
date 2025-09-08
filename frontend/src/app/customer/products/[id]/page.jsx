"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import {
  fetchProductById,
  clearSelectedProduct,
} from "@/store/slices/productSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Loader2,
  ArrowLeft,
  Star,
  Heart,
  Clock,
  Truck,
  Package,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const { token } = useSelector((state) => state.auth);
  const {
    selectedProduct: product,
    loading,
    error,
  } = useSelector((state) => state.product);

  const [selectedSize, setSelectedSize] = useState("S"); // Default selected size
  const [activeThumbnail, setActiveThumbnail] = useState(0); // For image gallery

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!token) {
      alert("Please login to add items to your cart.");
      return;
    }
    dispatch(
      addToCart({ productId: product._id, quantity: 1, size: selectedSize })
    );
    alert("Added to cart");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f9fa]">
        <Loader2 className="animate-spin text-[#333] w-10 h-10" />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f9fa] text-red-600">
        <p className="text-lg font-semibold">❌ {error}</p>
        <Link href="/products">
          <Button className="mt-4 bg-[#333] text-white rounded-[25px] h-[50px] px-6 text-[14px] font-medium hover:opacity-90">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
          </Button>
        </Link>
      </div>
    );

  if (!product)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f9fa] text-[#999]">
        <p className="text-lg">No product found</p>
      </div>
    );

  const productImages = product.images || [
    "https://via.placeholder.com/400x500/f0f0f0/333?text=Product+Image",
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-[20px] px-5 ">
      <div className="max-w-[1200px] mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-[20px] text-[12px] text-[#999]">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          &gt; <span className="font-semibold">Product details</span>
        </nav>

        {/* Product Section */}
        <div className="bg-white rounded-[12px] p-[40px] mb-[30px] grid grid-cols-1 md:grid-cols-2 gap-[40px] shadow-md shadow-gray-400">
          {/* Left Column: Product Images */}
          <div className="flex flex-col items-center">
            <img
              src={productImages[activeThumbnail]}
              alt={product.name}
              className="w-[400px] h-[500px] object-cover rounded-[8px] bg-[#f0f0f0] shadow-md"
            />
            <div className="flex mt-[10px] space-x-[10px]">
              {productImages.slice(0, 3).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-[80px] h-[80px] object-cover rounded-[8px] cursor-pointer border-2 ${
                    index === activeThumbnail
                      ? "border-[#333]"
                      : "border-transparent"
                  }`}
                  onClick={() => setActiveThumbnail(index)}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="flex flex-col">
            <p className="text-[#666] text-[12px] mb-[10px]">Men Fashion</p>
            <h1 className="text-[32px] font-bold text-[#333] mb-[15px]">
              {product.name}
            </h1>

            {/* Pricing & Discount */}
            <div className="flex items-center gap-4 mb-[20px]">
              <p className="text-[24px] font-semibold text-[#333]">
                ${product.price}
              </p>
              {product.originalPrice &&
                product.price < product.originalPrice && (
                  <p className="text-lg line-through text-[#999]">
                    ${product.originalPrice}
                  </p>
                )}
              {product.discount?.isActive &&
                product.discount.percentage > 0 && (
                  <span className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg">
                    {product.discount.percentage}% OFF
                  </span>
                )}
            </div>

            {/* Stock Status */}
            <p className="text-sm font-medium mb-[15px]">
              {product.stock?.quantity > 0 ? (
                <span className="text-green-600">
                  In Stock ({product.stock.quantity} available)
                </span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </p>

            <div className="flex items-center text-[#666] text-[14px] mb-[25px]">
              <Clock className="w-4 h-4 mr-2" />
              <span>Order in 03h30m to get next day delivery</span>
            </div>

            {/* Size Selector */}
            <div className="mb-[20px]">
              <p className="font-medium mb-[15px]">Select Size</p>
              <div className="flex space-x-2">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    className={`w-[45px] h-[45px] rounded-[25px] flex items-center justify-center text-[14px] transition-colors
                      ${
                        selectedSize === size
                          ? "bg-[#333] text-white"
                          : "bg-[#f5f5f5] text-[#999] border border-[#e0e0e0] hover:bg-[#e0e0e0]"
                      }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button and Wishlist */}
            <div className="flex items-center space-x-4 mb-[20px]">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock?.quantity === 0} // Disable if out of stock
                className={`flex-1 h-[50px] rounded-[25px] font-medium text-[16px] ${
                  product.stock?.quantity > 0
                    ? "bg-[#333] text-white hover:opacity-90"
                    : "bg-[#999] text-white cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <button className="p-2 text-[#666] hover:text-[#333] transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            {/* Expandable Sections */}
            <div className="space-y-[10px]">
              <div className="bg-[#f9f9f9] rounded-[8px]">
                <details open>
                  <summary className="flex justify-between items-center p-[15px] cursor-pointer text-[#333] font-semibold">
                    Description & Fit <ChevronDown className="w-5 h-5" />
                  </summary>
                  <div className="px-[15px] pb-[15px] text-[#666] text-[14px] leading-relaxed">
                    {product.description ||
                      "Loose-fit sweatshirt hoodie in medium weight cotton-blend fabric with a generous, laid-back oversized silhouette. Jersey-lined, drawstring hood, dropped shoulders, long sleeves, and a kangaroo pocket. Wide ribbing at cuffs and hem. Soft, brushed inside."}
                  </div>
                </details>
              </div>

              <div className="bg-[#f9f9f9] rounded-[8px]">
                <details open>
                  <summary className="flex justify-between items-center p-[15px] cursor-pointer text-[#333] font-semibold">
                    Shipping <ChevronDown className="w-5 h-5" />
                  </summary>
                  <div className="px-[15px] pb-[15px] space-y-3">
                    <div className="flex items-center text-[#666] text-[14px]">
                      <Truck className="w-5 h-5 mr-3" />
                      <span>
                        <strong>Dec 50%</strong> - 3-4 Working Days
                      </span>
                    </div>
                    <div className="flex items-center text-[#666] text-[14px]">
                      <Package className="w-5 h-5 mr-3" />
                      <span>
                        <strong>Regular Package</strong> - 10 - 12 October 2024
                      </span>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-[12px] p-[40px] shadow-md shadow-gray-400 ">
          <h2 className="text-[24px] font-semibold text-[#333] mb-[30px]">
            Rating & Reviews
          </h2>
          <div className="flex flex-col md:flex-row items-center md:items-start mb-[30px] space-y-4 md:space-y-0 md:space-x-[50px]">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-baseline">
                <span className="text-[72px] font-bold text-[#333]">
                  {product.ratings?.average?.toFixed(1) || "0.0"}
                </span>
                <span className="text-[24px] text-[#999]"> / 5</span>
              </div>
              <p className="text-[#666] text-[14px] mt-1">
                ({product.ratings?.count || 0} Reviews)
              </p>
            </div>
            <div className="flex-1 w-full md:w-auto">
              {[5, 4, 3, 2, 1].map((stars, i) => {
                const percentage = product.ratings?.breakdown?.[stars] || 0;
                return (
                  <div key={i} className="flex items-center mb-1">
                    <span className="text-[14px] text-[#333] w-4">{stars}</span>
                    <Star className="w-4 h-4 text-[#ffd700] fill-[#ffd700] ml-1 mr-2" />
                    <div className="bg-[#e0e0e0] h-2 flex-grow rounded-full">
                      <div
                        className="bg-[#ffd700] h-full rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-[12px] text-[#999] ml-2 w-8 text-right">
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Featured Review */}
          <div className="flex items-start bg-[#f9f9f9] p-[20px] rounded-[8px] shadow-sm">
            <img
              src="https://via.placeholder.com/40/f0f0f0/333?text=A"
              alt="Alex Mathis"
              className="w-[40px] h-[40px] rounded-full mr-4 object-cover"
            />
            <div>
              <div className="flex items-center mb-1">
                <span className="font-semibold text-[#333]">Alex Mathis</span>
                <span className="text-[#999] text-[12px] ml-3">
                  13 Oct 2024
                </span>
              </div>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < 5
                        ? "text-[#ffd700] fill-[#ffd700]"
                        : "text-gray-300 fill-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[#666] text-[14px] leading-relaxed">
                &quot;NextGen&apos;s dedication to sustainability and ethical
                practices resonates strongly with today&apos;s consumers,
                positioning the brand as a responsible choice in the fashion
                world.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
