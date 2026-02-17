'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/src/services/auth';


export default function Register() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await authService.register(formData)
      router.push('/login'); // Redirect after successful registration
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form onSubmit={handleSubmit} className="p-8 border rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Create Account</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full p-2 mb-6 border rounded"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required 
        />
        <button 
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Processing...' : 'Register'}
        </button>
        <p className="mt-4 text-sm text-center">
          Already have an account? <Link href="/login" className="text-blue-500">Login</Link>
        </p>
      </form>
      <p className='text-xs'>Note:First request is going to be delayed!</p>
    </div>
  );
}