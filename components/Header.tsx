'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ModeToggle } from './ModeToggle';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image 
            src="/images/moodify-logo.png" 
            alt="Moodify Logo" 
            width={40} 
            height={40}
            className="rounded-full"
          />
          <span className="font-bold text-xl">Moodify</span>
        </Link>

        {/* Mobile menu button */}
        <button 
          className="block md:hidden"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/journal" className="text-foreground/80 hover:text-foreground transition-colors">
            AI Journal
          </Link>
          <Link href="/analysis" className="text-foreground/80 hover:text-foreground transition-colors">
            Mood Analysis
          </Link>
          <Link href="/profile" className="text-foreground/80 hover:text-foreground transition-colors">
            Profile
          </Link>
          <ModeToggle />
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b absolute w-full">
          <nav className="flex flex-col space-y-4 p-4">
            <Link 
              href="/" 
              className="text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/journal" 
              className="text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              AI Journal
            </Link>
            <Link 
              href="/analysis" 
              className="text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Mood Analysis
            </Link>
            <Link 
              href="/profile" 
              className="text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            <div className="pt-2">
              <ModeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;