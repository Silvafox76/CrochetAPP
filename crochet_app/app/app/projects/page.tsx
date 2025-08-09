
import { Navigation } from "../../components/navigation";
import { ProjectTracker } from "../../components/project-tracker";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectTracker />
      </main>
    </div>
  );
}
