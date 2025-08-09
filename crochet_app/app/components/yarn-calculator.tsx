
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Calculator, Package, Scale, Info, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function YarnCalculator() {
  const [inputs, setInputs] = useState({
    itemType: "",
    size: "",
    yarnWeight: "",
    customDimensions: {
      width: "",
      length: "",
      circumference: ""
    }
  });
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showCustom, setShowCustom] = useState(false);

  const itemTypes = [
    { value: "hat", label: "Hat" },
    { value: "scarf", label: "Scarf" },
    { value: "blanket", label: "Blanket" },
    { value: "sweater", label: "Sweater" },
    { value: "amigurumi", label: "Amigurumi" }
  ];

  const sizes = {
    hat: [
      { value: "baby", label: "Baby (14\")" },
      { value: "child", label: "Child (18\")" },
      { value: "adult_small", label: "Adult Small (20\")" },
      { value: "adult_medium", label: "Adult Medium (22\")" },
      { value: "adult_large", label: "Adult Large (24\")" },
      { value: "custom", label: "Custom Size" }
    ],
    scarf: [
      { value: "child", label: "Child (6\" x 40\")" },
      { value: "adult", label: "Adult (8\" x 60\")" },
      { value: "custom", label: "Custom Size" }
    ],
    blanket: [
      { value: "baby", label: "Baby (30\" x 36\")" },
      { value: "throw", label: "Throw (50\" x 60\")" },
      { value: "twin", label: "Twin (66\" x 90\")" },
      { value: "full", label: "Full (76\" x 90\")" },
      { value: "queen", label: "Queen (90\" x 90\")" },
      { value: "custom", label: "Custom Size" }
    ],
    sweater: [
      { value: "xs", label: "Extra Small" },
      { value: "s", label: "Small" },
      { value: "m", label: "Medium" },
      { value: "l", label: "Large" },
      { value: "xl", label: "Extra Large" },
      { value: "custom", label: "Custom Size" }
    ],
    amigurumi: [
      { value: "small", label: "Small (3-5\")" },
      { value: "medium", label: "Medium (6-8\")" },
      { value: "large", label: "Large (9-12\")" },
      { value: "custom", label: "Custom Size" }
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

  const handleCalculate = async () => {
    if (!inputs.itemType || !inputs.size || !inputs.yarnWeight) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsCalculating(true);

    try {
      const requestData = {
        itemType: inputs.itemType,
        size: inputs.size,
        yarnWeight: inputs.yarnWeight,
        customDimensions: showCustom ? {
          width: parseFloat(inputs.customDimensions.width) || undefined,
          length: parseFloat(inputs.customDimensions.length) || undefined,
          circumference: parseFloat(inputs.customDimensions.circumference) || undefined
        } : undefined
      };

      const response = await fetch('/api/yarn-calculator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Failed to calculate yarn requirements');
      }

      const calculationResult = await response.json();
      setResult(calculationResult);
      
      toast.success("Yarn requirements calculated!");
      
    } catch (error) {
      console.error('Calculation error:', error);
      toast.error("Failed to calculate requirements. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setInputs({
      itemType: "",
      size: "",
      yarnWeight: "",
      customDimensions: {
        width: "",
        length: "",
        circumference: ""
      }
    });
    setResult(null);
    setShowCustom(false);
  };

  return (
    <div className="space-y-8">
      <Card className="bg-white/60 backdrop-blur-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-6 w-6 text-yarn-mint" />
            <span>Yarn Requirements Calculator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Item Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Project Type</label>
              <Select 
                value={inputs.itemType} 
                onValueChange={(value) => {
                  setInputs(prev => ({ ...prev, itemType: value, size: "" }));
                  setShowCustom(false);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
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
                  onValueChange={(value) => {
                    setInputs(prev => ({ ...prev, size: value }));
                    setShowCustom(value === "custom");
                  }}
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
          </div>

          {/* Custom Dimensions */}
          {showCustom && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 p-4 bg-gray-50 rounded-lg border"
            >
              <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                <Info className="h-4 w-4" />
                <span>Custom Dimensions (inches)</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {inputs.itemType !== "hat" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Width</label>
                    <Input
                      type="number"
                      placeholder="Width in inches"
                      value={inputs.customDimensions.width}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        customDimensions: { ...prev.customDimensions, width: e.target.value }
                      }))}
                    />
                  </div>
                )}
                
                {inputs.itemType === "hat" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Circumference</label>
                    <Input
                      type="number"
                      placeholder="Head circumference"
                      value={inputs.customDimensions.circumference}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        customDimensions: { ...prev.customDimensions, circumference: e.target.value }
                      }))}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Length</label>
                  <Input
                    type="number"
                    placeholder="Length in inches"
                    value={inputs.customDimensions.length}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      customDimensions: { ...prev.customDimensions, length: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex space-x-3">
            <Button
              onClick={handleCalculate}
              disabled={!inputs.itemType || !inputs.size || !inputs.yarnWeight || isCalculating}
              className="flex-1 bg-yarn-mint hover:bg-yarn-mint/90"
              size="lg"
            >
              {isCalculating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Calculator className="h-5 w-5 mr-2" />
                </motion.div>
              ) : (
                <Calculator className="h-5 w-5 mr-2" />
              )}
              {isCalculating ? "Calculating..." : "Calculate Requirements"}
            </Button>
            
            <Button onClick={handleReset} variant="outline" size="lg">
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="bg-white border-yarn-mint/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-6 w-6 text-yarn-mint" />
                <span>Yarn Requirements</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Results */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-yarn-mint/10 to-yarn-mint/20 rounded-lg">
                  <Package className="h-8 w-8 text-yarn-mint mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-900">{result.yardage}</div>
                  <div className="text-sm text-gray-600">Yards Needed</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-yarn-lavender/10 to-yarn-lavender/20 rounded-lg">
                  <Scale className="h-8 w-8 text-yarn-lavender mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-900">{result.weightGrams}g</div>
                  <div className="text-sm text-gray-600">Weight</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-yarn-coral/10 to-yarn-coral/20 rounded-lg">
                  <div className="text-3xl font-bold text-gray-900">≈{Math.ceil(result.yardage / 200)}</div>
                  <div className="text-sm text-gray-600">Skeins (200yd each)</div>
                </div>
              </div>

              {/* Project Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Project Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <Badge variant="secondary">{result.itemType}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">{result.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Yarn Weight:</span>
                      <Badge variant="outline">{result.yarnWeight}</Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">💡 Tips & Notes</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {result.notes}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
