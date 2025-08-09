
import { Navigation } from "../components/navigation";
import { HeroSection } from "../components/hero-section";
import { PatternGenerator } from "../components/pattern-generator";
import { YarnCalculator } from "../components/yarn-calculator";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { BookOpen, FolderOpen, Calculator, Palette, ArrowRight, Scissors } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Quick Access Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to <span className="text-yarn-coral">Crochet</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From pattern generation to project tracking, we've got all your crochet needs covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickAccessCard
            href="/patterns"
            icon={BookOpen}
            title="Browse Patterns"
            description="Explore hundreds of free crochet patterns"
            color="yarn-coral"
          />
          <QuickAccessCard
            href="/projects"
            icon={FolderOpen}
            title="Track Projects"
            description="Manage and track your current projects"
            color="yarn-mint"
          />
          <QuickAccessCard
            href="/calculator"
            icon={Calculator}
            title="Yarn Calculator"
            description="Calculate yarn requirements for any project"
            color="yarn-lavender"
          />
          <QuickAccessCard
            href="/stitches"
            icon={Palette}
            title="Stitch Library"
            description="Learn new stitches and techniques"
            color="yarn-sage"
          />
        </div>
      </section>

      {/* Featured Tools */}
      <section className="bg-white/60 backdrop-blur-sm py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Tools</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Try our most popular tools right here on the homepage
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Pattern Generator Preview */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900 flex items-center space-x-2">
                <Scissors className="h-6 w-6 text-yarn-coral" />
                <span>Pattern Generator</span>
              </h3>
              <PatternGenerator />
            </div>

            {/* Yarn Calculator Preview */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900 flex items-center space-x-2">
                <Calculator className="h-6 w-6 text-yarn-mint" />
                <span>Yarn Calculator</span>
              </h3>
              <YarnCalculator />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Inspiration Gallery</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See what amazing projects our community is creating
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GalleryCard
            imageUrl="https://craftykittydesigns.com/cdn/shop/products/il_fullxfull.5383534101_cmql.jpg?v=1725332038&width=1445"
            title="Cozy Winter Hat"
            category="Hat"
          />
          <GalleryCard
            imageUrl="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgbsNAxbW476H5xR9bcljus7KSmVJFzSHzgOhB0bqzi3yBmpN5ObhXwDnpmjzOb8m9HZMFlMOxiWOYNlur4dVbEYmk7jNYIMr9xWVSaY5WT2fydIr5xf_3QVnv4uxQ2dC1jpl9FkrdWzN_c/s1600/IMG_2938.JPG"
            title="Classic Scarf"
            category="Scarf"
          />
          <GalleryCard
            imageUrl="https://m.media-amazon.com/images/I/81Q6nTYT0dL.jpg"
            title="Baby Blanket"
            category="Blanket"
          />
          <GalleryCard
            imageUrl="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg6xh0PdZjLuTIBOD8UKonZbh6sAR1Q65D9Eyptk9N9cPTyQapiA64YeAROIsqHzra5VCqAsvS2YIRXutKCzEpQuey_Ve2sdm46PCJQX0wxmvYDNaaZTqlLzigpmDtYDBsnwbWlTofwRPmj/s1600/IMG_8515+copy.JPG"
            title="Cute Amigurumi"
            category="Amigurumi"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-yarn py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Next Project?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of crafters using CrochetCraft to create beautiful handmade items.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-yarn-coral hover:bg-gray-100 px-8 py-4 text-lg">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/patterns">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                Browse Patterns
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-yarn-coral p-2 rounded-lg">
                  <Scissors className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl">CrochetCraft</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Your digital crochet companion for creating beautiful patterns, tracking projects, and mastering new stitches.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Tools</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/patterns" className="hover:text-white transition-colors">Pattern Library</Link></li>
                <li><Link href="/calculator" className="hover:text-white transition-colors">Yarn Calculator</Link></li>
                <li><Link href="/stitches" className="hover:text-white transition-colors">Stitch Library</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/projects" className="hover:text-white transition-colors">My Projects</Link></li>
                <li><Link href="/auth/signin" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/auth/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CrochetCraft. Made with ❤️ for the crochet community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function QuickAccessCard({ 
  href, 
  icon: Icon, 
  title, 
  description, 
  color 
}: {
  href: string;
  icon: any;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Link href={href}>
      <Card className="group cursor-pointer card-hover bg-white/60 backdrop-blur-sm border border-gray-200">
        <CardContent className="p-6 text-center">
          <div className={`bg-${color} p-4 rounded-lg w-fit mx-auto mb-4 group-hover:scale-110 transition-transform`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-yarn-coral transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function GalleryCard({ 
  imageUrl, 
  title, 
  category 
}: {
  imageUrl: string;
  title: string;
  category: string;
}) {
  return (
    <Card className="group overflow-hidden card-hover">
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      </div>
      <CardContent className="p-4">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{category}</p>
      </CardContent>
    </Card>
  );
}
