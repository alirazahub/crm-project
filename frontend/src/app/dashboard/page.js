"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, logoutUser } from "../../store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, loading, isAuthenticated, isInitialized } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only redirect after we've checked authentication status
    if (isInitialized && !isAuthenticated) {
      router.push("/login");
    }
  }, [isInitialized, isAuthenticated, router]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/login");
  };

  // Show loading while checking authentication
  if (!isInitialized || loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) return null;

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button
      className="bg-blue-500 text-white px-4 py-2 rounded"
       onClick={handleLogout}>Logout</button>
    </div>
  );
}
