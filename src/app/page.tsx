'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import {
  Sun,
  Moon,
  Globe,
  Layers,
  BrainCircuit,
  Image as ImageIcon,
  Mic,
  ClipboardList,
} from 'lucide-react';

const features = [
  {
    title: 'Hyper-Local Content',
    description: 'Request stories, explanations, or worksheets in local languages.',
    icon: <Globe className="w-12 h-12 text-primary" />,
    href: '/hyper-local-content',
    color: 'hover:border-primary',
  },
  {
    title: 'Differentiated Materials',
    description: 'Generate worksheets for multiple grade levels from textbook photos.',
    icon: <Layers className="w-12 h-12 text-primary" />,
    href: '/differentiated-materials',
    color: 'hover:border-accent',
  },
  {
    title: 'Instant Knowledge Base',
    description: 'Get instant answers with simple analogies.',
    icon: <BrainCircuit className="w-12 h-12 text-primary" />,
    href: '/knowledge-base',
    color: 'hover:border-primary',
  },
  {
    title: 'Visual Aid Generator',
    description: 'Create simple line drawings and charts from text prompts.',
    icon: <ImageIcon className="w-12 h-12 text-primary" />,
    href: '/visual-aid',
    color: 'hover:border-accent',
  },
  {
    title: 'Audio Reading Assessment',
    description: 'Assess student reading by analyzing recorded speech.',
    icon: <Mic className="w-12 h-12 text-primary" />,
    href: '/reading-assessment',
    color: 'hover:border-primary',
  },
  {
    title: 'Game & Lesson Planner',
    description: 'Generate educational games and detailed lesson plans.',
    icon: <ClipboardList className="w-12 h-12 text-primary" />,
    href: '/lesson-planner',
    color: 'hover:border-accent',
  },
];


export default function Home() {
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

      {/* Hero Section */}
      <header className="text-center py-16 md:py-24 bg-gradient-to-br from-primary/10 to-transparent">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary">ChalkBoard AI</h1>
        <p className="mt-4 text-lg md:text-xl max-w-xl mx-auto text-foreground/80">
          Your AI-powered classroom companion — empowering teachers in multi-grade schools.
        </p>
        <Link
          href="#features"
          className="inline-block mt-8 px-6 py-3 bg-primary text-white rounded-full shadow-md hover:shadow-xl transition"
        >
          Explore Features
        </Link>
      </header>

      {/* Features */}
      <main className="w-full max-w-6xl mx-auto px-4 md:px-8" id="features">
        <section className="text-center mb-16">
          <h2 className="text-3xl font-headline font-bold mb-4">
            What Can ChalkBoard AI Do?
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-foreground/90">
            Save time, personalize lessons, and keep your chalkboard smarter than ever.
          </p>
        </section>

       <section>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {features.map((feature, index) => (
      <Link key={feature.title} href={feature.href}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileInView={{ opacity: [0, 1], y: [20, 0] }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`p-6 border-2 border-transparent rounded-xl shadow-sm transition-all ${feature.color} cursor-pointer`}
        >
          <div className="flex flex-col items-center text-center">
            {feature.icon}
            <h3 className="font-headline mt-4 text-2xl">{feature.title}</h3>
            <p className="mt-2 text-foreground/80">{feature.description}</p>
          </div>
        </motion.div>
      </Link>
    ))}
  </div>
</section>
      </main>

      {/* Contact Section */}
      <section
        id="contact"
        className="relative mt-32 px-4 md:px-0 py-20 bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Left Text */}
          <div className="md:w-1/2 text-center md:text-left px-4 md:px-8">
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4">
              Let’s Make Teaching Easier
            </h2>
            <p className="text-lg text-foreground/80 mb-6 max-w-md">
              “A good teacher can inspire hope, ignite the imagination, and instill a love of learning.” —{' '}
              <em>Brad Henry</em>
            </p>
            <p className="text-foreground/70">
              Have an idea? Want to collaborate? We’d love to hear from you.
            </p>
          </div>

          {/* Right Form */}
          <div className="md:w-1/2 w-full px-4 md:px-8">
            <form
              className="w-full max-w-lg backdrop-blur-xl bg-white/30 dark:bg-black/30 border border-gray-200 dark:border-gray-700 p-8 rounded-3xl shadow-2xl flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                alert('Your message has been sent! 📬');
              }}
            >
              <div>
                <label className="block mb-1 font-semibold">Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="w-full p-4 border border-gray-300 rounded-lg dark:bg-black/50 dark:border-gray-600 bg-white/50 focus:ring-2 focus:ring-primary transition"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full p-4 border border-gray-300 rounded-lg dark:bg-black/50 dark:border-gray-600 bg-white/50 focus:ring-2 focus:ring-primary transition"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Message</label>
                <textarea
                  placeholder="How can we help?"
                  rows={4}
                  required
                  className="w-full p-4 border border-gray-300 rounded-lg dark:bg-black/50 dark:border-gray-600 bg-white/50 focus:ring-2 focus:ring-primary transition"
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-4 bg-primary text-white rounded-full shadow-md hover:shadow-xl transition font-semibold"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
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
    </div>
  );
}
