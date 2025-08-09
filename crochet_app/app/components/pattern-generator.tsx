
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Wand2, Download, BookOpen, Clock, Package } from "lucide-react";
import { toast } from "sonner";

interface PatternGeneratorProps {
  onGenerate?: (pattern: any) => void;
}

export function PatternGenerator({ onGenerate }: PatternGeneratorProps) {
  const [inputs, setInputs] = useState({
    itemType: "",
    size: "",
    yarnWeight: "",
    stitchType: "sc",
    gauge: {
      stitchesPerInch: 4,
      rowsPerInch: 4.5
    }
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPattern, setGeneratedPattern] = useState<any>(null);

  const itemTypes = [
    { value: "hat", label: "Hat" },
    { value: "scarf", label: "Scarf" },
    { value: "blanket", label: "Blanket" }
  ];

  const sizes = {
    hat: [
      { value: "baby", label: "Baby (14\")" },
      { value: "child", label: "Child (18\")" },
      { value: "adult_small", label: "Adult Small (20\")" },
      { value: "adult_medium", label: "Adult Medium (22\")" },
      { value: "adult_large", label: "Adult Large (24\")" }
    ],
    scarf: [
      { value: "child", label: "Child (6\" x 40\")" },
      { value: "adult", label: "Adult (8\" x 60\")" }
    ],
    blanket: [
      { value: "baby", label: "Baby (30\" x 36\")" },
      { value: "throw", label: "Throw (50\" x 60\")" },
      { value: "twin", label: "Twin (66\" x 90\")" }
    ]
  };

  const yarnWeights = [
    { value: "lace", label: "Lace Weight (0)" },
    { value: "sport", label: "Sport Weight (2)" },
    { value: "dk", label: "DK Weight (3)" },
    { value: "worsted", label: "Worsted Weight (4)" },
    { value: "chunky", label: "Chunky Weight (5)" },
    { value: "super_chunky", label: "Super Chunky Weight (6)" }
  ];

  const stitchTypes = [
    { value: "sc", label: "Single Crochet (SC)" },
    { value: "hdc", label: "Half Double Crochet (HDC)" },
    { value: "dc", label: "Double Crochet (DC)" }
  ];

  const handleGenerate = async () => {
    if (!inputs.itemType || !inputs.size || !inputs.yarnWeight) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/patterns/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inputs)
      });

      if (!response.ok) {
        throw new Error('Failed to generate pattern');
      }

      const result = await response.json();
      setGeneratedPattern(result);
      onGenerate?.(result);
      
      toast.success("Pattern generated successfully!");
      
    } catch (error) {
      console.error('Pattern generation error:', error);
      toast.error("Failed to generate pattern. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && generatedPattern) {
      try {
        await navigator.share({
          title: generatedPattern.pattern.title,
          text: generatedPattern.pattern.description,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(`${generatedPattern.pattern.title}\n${generatedPattern.pattern.description}\n\nGenerated at CrochetCraft: ${window.location.href}`);
        toast.success("Pattern details copied to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(`${generatedPattern?.pattern?.title || 'Custom Pattern'}\n${generatedPattern?.pattern?.description || ''}\n\nGenerated at CrochetCraft: ${window.location.href}`);
      toast.success("Pattern details copied to clipboard!");
    }
  };

  return (
    <div className="space-y-8">
      <Card className="bg-white/60 backdrop-blur-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wand2 className="h-6 w-6 text-yarn-coral" />
            <span>Custom Pattern Generator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Item Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">What would you like to make?</label>
              <Select 
                value={inputs.itemType} 
                onValueChange={(value) => setInputs(prev => ({ ...prev, itemType: value, size: "" }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select item type" />
                </SelectTrigger>
                <SelectContent>
                  {itemTypes.map(item => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Size */}
            {inputs.itemType && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Size</label>
                <Select 
                  value={inputs.size} 
                  onValueChange={(value) => setInputs(prev => ({ ...prev, size: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes[inputs.itemType as keyof typeof sizes]?.map(size => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Yarn Weight */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Yarn Weight</label>
              <Select 
                value={inputs.yarnWeight} 
                onValueChange={(value) => setInputs(prev => ({ ...prev, yarnWeight: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select yarn weight" />
                </SelectTrigger>
                <SelectContent>
                  {yarnWeights.map(yarn => (
                    <SelectItem key={yarn.value} value={yarn.value}>
                      {yarn.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stitch Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Primary Stitch</label>
              <Select 
                value={inputs.stitchType} 
                onValueChange={(value) => setInputs(prev => ({ ...prev, stitchType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stitch type" />
                </SelectTrigger>
                <SelectContent>
                  {stitchTypes.map(stitch => (
                    <SelectItem key={stitch.value} value={stitch.value}>
                      {stitch.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Gauge */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Stitches per Inch</label>
              <Input
                type="number"
                step="0.5"
                value={inputs.gauge.stitchesPerInch}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  gauge: { ...prev.gauge, stitchesPerInch: parseFloat(e.target.value) || 4 }
                }))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Rows per Inch</label>
              <Input
                type="number"
                step="0.5"
                value={inputs.gauge.rowsPerInch}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  gauge: { ...prev.gauge, rowsPerInch: parseFloat(e.target.value) || 4.5 }
                }))}
                className="w-full"
              />
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!inputs.itemType || !inputs.size || !inputs.yarnWeight || isGenerating}
            className="w-full bg-yarn-coral hover:bg-yarn-coral/90"
            size="lg"
          >
            {isGenerating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Wand2 className="h-5 w-5 mr-2" />
              </motion.div>
            ) : (
              <Wand2 className="h-5 w-5 mr-2" />
            )}
            {isGenerating ? "Generating Pattern..." : "Generate Pattern"}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Pattern Display */}
      {generatedPattern && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="bg-white border-yarn-coral/20">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-gray-900">
                    {generatedPattern.pattern.title}
                  </CardTitle>
                  <p className="text-gray-600 mt-2">{generatedPattern.pattern.description}</p>
                </div>
                <div className="flex space-x-2">
                  <Badge variant="skill">{generatedPattern.pattern.skillLevel}</Badge>
                  <Badge variant="difficulty">{generatedPattern.pattern.itemType}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pattern Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Package className="h-6 w-6 text-yarn-coral mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Yarn Needed</div>
                  <div className="font-semibold">{generatedPattern.yarnRequirements.yardage} yards</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="h-6 w-6 text-yarn-mint mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Estimated Time</div>
                  <div className="font-semibold">{Math.round(generatedPattern.estimatedTime / 60)} hours</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <BookOpen className="h-6 w-6 text-yarn-lavender mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Instructions</div>
                  <div className="font-semibold">{generatedPattern.pattern.instructions.length} rows</div>
                </div>
              </div>

              {/* Materials */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Materials Needed:</h3>
                <ul className="space-y-2">
                  {generatedPattern.pattern.materials.map((material: any, index: number) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yarn-coral rounded-full"></div>
                      <span className="text-gray-700">
                        <strong>{material.name}</strong> - {material.amount}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleShare} variant="outline">
                  Share Pattern
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="yarn">
                  Start Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
