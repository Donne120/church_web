'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Hardcoded credentials
const VALID_USERNAME = 'Welcome';
const VALID_PASSWORD = 'John3!16';

export default function AuthPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get('redirectedFrom');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simple hardcoded check
      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        // Store auth in localStorage
        localStorage.setItem('cysmf_authenticated', 'true');
        localStorage.setItem('cysmf_user', JSON.stringify({
          username: VALID_USERNAME,
          role: 'ADMIN',
          full_name: 'CYSMF Admin'
        }));
        
        // Set a cookie for middleware
        document.cookie = 'cysmf_auth=true; path=/; max-age=86400'; // 24 hours
        
        toast.success('Signed in successfully!');
        
        // Small delay to show the toast
        setTimeout(() => {
          router.push(redirectedFrom || '/portal');
        }, 500);
      } else {
        toast.error('Invalid username or password');
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error('Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-[#0D2B66]">Leader Portal</h1>
          <p className="text-gray-600 mt-2">Sign in to access your dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Welcome"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="mt-1"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0D2B66] hover:bg-[#0D2B66]/90"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <p className="text-xs text-center text-gray-500">
                By signing in, you agree to our terms and privacy policy
              </p>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Not a leader yet?{' '}
            <Link href="/get-involved" className="text-[#0D2B66] hover:underline font-medium">
              Get involved with CYSMF
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
