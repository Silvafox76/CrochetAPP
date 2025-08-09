
"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Menu, X, Scissors, User, LogOut, Home, BookOpen, FolderOpen, Calculator, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/patterns", label: "Patterns", icon: BookOpen },
    { href: "/projects", label: "Projects", icon: FolderOpen },
    { href: "/calculator", label: "Calculator", icon: Calculator },
    { href: "/stitches", label: "Stitches", icon: Palette },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-yarn-coral p-2 rounded-lg">
              <Scissors className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">CrochetCraft</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-1 text-gray-600 hover:text-yarn-coral transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {session?.user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    {(session.user as any).firstName || session.user.name || "Crafter"}
                  </span>
                </div>
                <Button
                  onClick={() => signOut()}
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="yarn" size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-600 hover:text-yarn-coral hover:bg-gray-50 transition-all"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}
              
              <div className="pt-4 border-t border-gray-100">
                {session?.user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <User className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-700">
                        {(session.user as any).firstName || session.user.name || "Crafter"}
                      </span>
                    </div>
                    <Button
                      onClick={() => signOut()}
                      variant="ghost"
                      className="w-full justify-start flex items-center space-x-3 px-3"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                      <Button variant="yarn" className="w-full justify-start">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
