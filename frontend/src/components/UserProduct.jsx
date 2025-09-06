"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchProducts } from "@/store/slices/productSlice";
import { addToCart } from "@/store/slices/cartSlice";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Star,
  ShoppingCart,
  Eye,
  ArrowRight,
  Image as ImageIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserProducts() {
  const { products, loading, error } = useSelector((state) => state.product);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = (product) => {
    if (!token) {
      alert("Please login to add items to your cart.");
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
  };

  const handleBuyNow = (product) => {
    if (!token) {
      alert("Please login to continue.");
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
    router.push("/customer/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
          {[...Array(6)].map((_, i) => (
            <Card
              key={i}
              className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-3xl p-6"
            >
              <Skeleton className="w-full h-64 rounded-2xl mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-3 pt-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 p-6">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto text-destructive text-3xl">
            ⚠️
          </div>
          <p className="text-destructive text-lg font-medium">
            Error loading products: {error}
          </p>
          <Button onClick={() => dispatch(fetchProducts())} className="mt-4">
            Retry Loading Products
          </Button>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 p-6">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground text-3xl">
            📦
          </div>
          <p className="text-muted-foreground text-lg">
            No products available at the moment.
          </p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-background py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-primary/40 rounded-full text-sm font-medium text-primary shadow-lg animate-in fade-in zoom-in-90 duration-500">
            🛍️ Featured Collection
          </div>

          <h2 className="text-4xl lg:text-6xl font-extrabold text-balance leading-tight tracking-tight">
            Shop Our
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 py-2">
              Premium Products
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Carefully curated selection of high-quality items that combine
            style, functionality, and exceptional value.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card
              key={product._id}
              className="group cursor-pointer bg-card/50 backdrop-blur-sm border border-primary/10 rounded-3xl p-6 hover:bg-card/70 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/15 transition-all duration-500 hover:-translate-y-3 relative overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-0">
                {/* Product Image Scroller */}
                <div className="relative w-full h-64 rounded-2xl mb-6 overflow-hidden bg-gradient-to-br from-muted/50 to-card">
                  <div className="flex w-full h-full transition-transform duration-500 ease-in-out group-hover:translate-x-[-100%]">
                    <img
                      src={
                        product.images?.[0] ||
                        "/placeholder.svg?height=300&width=400&query=premium product showcase"
                      }
                      alt={product.name}
                      className="min-w-full h-full object-cover transition-transform duration-700"
                      onError={(e) =>
                        (e.target.src = "/premium-product-showcase.png")
                      }
                    />
                    {product.images?.[1] && (
                      <img
                        src={product.images[1]}
                        alt={`${product.name} alternate view`}
                        className="min-w-full h-full object-cover transition-transform duration-700"
                        onError={(e) =>
                          (e.target.src = "/premium-product-showcase-alt.png")
                        }
                      />
                    )}
                    {!product.images?.[0] && !product.images?.[1] && (
                      <div className="min-w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <ImageIcon size={48} />
                        <span className="ml-2">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Quick View Badge */}
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md border border-primary/20 rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex items-center gap-1">
                    <Eye className="h-4 w-4 text-foreground" />
                    <span className="text-xs font-medium text-foreground">
                      Quick View
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold text-primary">
                      ${product.price?.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">
                        (4.8)
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {product.description ||
                      "Premium quality product with exceptional craftsmanship and attention to detail. Designed for modern living."}
                  </p>
                </div>
              </CardContent>
              <CardFooter
                className="flex gap-3 pt-6 px-0"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-primary text-primary-foreground font-semibold py-3 px-4 rounded-xl hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 active:scale-95 group"
                >
                  <ShoppingCart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />{" "}
                  Add to Cart
                </Button>
                <Button
                  onClick={() => handleBuyNow(product)}
                  variant="outline"
                  className="flex-1 border-primary text-primary font-semibold py-3 px-4 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/15 active:scale-95 group"
                >
                  Buy Now{" "}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View All Products CTA */}
        <div className="text-center mt-16 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-500">
          <Button
            asChild
            className="inline-flex items-center justify-center px-10 py-6 text-lg bg-gradient-to-r from-primary to-purple-500 text-primary-foreground font-semibold rounded-xl hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group"
          >
            <a href="/customer/filter">
              <span>View All Products</span>
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
