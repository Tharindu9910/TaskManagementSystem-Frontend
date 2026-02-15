'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, token } = useAuth(); // Assuming you store 'token' in context
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not loading and no token exists, boot them to login
    if (!isLoading && !token) {
      router.push('/login');
    }
  }, [isLoading, token, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  // Only render children if authenticated
  return token ? <>{children}</> : null;
}