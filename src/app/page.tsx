'use client';

import { Loader2 } from 'lucide-react';

export default function RootPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
    </div>
  );
}