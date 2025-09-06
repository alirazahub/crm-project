"use client";

import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ProductForm from "../../../../components/ProductForm";
import Loader from "@/components/loader";
import {
  updateProduct,
  fetchProductById,
} from "../../../../store/slices/productSlice";

export default function UpdateProductPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.product);
  const [initialData, setInitialData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const productId = params.id;
  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        try {
          // Assuming you have a getProductById action in your slice
          const result = await dispatch(fetchProductById(productId));
          if (result.meta.requestStatus === "fulfilled") {
            setInitialData(result.payload);
          } else {
            console.error("Failed to fetch product:", result.error);
            alert("Failed to fetch product data");
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setDataLoading(false);
        }
      }
    };

    fetchProduct();
  }, [productId, dispatch, router]);

  const handleSubmit = async (formData) => {
    console.log("Updating product with data:", formData);

    const result = await dispatch(
      updateProduct({
        id: productId,
        updatedData: formData,
      })
    );

    if (result.meta.requestStatus === "fulfilled") {
      console.log("Product updated successfully:", result.payload);
      router.push("/admin/display-products");
    } else {
      console.error("Failed to update product:", result.error);
      alert("Failed to update product: " + result.error.message);
    }
  };

  const handleCancel = () => {
    router.push("/display-products");
  };

if (dataLoading) {
    return (
      <div className="dark min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden flex items-center justify-center">
        <div className="flex flex-col items-center animate-fadeIn">
          <Loader />
          <p className="text-lg text-slate-300 mt-4 animate-pulse">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ProductForm
      mode="update"
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={loading}
    />
  );
}
