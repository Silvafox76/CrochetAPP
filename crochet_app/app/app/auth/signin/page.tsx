
import { Navigation } from "../../../components/navigation";
import { SignInForm } from "../../../components/auth/signin-form";
import { Card, CardContent } from "../../../components/ui/card";
import { Scissors } from "lucide-react";
import Image from "next/image";

export default function SignInPage() {
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome Back!</h2>
                    <p className="text-gray-600 leading-relaxed">
                      Continue your crochet journey with personalized patterns, project tracking, and our comprehensive stitch library.
                    </p>
                  </div>

                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src="https://cdn.abacus.ai/images/37c5f399-8f6b-477f-b80a-a1d8d494096d.png"
                      alt="Colorful yarn and crochet hooks"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-yarn-coral">1000+</div>
                      <div className="text-sm text-gray-600">Patterns</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yarn-mint">50+</div>
                      <div className="text-sm text-gray-600">Stitches</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side - Sign In Form */}
          <div>
            <SignInForm />
          </div>
        </div>
      </main>
    </div>
  );
}
