'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RootPage() {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (token) {
        router.push('/dashboard'); // Go to tasks if authenticated [cite: 27]
      } else {
        router.push('/login'); // Go to login if not [cite: 26]
      }
    }
  }, [isLoading, token, router]);

  // Loading spinner for professional UX [cite: 29, 33]
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
    </div>
  );
}