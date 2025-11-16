'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  LayoutDashboard, 
  FileText, 
  Download, 
  Settings, 
  Menu,
  LogOut,
  User,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  username: string;
  role: string;
  full_name: string;
}

const navItems = [
  { href: '/portal', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/portal/reports', label: 'Reports', icon: FileText },
  { href: '/portal/join-requests', label: 'Join Requests', icon: Users, adminOnly: true },
  { href: '/portal/exports', label: 'Exports', icon: Download },
  { href: '/portal/settings', label: 'Settings', icon: Settings },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    loadProfile();
  }, []);

  function loadProfile() {
    try {
      // Check if user is authenticated
      const isAuth = localStorage.getItem('cysmf_authenticated') === 'true';
      if (!isAuth) {
        router.push('/auth');
        return;
      }

      // Get user profile from localStorage
      const userDataStr = localStorage.getItem('cysmf_user');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        setProfile(userData);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  }

  function handleSignOut() {
    try {
      // Clear localStorage
      localStorage.removeItem('cysmf_authenticated');
      localStorage.removeItem('cysmf_user');
      
      // Clear cookie
      document.cookie = 'cysmf_auth=; path=/; max-age=0';
      
      toast.success('Signed out successfully');
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  }

  const isActive = (href: string) => {
    if (href === '/portal') return pathname === '/portal';
    return pathname.startsWith(href);
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo/Header */}
      <div className="p-6 border-b">
        <Link href="/portal" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0D2B66] text-white font-bold text-lg">
            C
          </div>
          <div>
            <div className="font-bold text-lg text-[#0D2B66]">CYSMF</div>
            <div className="text-xs text-gray-500">Leaders Portal</div>
          </div>
        </Link>
      </div>

      {/* Profile Info */}
      {profile && (
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFB703] text-black font-semibold">
              {profile.full_name?.charAt(0) || profile.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {profile.full_name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">{profile.role.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems
          .filter(item => !item.adminOnly || (profile && ['ADMIN', 'SECRETARIAT'].includes(profile.role)))
          .map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  active
                    ? 'bg-[#0D2B66] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          asChild
        >
          <Link href="/">
            <User className="h-4 w-4 mr-2" />
            Public Site
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D2B66] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r">
        <Sidebar />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between">
        <Link href="/portal" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0D2B66] text-white font-bold text-sm">
            C
          </div>
          <span className="font-bold text-[#0D2B66]">CYSMF Portal</span>
        </Link>
        
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
        <div className="container mx-auto p-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}


