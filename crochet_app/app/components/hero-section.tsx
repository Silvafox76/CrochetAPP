
"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight, Sparkles, Target, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <section className="relative min-h-[80vh] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 stitch-pattern opacity-30"></div>
      
      {/* Hero Background Image */}
      <div className="absolute inset-0 opacity-20">
        <div className="relative h-full w-full">
          <Image
            src="https://cdn.abacus.ai/images/37c5f399-8f6b-477f-b80a-a1d8d494096d.png"
            alt="Colorful yarns and crochet hooks"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-8">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <div className="flex justify-center">
              <div className="bg-yarn-coral/10 backdrop-blur-sm border border-yarn-coral/20 px-4 py-2 rounded-full">
                <span className="text-yarn-coral font-semibold">✨ Your Digital Crochet Companion</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Create Beautiful
              <span className="bg-gradient-yarn bg-clip-text text-transparent"> Crochet </span>
              Patterns
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Generate custom patterns, track your progress, calculate yarn needs, and master new stitches 
              with our comprehensive crochet companion.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/patterns">
              <Button size="lg" variant="yarn" className="group px-8 py-4 text-lg">
                Start Crafting
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/calculator">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg bg-white/60 backdrop-blur-sm border-gray-300">
                Try Calculator
              </Button>
            </Link>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-20"
          >
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={Target}
                title="Custom Patterns"
                description="Generate patterns tailored to your exact measurements and preferences"
                color="yarn-coral"
              />
              <FeatureCard
                icon={Sparkles}
                title="Progress Tracking"
                description="Keep track of your projects with step-by-step guidance and row counters"
                color="yarn-mint"
              />
              <FeatureCard
                icon={Users}
                title="Stitch Library"
                description="Master new techniques with our comprehensive stitch guides and tutorials"
                color="yarn-lavender"
              />
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 pt-16 border-t border-gray-200"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCard number="50+" label="Stitch Types" />
              <StatCard number="1000+" label="Patterns" />
              <StatCard number="25+" label="Item Types" />
              <StatCard number="100%" label="Free to Use" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, description, color }: {
  icon: any;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className={`bg-${color} p-3 rounded-lg w-fit mb-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      const target = parseInt(number.replace(/[^0-9]/g, ''));
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
    }
  }, [inView, number]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-yarn-coral animate-count-up">
        {number.includes('+') ? `${count}+` : number.includes('%') ? `${count}%` : count}
      </div>
      <div className="text-gray-600 font-medium">{label}</div>
    </div>
  );
}
