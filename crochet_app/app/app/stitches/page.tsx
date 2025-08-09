
import { Navigation } from "../../components/navigation";
import { StitchLibrary } from "../../components/stitch-library";

export default function StitchesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Stitch Library</h1>
          <p className="text-xl text-gray-600">
            Master new techniques with our comprehensive collection of crochet stitches and tutorials.
          </p>
        </div>
        
        <StitchLibrary />
      </main>
    </div>
  );
}
