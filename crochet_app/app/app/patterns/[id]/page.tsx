import { Navigation } from "../../../components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { BookOpen, Clock, User, Share } from "lucide-react";

export default function PatternDetailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white/60 backdrop-blur-sm border border-gray-200">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl text-gray-900 mb-2">
                  Pattern Details
                </CardTitle>
                <p className="text-gray-600">
                  This pattern page is being loaded. Individual pattern details would be displayed here.
                </p>
              </div>
              <div className="flex space-x-2">
                <Badge variant="skill">intermediate</Badge>
                <Badge variant="outline">hat</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Pattern Author</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>3 hours</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>15 rows</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Materials Needed:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Worsted weight yarn - 150 yards</li>
                    <li>• Size I (5.5mm) crochet hook</li>
                    <li>• Yarn needle</li>
                    <li>• Stitch markers</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Pattern Details:</h3>
                  <div className="space-y-2">
                    <p className="text-gray-700"><strong>Gauge:</strong> 4 sts/inch, 4.5 rows/inch</p>
                    <p className="text-gray-700"><strong>Hook Size:</strong> I/5.5mm</p>
                    <p className="text-gray-700"><strong>Skill Level:</strong> Intermediate</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button className="bg-yarn-coral hover:bg-yarn-coral/90">
                  Start Project
                </Button>
                <Button variant="outline">
                  <Share className="h-4 w-4 mr-2" />
                  Share Pattern
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}