// app/page.js
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "../store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, loading, isAuthenticated, isInitialized } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isInitialized) {
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [isInitialized, isAuthenticated, router]);

  if (!isInitialized || loading) {
    return (
      <main style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Loading...</p>
      </main>
    );
  }

  return null; // Will redirect based on auth status
}
