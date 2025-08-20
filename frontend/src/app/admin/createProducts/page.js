"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import ProductForm from "../../../components/ProductForm";
import { createProduct } from "../../../store/slices/productSlice";

export default function AddProductPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.product);

  const handleSubmit = async (formData) => {
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
    console.log("Sending product data:", formData);

    const result = await dispatch(createProduct(formData));
    if (result.meta.requestStatus === "fulfilled") {
      console.log("Product created successfully:", result.payload);
      router.push("/admin/createProducts");
    } else {
      console.error("Failed to create product:", result.error);
      alert("Failed to create product: " + result.error.message);
    }
  };

  const handleCancel = () => {
    router.push("/display-products");
  };

  return (
    <ProductForm
      mode="add"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={loading}
    />
  );
}