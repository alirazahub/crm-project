'use client';

import HeroSection from '@/components/HeroSection';
import Navbar from '../../../components/Navbar';
import UserProducts from '@/components/UserProduct';

import { useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Only check once loading is done
    if (!loading && status !== 'loading') {
      if (!isAuthenticated && status === 'unauthenticated') {
        router.replace("/sign-in"); // replace prevents back button issues
      } else {
        setChecked(true); // allow rendering
      }
    }
  }, [isAuthenticated, loading, status, router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <HeroSection />
      <UserProducts />
    
    </>
  );
}
