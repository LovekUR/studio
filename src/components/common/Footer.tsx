"use client";

import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-primary text-white py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-2">ChalkBoard AI</h2>
          <p className="text-sm text-white/80">
            Empowering teachers with smart AI tools for multi-grade classrooms.
          </p>
        </div>

        {/* Middle: Links */}
        <div className="flex flex-col space-y-2">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
        </div>

        {/* Right: Socials */}
        <div className="flex items-center space-x-4">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="w-6 h-6 hover:text-accent" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="w-6 h-6 hover:text-accent" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="w-6 h-6 hover:text-accent" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="w-6 h-6 hover:text-accent" />
          </a>
        </div>
      </div>

      <div className="border-t border-white/20 mt-8 pt-4 text-center text-sm text-white/60">
        © {new Date().getFullYear()} ChalkBoard AI. All rights reserved.
      </div>
    </footer>
  );
}
