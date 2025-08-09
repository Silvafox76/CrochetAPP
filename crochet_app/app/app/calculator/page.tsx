
import { Navigation } from "../../components/navigation";
import { YarnCalculator } from "../../components/yarn-calculator";
import { PatternGenerator } from "../../components/pattern-generator";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Calculator, Wand2, Lightbulb } from "lucide-react";

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Crochet Calculator</h1>
          <p className="text-xl text-gray-600">
            Calculate yarn requirements, generate custom patterns, and get estimates for your projects.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Yarn Calculator */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Calculator className="h-6 w-6 text-yarn-mint" />
              <h2 className="text-2xl font-semibold text-gray-900">Yarn Requirements</h2>
            </div>
            <YarnCalculator />
          </div>

          {/* Pattern Generator */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Wand2 className="h-6 w-6 text-yarn-coral" />
              <h2 className="text-2xl font-semibold text-gray-900">Pattern Generator</h2>
            </div>
            <PatternGenerator />
          </div>
        </div>

        {/* Tips and Guidelines */}
        <Card className="mt-12 bg-white/60 backdrop-blur-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-6 w-6 text-yarn-peach" />
              <span>Calculator Tips & Guidelines</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🧶 Yarn Calculations</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Always buy 10-15% extra yarn for gauge swatches</li>
                  <li>• Consider buying all yarn from the same dye lot</li>
                  <li>• Different brands may have varying yardage per weight</li>
                  <li>• Factor in your personal tension when estimating</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">📐 Pattern Generation</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Make a gauge swatch before starting your project</li>
                  <li>• Measurements should be taken accurately</li>
                  <li>• Generated patterns are starting points - adjust as needed</li>
                  <li>• Consider ease and fit preferences for garments</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
