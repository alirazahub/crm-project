"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GoogleSignUp() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGoogleSignUp = () => {
     e.preventDefault(); 
    // This will open Google sign-in popup
    signIn("google", { callbackUrl: "/dashboard" });
  };

  // Handle the complete authentication flow
  useEffect(() => {
    if (session?.user) {
      // User is authenticated, now sync with backend
      syncUserWithBackend(session.user);
    }
  }, [session]);

  const syncUserWithBackend = async (user) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/google-sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          image: user.image,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ User synced with backend:", data.message);
        
        // Redirect based on user role
        if (data.user.role === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/customer/homepage");
        }
      } else {
        console.error("❌ Backend sync failed");
        // Default redirect for regular users
        router.push("/customer/homepage");
      }
    } catch (error) {
      console.error("❌ Error syncing with backend:", error);
      // Default redirect for regular users on error
      router.push("/customer/homepage");
    }
  };

  return (
    <button
      onClick={handleGoogleSignUp}
      className="w-full bg-white text-gray-700 py-2 px-4 rounded-lg font-semibold border-2 border-gray-300 hover:bg-gray-50 transition flex items-center justify-center gap-3"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Sign up with Google
    </button>
  );
}
