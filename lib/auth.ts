/**
 * Authentication utilities
 * Helper functions for auth operations
 */

import { supabase } from './supabase/browser';
import { Profile } from './rbac';

/**
 * Get the current user's profile
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Failed to get current profile:', error);
    return null;
  }
}

/**
 * Bootstrap user profile on first sign-in
 */
export async function bootstrapProfile(userId: string, email: string, fullName?: string): Promise<void> {
  try {
    // First check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', userId)
      .single();

    // If profile exists, we're done
    if (existingProfile && !fetchError) {
      console.log('Profile already exists, skipping bootstrap');
      return;
    }

    // If profile doesn't exist, create it
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        full_name: fullName || email.split('@')[0],
        role: 'CAMPUS_LEADER', // Default role
      });

    if (insertError) {
      // If insert fails due to duplicate, that's okay
      if (insertError.code === '23505') {
        console.log('Profile already exists (race condition), skipping');
        return;
      }
      console.error('Error bootstrapping profile:', insertError);
      throw insertError;
    }

    console.log('Profile bootstrapped successfully');
  } catch (error) {
    console.error('Failed to bootstrap profile:', error);
    // Don't throw - allow sign-in to continue even if bootstrap fails
  }
}

/**
 * Check if any admin exists in the system
 */
export async function hasAdminUser(): Promise<boolean> {
  try {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'ADMIN');

    if (error) {
      console.error('Error checking for admin:', error);
      return true; // Fail safe - assume admin exists
    }

    return (count || 0) > 0;
  } catch (error) {
    console.error('Failed to check for admin:', error);
    return true; // Fail safe
  }
}

/**
 * Promote current user to admin (one-time bootstrap)
 */
export async function promoteToAdmin(userId: string): Promise<boolean> {
  try {
    // Double-check no admin exists
    const adminExists = await hasAdminUser();
    if (adminExists) {
      throw new Error('An admin already exists');
    }

    const { error } = await supabase
      .from('profiles')
      .update({ role: 'ADMIN' })
      .eq('id', userId);

    if (error) {
      console.error('Error promoting to admin:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to promote to admin:', error);
    return false;
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

