'use client';
import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from './ui/button';

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="sticky top-0 z-50 w-full p-4 backdrop-blur-md bg-black/80 border-b border-gray-800">
      <div className="container mx-auto flex flex-row justify-between items-center gap-4">
        {/* Logo - Monochrome */}
        <Link href="#" className="text-2xl font-light tracking-tight group flex-shrink-0">
          <span className="text-gray-300 group-hover:text-white transition-colors">
            Unseen
          </span>
          <span className="font-medium text-gray-400">Note</span>
        </Link>

        {/* Auth section */}
        <div className="flex-shrink-0">
          {session ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm font-medium text-gray-400">
                Welcome,{' '}
                <span className="text-white font-semibold truncate max-w-[120px] md:max-w-none">
                  {user?.username || user?.email}
                </span>
              </span>
              <Button
                onClick={() => signOut()}
                className="h-9 px-4 text-sm border border-gray-700 bg-gray-900 hover:bg-gray-800 text-gray-200 hover:text-white transition-all"
                variant="outline"
              >
                Sign out
              </Button>
            </div>
          ) : (
            <Link href="/sign-in">
              <Button className="h-9 px-4 text-sm bg-white text-black hover:bg-gray-200 transition-all border border-gray-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;