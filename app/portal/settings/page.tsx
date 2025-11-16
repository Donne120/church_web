'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/browser';
import { getCurrentProfile, hasAdminUser, promoteToAdmin, signOut } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { User, Shield, LogOut } from 'lucide-react';
import type { Profile } from '@/lib/rbac';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  phone: z.string().optional(),
});

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [canBootstrapAdmin, setCanBootstrapAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      // Check if user is authenticated
      const isAuth = localStorage.getItem('cysmf_authenticated') === 'true';
      if (!isAuth) {
        router.push('/auth');
        return;
      }

      // Get user from localStorage
      const userStr = localStorage.getItem('cysmf_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setProfile(user as Profile);
        reset({
          full_name: user.full_name || '',
          phone: user.phone || '',
        });
      }

      setCanBootstrapAdmin(false); // No bootstrap needed with hardcoded login
    } catch (error) {
      console.log('Error loading profile');
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(data: any) {
    if (!profile) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          phone: data.phone || null,
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      await loadProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  }

  async function handleBootstrapAdmin() {
    if (!profile) return;

    try {
      const success = await promoteToAdmin(profile.id);
      if (success) {
        toast.success('You are now an administrator!');
        await loadProfile();
      } else {
        toast.error('Failed to promote to admin');
      }
    } catch (error: any) {
      console.error('Error bootstrapping admin:', error);
      toast.error(error.message || 'Failed to promote to admin');
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      toast.success('Signed out successfully');
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0D2B66]">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#0D2B66] rounded-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile?.email || ''}
                disabled
                className="mt-1 bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                {...register('full_name')}
                className="mt-1"
              />
              {errors.full_name && (
                <p className="text-sm text-red-600 mt-1">{errors.full_name.message as string}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                {...register('phone')}
                className="mt-1"
                placeholder="+250 XXX XXX XXX"
              />
            </div>

            <div>
              <Label>Role</Label>
              <div className="mt-1">
                <Badge className="bg-[#FFB703] text-black">
                  {profile?.role.replace('_', ' ')}
                </Badge>
              </div>
            </div>

            <Button
              type="submit"
              disabled={updating}
              className="bg-[#0D2B66] hover:bg-[#0D2B66]/90"
            >
              {updating ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Admin Bootstrap */}
      {canBootstrapAdmin && (
        <Card className="border-[#FFB703]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#FFB703] rounded-lg">
                <Shield className="h-6 w-6 text-black" />
              </div>
              <div>
                <CardTitle>Admin Bootstrap</CardTitle>
                <CardDescription>
                  No administrator exists. Promote yourself to admin.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-4">
              This is a one-time action available only when no admin exists in the system.
              As an admin, you'll have full access to all features and data.
            </p>
            <Button
              onClick={handleBootstrapAdmin}
              className="bg-[#FFB703] text-black hover:bg-[#FFB703]/90"
            >
              <Shield className="h-4 w-4 mr-2" />
              Become Administrator
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Sign Out */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <LogOut className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <CardTitle>Sign Out</CardTitle>
              <CardDescription>End your current session</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleSignOut}
            variant="destructive"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

