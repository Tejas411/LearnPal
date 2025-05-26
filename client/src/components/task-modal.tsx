import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { TaskWithModule } from "@/lib/types";
import { 
  X, 
  Play, 
  FileText, 
  PenTool, 
  Check, 
  Bookmark, 
  StickyNote,
  Clock,
  ExternalLink
} from "lucide-react";

interface TaskModalProps {
  task: TaskWithModule;
  onClose: () => void;
}

export function TaskModal({ task, onClose }: TaskModalProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const getTaskIcon = () => {
    switch (task.type) {
      case 'video':
        return <Play className="text-red-600" size={20} />;
      case 'document':
        return <FileText className="text-blue-600" size={20} />;
      case 'assignment':
        return <PenTool className="text-green-600" size={20} />;
      default:
        return <FileText className="text-neutral-600" size={20} />;
    }
  };

  const getTaskTypeColor = () => {
    switch (task.type) {
      case 'video':
        return 'bg-red-100';
      case 'document':
        return 'bg-blue-100';
      case 'assignment':
        return 'bg-green-100';
      default:
        return 'bg-neutral-100';
    }
  };

  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      return apiRequest('POST', `/api/tasks/${taskId}/complete`);
    },
    onSuccess: () => {
      setIsCompleting(true);
      
      // Show completion animation
      setTimeout(() => {
        toast({
          title: "Great job! 🎉",
          description: "Task completed successfully. Keep up the momentum!",
        });
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["/api/tasks/today"] });
        queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
        queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
        
        setTimeout(() => {
          onClose();
        }, 1500);
      }, 500);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleComplete = () => {
    completeTaskMutation.mutate(task.id);
  };

  const renderTaskContent = () => {
    if (task.type === 'video' && task.contentUrl) {
      // Check if it's a YouTube URL
      if (task.contentUrl.includes('youtube.com') || task.contentUrl.includes('youtu.be')) {
        const videoId = task.contentUrl.includes('youtube.com') 
          ? task.contentUrl.split('v=')[1]?.split('&')[0]
          : task.contentUrl.split('/').pop();
        
        if (videoId) {
          return (
            <div className="aspect-video bg-neutral-900 rounded-xl mb-4 overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={task.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          );
        }
      }
    }

    // Fallback content display
    return (
      <div className="aspect-video bg-neutral-900 rounded-xl mb-4 flex items-center justify-center">
        <div className="text-center text-white">
          <div className={`w-16 h-16 ${getTaskTypeColor()} rounded-full mx-auto mb-4 flex items-center justify-center`}>
            {getTaskIcon()}
          </div>
          <p className="text-lg font-medium mb-2">{task.title}</p>
          <p className="text-sm opacity-70">{task.estimatedMinutes} minutes • {task.type}</p>
          {task.contentUrl && (
            <Button
              variant="outline"
              className="mt-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => window.open(task.contentUrl, '_blank')}
            >
              <ExternalLink size={16} className="mr-2" />
              Open Resource
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${getTaskTypeColor()} rounded-lg flex items-center justify-center`}>
                {getTaskIcon()}
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-neutral-800">
                  {task.title}
                </DialogTitle>
                <p className="text-sm text-neutral-600">
                  {task.module.course.title} • {task.module.title}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X size={16} />
            </Button>
          </div>
        </DialogHeader>

        <Separator />

        <div className="space-y-6">
          {/* Task Content */}
          {renderTaskContent()}

          {/* Task Description */}
          <div className="prose max-w-none">
            <h4 className="text-lg font-semibold text-neutral-800 mb-3">About this lesson</h4>
            <p className="text-neutral-600 mb-4">
              {task.description || 'Complete this task to continue your learning journey.'}
            </p>
            
            {task.contentText && (
              <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                <h5 className="font-semibold text-neutral-800 mb-2">Instructions:</h5>
                <div className="text-neutral-600 whitespace-pre-line">
                  {task.contentText}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-4">
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>Estimated time: {task.estimatedMinutes} minutes</span>
              </div>
              <Badge variant="secondary" className="capitalize">
                {task.type}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-neutral-600">
                <Bookmark size={16} className="mr-2" />
                Bookmark
              </Button>
              <Button variant="ghost" size="sm" className="text-neutral-600">
                <StickyNote size={16} className="mr-2" />
                Add Note
              </Button>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              
              {!task.isCompleted && (
                <Button 
                  onClick={handleComplete}
                  disabled={completeTaskMutation.isPending || isCompleting}
                  className={`flex items-center space-x-2 ${
                    isCompleting 
                      ? 'bg-green-600 hover:bg-green-600' 
                      : 'bg-success hover:bg-success/90'
                  }`}
                >
                  <Check size={16} />
                  <span>
                    {completeTaskMutation.isPending 
                      ? 'Completing...' 
                      : isCompleting 
                        ? 'Completed!' 
                        : 'Mark Complete'
                    }
                  </span>
                </Button>
              )}
              
              {task.isCompleted && (
                <Button disabled className="bg-green-600">
                  <Check size={16} className="mr-2" />
                  Completed
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
