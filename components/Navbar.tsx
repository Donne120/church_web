'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const publicLinks = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/campus', label: 'Campus' },
  { href: '/media', label: 'Media' },
  { href: '/get-involved', label: 'Get Involved' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Check localStorage for auth status
    const checkAuth = () => {
      const isAuth = localStorage.getItem('cysmf_authenticated') === 'true';
      setIsAuthenticated(isAuth);
    };

    checkAuth();

    // Listen for storage changes (in case user signs in/out in another tab)
    window.addEventListener('storage', checkAuth);
    
    // Also check on pathname change (in case user just signed in)
    checkAuth();

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0D2B66] text-white font-bold text-lg">
              C
            </div>
            <span className="hidden sm:inline-block font-bold text-lg text-[#0D2B66]">
              CYSMF
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(link.href)
                    ? 'bg-[#0D2B66] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Button */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <Button asChild variant="default" className="bg-[#FFB703] text-black hover:bg-[#FFB703]/90">
                <Link href="/portal">Portal</Link>
              </Button>
            ) : (
              <Button asChild variant="default" className="bg-[#0D2B66] hover:bg-[#0D2B66]/90">
                <Link href="/auth">Leader Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                {publicLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-2 text-base font-medium rounded-md transition-colors ${
                      isActive(link.href)
                        ? 'bg-[#0D2B66] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 border-t">
                  {isAuthenticated ? (
                    <Button asChild className="w-full bg-[#FFB703] text-black hover:bg-[#FFB703]/90">
                      <Link href="/portal" onClick={() => setMobileOpen(false)}>
                        Portal
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild className="w-full bg-[#0D2B66] hover:bg-[#0D2B66]/90">
                      <Link href="/auth" onClick={() => setMobileOpen(false)}>
                        Leader Sign In
                      </Link>
                    </Button>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}


