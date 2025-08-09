
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Search, Palette, Info, BookOpen } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export function StitchLibrary() {
  const [stitches, setStitches] = useState<any[]>([]);
  const [filteredStitches, setFilteredStitches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "basic", label: "Basic Stitches" },
    { value: "special", label: "Special Stitches" },
    { value: "post", label: "Post Stitches" },
    { value: "increase", label: "Increases" },
    { value: "decrease", label: "Decreases" }
  ];

  const difficulties = [
    { value: "all", label: "All Levels" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" }
  ];

  useEffect(() => {
    fetchStitches();
  }, []);

  useEffect(() => {
    filterStitches();
  }, [stitches, searchTerm, categoryFilter, difficultyFilter]);

  const fetchStitches = async () => {
    try {
      const response = await fetch('/api/stitches');
      if (!response.ok) throw new Error('Failed to fetch stitches');
      
      const data = await response.json();
      setStitches(data);
    } catch (error) {
      console.error('Error fetching stitches:', error);
      toast.error("Failed to load stitch library");
    } finally {
      setIsLoading(false);
    }
  };

  const filterStitches = () => {
    let filtered = stitches.filter(stitch => {
      const matchesSearch = !searchTerm || 
        stitch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stitch.abbreviation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stitch.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === "all" || stitch.category === categoryFilter;
      const matchesDifficulty = difficultyFilter === "all" || stitch.difficulty === difficultyFilter;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    setFilteredStitches(filtered);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yarn-coral mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stitch library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <Card className="bg-white/60 backdrop-blur-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-6 w-6 text-yarn-lavender" />
            <span>Stitch Library</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search stitches by name, abbreviation, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Difficulty</label>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map(difficulty => (
                      <SelectItem key={difficulty.value} value={difficulty.value}>
                        {difficulty.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing {filteredStitches.length} of {stitches.length} stitches
        </p>
      </div>

      {/* Stitch Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStitches.map((stitch, index) => (
          <motion.div
            key={stitch.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <StitchCard stitch={stitch} />
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredStitches.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Palette className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No stitches found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search terms or filters to find more stitches.
          </p>
        </div>
      )}
    </div>
  );
}

function StitchCard({ stitch }: { stitch: any }) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'bg-yarn-coral text-white';
      case 'special': return 'bg-yarn-mint text-white';
      case 'post': return 'bg-yarn-lavender text-white';
      case 'increase': return 'bg-yarn-sage text-white';
      case 'decrease': return 'bg-yarn-peach text-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="group cursor-pointer overflow-hidden card-hover">
          {/* Stitch Image or Symbol */}
          <div className="relative h-32 bg-muted">
            {stitch.imageUrl ? (
              <Image
                src={stitch.imageUrl}
                alt={stitch.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-yarn-lavender/20 to-yarn-mint/20">
                <div className="text-center">
                  {stitch.symbol ? (
                    <div className="text-4xl font-bold text-gray-600 mb-1">{stitch.symbol}</div>
                  ) : (
                    <Palette className="h-12 w-12 text-gray-400 mb-2 mx-auto" />
                  )}
                  <div className="text-xs text-gray-500">{stitch.abbreviation}</div>
                </div>
              </div>
            )}
          </div>

          {/* Stitch Info */}
          <CardHeader className="pb-3">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg leading-tight group-hover:text-yarn-lavender transition-colors">
                  {stitch.name}
                </CardTitle>
                <Badge className="text-xs font-mono bg-gray-100 text-gray-700">
                  {stitch.abbreviation}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {stitch.description}
              </p>
              
              <div className="flex justify-between items-center pt-1">
                <Badge className={`text-xs ${getCategoryColor(stitch.category)}`}>
                  {stitch.category}
                </Badge>
                <Badge className={`text-xs ${getDifficultyColor(stitch.difficulty)}`}>
                  {stitch.difficulty}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5 text-yarn-lavender" />
            <span>{stitch.name} ({stitch.abbreviation})</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Stitch Overview */}
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Badge className={`${getCategoryColor(stitch.category)}`}>
                {stitch.category} stitch
              </Badge>
              <Badge className={`ml-2 ${getDifficultyColor(stitch.difficulty)}`}>
                {stitch.difficulty} level
              </Badge>
            </div>
            
            {stitch.symbol && (
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-700 mb-1">{stitch.symbol}</div>
                <div className="text-xs text-gray-500">Crochet Symbol</div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
              <Info className="h-4 w-4" />
              <span>Description</span>
            </h4>
            <p className="text-gray-700 leading-relaxed">{stitch.description}</p>
          </div>

          {/* Instructions */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>How to Make</span>
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-800 leading-relaxed">{stitch.instructions}</p>
            </div>
          </div>

          {/* Tips */}
          {stitch.tips && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">💡 Tips & Notes</h4>
              <div className="bg-yarn-mint/10 p-4 rounded-lg border-l-4 border-yarn-mint">
                <p className="text-gray-700 leading-relaxed">{stitch.tips}</p>
              </div>
            </div>
          )}

          {/* Stitch Image */}
          {stitch.imageUrl && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Visual Example</h4>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src={stitch.imageUrl}
                  alt={`${stitch.name} example`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
