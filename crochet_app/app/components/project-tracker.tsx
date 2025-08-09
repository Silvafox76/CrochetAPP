
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { 
  FolderOpen, 
  Plus, 
  Play, 
  Pause, 
  CheckCircle, 
  Calendar,
  Clock,
  MoreVertical,
  Trash2,
  Edit
} from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export function ProjectTracker() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    if (session) {
      fetchProjects();
    }
  }, [session]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProjectProgress = async (projectId: string, rowNumber: number, completed: boolean) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rowNumber, completed })
      });

      if (!response.ok) throw new Error('Failed to update progress');
      
      // Refresh projects
      fetchProjects();
      toast.success(completed ? "Row marked as complete!" : "Progress updated");
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error("Failed to update progress");
    }
  };

  if (!session) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign in to track projects</h3>
        <p className="text-gray-600">Create an account to save and track your crochet projects.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yarn-coral mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Projects</h2>
          <p className="text-gray-600 mt-1">Track your progress and manage your crochet projects</p>
        </div>
        
        <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
          <DialogTrigger asChild>
            <Button className="bg-yarn-coral hover:bg-yarn-coral/90">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <NewProjectForm 
              onSuccess={() => {
                fetchProjects();
                setShowNewProjectDialog(false);
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Project Stats */}
      {projects.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-yarn-coral/10 to-yarn-coral/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yarn-coral">
                {projects.filter(p => p.status === 'in_progress').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yarn-mint/10 to-yarn-mint/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yarn-mint">
                {projects.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yarn-lavender/10 to-yarn-lavender/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yarn-lavender">
                {projects.filter(p => p.status === 'on_hold').length}
              </div>
              <div className="text-sm text-gray-600">On Hold</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yarn-peach/10 to-yarn-peach/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-700">
                {projects.length}
              </div>
              <div className="text-sm text-gray-600">Total Projects</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Project Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-6">
            Start your first crochet project and track your progress!
          </p>
          <Button 
            onClick={() => setShowNewProjectDialog(true)}
            className="bg-yarn-coral hover:bg-yarn-coral/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Project
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProjectCard 
                project={project} 
                onUpdate={fetchProjects}
                onProgressUpdate={updateProjectProgress}
                onSelect={setSelectedProject}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onProgressUpdate={updateProjectProgress}
          onUpdate={fetchProjects}
        />
      )}
    </div>
  );
}

function ProjectCard({ 
  project, 
  onUpdate, 
  onProgressUpdate, 
  onSelect 
}: { 
  project: any; 
  onUpdate: () => void;
  onProgressUpdate: (id: string, row: number, completed: boolean) => void;
  onSelect: (project: any) => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-yarn-mint';
      case 'in_progress': return 'bg-yarn-coral';
      case 'on_hold': return 'bg-yarn-lavender';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Play className="h-4 w-4" />;
      case 'on_hold': return <Pause className="h-4 w-4" />;
      default: return <FolderOpen className="h-4 w-4" />;
    }
  };

  const completedRows = project.progress?.filter((p: any) => p.completed).length || 0;
  const totalRows = project.pattern?.instructions?.length || 1;
  const progressPercentage = (completedRows / totalRows) * 100;

  return (
    <Card className="group overflow-hidden card-hover">
      {/* Project Image */}
      <div className="relative h-40 bg-muted">
        {project.imageUrl || project.pattern?.imageUrl ? (
          <Image
            src={project.imageUrl || project.pattern?.imageUrl}
            alt={project.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-yarn-coral/20 to-yarn-mint/20">
            <FolderOpen className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          <Badge className={`${getStatusColor(project.status)} text-white`}>
            {getStatusIcon(project.status)}
            <span className="ml-1 capitalize">{project.status.replace('_', ' ')}</span>
          </Badge>
        </div>
      </div>

      {/* Project Info */}
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-yarn-coral transition-colors">
            {project.name}
          </h3>
          {project.pattern && (
            <p className="text-sm text-gray-600">{project.pattern.title}</p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Progress</span>
            <span>{completedRows}/{totalRows} rows</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Project Details */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>
              {project.startedAt 
                ? new Date(project.startedAt).toLocaleDateString()
                : 'Not started'
              }
            </span>
          </div>
          
          {project.status === 'in_progress' && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yarn-coral rounded-full animate-pulse"></div>
              <span>Active</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button 
            onClick={() => onSelect(project)}
            className="flex-1" 
            size="sm" 
            variant="yarn"
          >
            View Details
          </Button>
          
          {project.status === 'in_progress' && (
            <Button 
              onClick={() => onProgressUpdate(project.id, project.currentRow + 1, true)}
              size="sm" 
              variant="outline"
              className="px-3"
            >
              <Plus className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function NewProjectForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    notes: "",
    patternId: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error("Please enter a project name");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create project');
      
      toast.success("Project created successfully!");
      onSuccess();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error("Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="projectName" className="text-sm font-medium text-gray-700">
          Project Name *
        </label>
        <Input
          id="projectName"
          placeholder="My cozy hat project"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="projectNotes" className="text-sm font-medium text-gray-700">
          Notes
        </label>
        <Textarea
          id="projectNotes"
          placeholder="Any notes about this project..."
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-yarn-coral hover:bg-yarn-coral/90"
      >
        {isSubmitting ? "Creating Project..." : "Create Project"}
      </Button>
    </form>
  );
}

function ProjectDetailModal({ 
  project, 
  onClose, 
  onProgressUpdate, 
  onUpdate 
}: { 
  project: any; 
  onClose: () => void;
  onProgressUpdate: (id: string, row: number, completed: boolean) => void;
  onUpdate: () => void;
}) {
  const [showDetails, setShowDetails] = useState(true);

  return (
    <Dialog open={showDetails} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FolderOpen className="h-5 w-5 text-yarn-coral" />
            <span>{project.name}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Project Overview */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {project.pattern && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Pattern</h4>
                  <p className="text-gray-700">{project.pattern.title}</p>
                </div>
              )}
              
              {project.notes && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                  <p className="text-gray-700">{project.notes}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completed Rows</span>
                    <span>{project.progress?.filter((p: any) => p.completed).length || 0} / {project.pattern?.instructions?.length || 0}</span>
                  </div>
                  <Progress 
                    value={((project.progress?.filter((p: any) => p.completed).length || 0) / (project.pattern?.instructions?.length || 1)) * 100} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Row Progress */}
          {project.pattern?.instructions && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Pattern Instructions</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {project.pattern.instructions.map((instruction: any) => {
                  const isCompleted = project.progress?.some((p: any) => 
                    p.rowNumber === instruction.rowNumber && p.completed
                  );
                  
                  return (
                    <div 
                      key={instruction.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                        isCompleted 
                          ? 'bg-yarn-mint/10 border-yarn-mint/20' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <Button
                        onClick={() => onProgressUpdate(project.id, instruction.rowNumber, !isCompleted)}
                        size="sm"
                        variant={isCompleted ? "default" : "outline"}
                        className={`p-1 h-8 w-8 ${isCompleted ? 'bg-yarn-mint hover:bg-yarn-mint/90' : ''}`}
                      >
                        {isCompleted && <CheckCircle className="h-4 w-4" />}
                      </Button>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">
                            {instruction.rowType === 'foundation' ? 'Foundation' : `Row ${instruction.rowNumber}`}
                          </span>
                          {instruction.stitchCount && (
                            <Badge variant="outline" className="text-xs">
                              {instruction.stitchCount} sts
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{instruction.instruction}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
