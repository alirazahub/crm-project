'use client';
import HeroSection from '@/components/HeroSection';
import UserProducts from '@/components/UserProduct';
import Navbar from '@/components/Navbar';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  //admin get redirected to dashboard if cache contains admin role
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      router.push('/admin/dashboard');
    }
    //extra dependencies triggered re renders 
  }, [isAuthenticated]); // ✅ Add dependencies

  return (
    <>
      <Navbar />
      <HeroSection />
      <UserProducts />
    </>
  );
}