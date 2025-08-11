'use client';

import HeroSection from '@/components/HeroSection';
import Navbar from '../../../components/Navbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import UserProducts from '@/components/UserProduct';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (status === 'unauthenticated') {
      router.push("/sign-in");
    }
  }, [status, router]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session) {
    return null;
  }

  return (
    <>
      <Navbar />
      <HeroSection />
      <UserProducts />
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          
        </div>
      </main>
    </>
  );
}
