"use client";

import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import ProductForm from "../../../components/ProductForm";
import { createProduct } from "../../../store/slices/productSlice";

export default function AddProductPage() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.product);

  const handleSubmit = async (formData) => {
    const result = await dispatch(createProduct(formData));
    if (result.meta.requestStatus === "fulfilled") {
      router.push("/admin/display-products");
    } else {
      alert("Failed to create product: " + result.error.message);
    }
  };

  const handleCancel = () => {
    router.push("/admin/display-products");
  };

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden">
      <div className="container mx-auto p-4 relative z-10">
      
          {/* Content Area */}
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <ProductForm
              mode="add"
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={loading}
            />
          </div>
        </div>
      </div>
  );
}
