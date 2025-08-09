
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Search, Filter, Heart, Clock, User, BookOpen, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export function PatternLibrary() {
  const [patterns, setPatterns] = useState<any[]>([]);
  const [filteredPatterns, setFilteredPatterns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemTypeFilter, setItemTypeFilter] = useState("all");
  const [skillLevelFilter, setSkillLevelFilter] = useState("all");

  const itemTypes = [
    { value: "all", label: "All Types" },
    { value: "hat", label: "Hats" },
    { value: "scarf", label: "Scarves" },
    { value: "blanket", label: "Blankets" },
    { value: "sweater", label: "Sweaters" },
    { value: "amigurumi", label: "Amigurumi" }
  ];

  const skillLevels = [
    { value: "all", label: "All Levels" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "expert", label: "Expert" }
  ];

  useEffect(() => {
    fetchPatterns();
  }, []);

  useEffect(() => {
    filterPatterns();
  }, [patterns, searchTerm, itemTypeFilter, skillLevelFilter]);

  const fetchPatterns = async () => {
    try {
      const response = await fetch('/api/patterns');
      if (!response.ok) throw new Error('Failed to fetch patterns');
      
      const data = await response.json();
      setPatterns(data);
    } catch (error) {
      console.error('Error fetching patterns:', error);
      toast.error("Failed to load patterns");
    } finally {
      setIsLoading(false);
    }
  };

  const filterPatterns = () => {
    let filtered = patterns.filter(pattern => {
      const matchesSearch = !searchTerm || 
        pattern.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pattern.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesItemType = itemTypeFilter === "all" || pattern.itemType === itemTypeFilter;
      const matchesSkillLevel = skillLevelFilter === "all" || pattern.skillLevel === skillLevelFilter;

      return matchesSearch && matchesItemType && matchesSkillLevel;
    });

    setFilteredPatterns(filtered);
  };

  const handleShare = async (pattern: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: pattern.title,
          text: pattern.description,
          url: `${window.location.origin}/patterns/${pattern.id}`
        });
      } catch (error) {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(`${pattern.title}\n${pattern.description}\n\nView at CrochetCraft: ${window.location.origin}/patterns/${pattern.id}`);
        toast.success("Pattern link copied to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(`${pattern.title}\n${pattern.description}\n\nView at CrochetCraft: ${window.location.origin}/patterns/${pattern.id}`);
      toast.success("Pattern link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yarn-coral mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading patterns...</p>
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
            <BookOpen className="h-6 w-6 text-yarn-coral" />
            <span>Pattern Library</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search patterns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Item Type</label>
                <Select value={itemTypeFilter} onValueChange={setItemTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    {itemTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Skill Level</label>
                <Select value={skillLevelFilter} onValueChange={setSkillLevelFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {skillLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
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
          Showing {filteredPatterns.length} of {patterns.length} patterns
        </p>
      </div>

      {/* Pattern Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatterns.map((pattern, index) => (
          <motion.div
            key={pattern.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <PatternCard pattern={pattern} onShare={handleShare} />
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredPatterns.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No patterns found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search terms or filters to find more patterns.
          </p>
          <Button onClick={() => {
            setSearchTerm("");
            setItemTypeFilter("all");
            setSkillLevelFilter("all");
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}

function PatternCard({ pattern, onShare }: { pattern: any; onShare: (pattern: any) => void }) {
  const authorName = pattern.author?.name || 
                    `${pattern.author?.firstName || ''} ${pattern.author?.lastName || ''}`.trim() || 
                    'CrochetCraft';

  return (
    <Card className="group overflow-hidden card-hover">
      {/* Pattern Image */}
      <div className="relative h-48 bg-muted">
        {pattern.imageUrl ? (
          <Image
            src={pattern.imageUrl}
            alt={pattern.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-yarn-coral/20 to-yarn-mint/20">
            <BookOpen className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Button
            onClick={() => onShare(pattern)}
            size="sm"
            variant="secondary"
            className="bg-white/80 hover:bg-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Pattern Info */}
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg leading-tight group-hover:text-yarn-coral transition-colors">
              {pattern.title}
            </CardTitle>
            <div className="flex space-x-1 ml-2">
              <Badge variant="skill">{pattern.skillLevel}</Badge>
              <Badge variant="outline">{pattern.itemType}</Badge>
            </div>
          </div>
          
          {pattern.description && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {pattern.description}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Pattern Details */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>{authorName}</span>
            </div>
            
            {pattern.estimatedTime && (
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{Math.round(pattern.estimatedTime / 60)}h</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Link href={`/patterns/${pattern.id}`} className="flex-1">
              <Button className="w-full" size="sm" variant="yarn">
                View Pattern
              </Button>
            </Link>
            <Button 
              onClick={() => onShare(pattern)}
              size="sm" 
              variant="outline"
              className="px-3"
            >
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
