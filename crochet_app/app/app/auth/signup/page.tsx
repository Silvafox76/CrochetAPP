
import { Navigation } from "../../../components/navigation";
import { SignUpForm } from "../../../components/auth/signup-form";
import { Card, CardContent } from "../../../components/ui/card";
import { Scissors, Sparkles, Target, Users } from "lucide-react";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <main className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Branding */}
          <div className="hidden lg:block">
            <Card className="bg-white/60 backdrop-blur-sm border border-gray-200 shadow-lg">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="bg-yarn-coral p-4 rounded-full">
                      <Scissors className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Join CrochetCraft</h2>
                    <p className="text-gray-600 leading-relaxed">
                      Start your crochet journey with the most comprehensive digital companion for crafters.
                    </p>
                  </div>

                  <div className="relative h-40 rounded-lg overflow-hidden">
                    <Image
                      src="https://cdn.abacus.ai/images/37c5f399-8f6b-477f-b80a-a1d8d494096d.png"
                      alt="Colorful yarn and crochet hooks"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 text-left">
                      <div className="bg-yarn-coral p-2 rounded-lg">
                        <Target className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Custom Patterns</h4>
                        <p className="text-sm text-gray-600">Generate patterns tailored to your measurements</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 text-left">
                      <div className="bg-yarn-mint p-2 rounded-lg">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Project Tracking</h4>
                        <p className="text-sm text-gray-600">Keep track of your progress with smart tools</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 text-left">
                      <div className="bg-yarn-lavender p-2 rounded-lg">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Learn & Grow</h4>
                        <p className="text-sm text-gray-600">Master new stitches with our detailed guides</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side - Sign Up Form */}
          <div>
            <SignUpForm />
          </div>
        </div>
      </main>
    </div>
  );
}
