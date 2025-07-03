"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'dark bg-black text-white' : 'bg-white text-black'}>
      {/* NavBar */}
      <nav className="w-full flex justify-between items-center p-4 md:p-8 border-b border-gray-200 dark:border-gray-700">
        <Link href="/" className="font-headline text-2xl font-bold text-primary">
          ChalkBoard AI
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="#features" className="hover:text-primary transition">
            Features
          </Link>
          <Link href="#contact" className="hover:text-primary transition">
            Contact
          </Link>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </nav>
    </div>
  );
}
