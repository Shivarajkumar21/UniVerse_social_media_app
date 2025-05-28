'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      setIsValidToken(false);
    } else {
      // In a real app, you might want to validate the token with the server
      setIsValidToken(true);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any existing toasts
    toast.dismiss();
    
    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      toast.success('Your password has been reset successfully. Redirecting to login...');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/signin');
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidToken === null) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center p-6 bg-gray-50 dark:bg-darkTheme">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </main>
    );
  }

  if (!isValidToken) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center p-6 bg-gray-50 dark:bg-darkTheme">
        <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          {/* Left Side - Logo */}
          <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56">
              <Image
                src="/_6dd78af8-728b-43b4-9083-9b6eb8bb0017-removebg-preview.png"
                alt="UniVerse logo"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 640px) 8rem, (max-width: 768px) 10rem, 14rem"
              />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-center text-gray-800 dark:text-white">UniVerse</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">Your gateway to academic excellence</p>
          </div>
          
          {/* Right Side - Content */}
          <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Invalid or Expired Link</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                The password reset link is invalid or has expired. Please request a new one.
              </p>
              <Link
                href="/forgot-password"
                className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Request New Reset Link
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-6 bg-gray-50 dark:bg-darkTheme">
      <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Logo */}
        <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56">
            <Image
              src="/_6dd78af8-728b-43b4-9083-9b6eb8bb0017-removebg-preview.png"
              alt="UniVerse logo"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 640px) 8rem, (max-width: 768px) 10rem, 14rem"
            />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-center text-gray-800 dark:text-white">UniVerse</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">Your gateway to academic excellence</p>
        </div>
        
        {/* Right Side - Form */}
        <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Reset Your Password</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Please enter your new password below.
            </p>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/signin"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
