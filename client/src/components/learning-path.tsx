import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CourseWithModules, ModuleWithTasks, TaskWithModule } from "@/lib/types";
import { Check, Play, Lock, Clock, FileText, PenTool } from "lucide-react";

interface LearningPathProps {
  course: CourseWithModules;
  onTaskClick: (task: TaskWithModule) => void;
}

export function LearningPath({ course, onTaskClick }: LearningPathProps) {
  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play size={12} />;
      case 'document':
        return <FileText size={12} />;
      case 'assignment':
        return <PenTool size={12} />;
      default:
        return <FileText size={12} />;
    }
  };

  const getTaskTypeEmoji = (type: string) => {
    switch (type) {
      case 'video':
        return '🎥';
      case 'document':
        return '📖';
      case 'assignment':
        return '📝';
      default:
        return '📄';
    }
  };

  const getModuleStatus = (module: ModuleWithTasks) => {
    if (module.completedAt) return 'completed';
    if (module.isLocked) return 'locked';
    return 'active';
  };

  const getCompletedTasksCount = (module: ModuleWithTasks) => {
    return module.tasks.filter(task => task.isCompleted).length;
  };

  const getModuleProgress = (module: ModuleWithTasks) => {
    if (module.tasks.length === 0) return 0;
    return Math.round((getCompletedTasksCount(module) / module.tasks.length) * 100);
  };

  const handleTaskClick = (task: any) => {
    const taskWithModule: TaskWithModule = {
      ...task,
      module: {
        title: course.modules.find(m => m.id === task.moduleId)?.title || '',
        course: {
          title: course.title,
        },
      },
    };
    onTaskClick(taskWithModule);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h4 className="text-lg font-semibold text-neutral-800 mb-6">Your Learning Path</h4>
        
        <div className="relative">
          {course.modules.map((module, moduleIndex) => {
            const status = getModuleStatus(module);
            const completedTasks = getCompletedTasksCount(module);
            const progress = getModuleProgress(module);
            
            return (
              <div key={module.id} className="flex items-start space-x-4 mb-8">
                {/* Module Icon */}
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                    status === 'completed' 
                      ? 'bg-success' 
                      : status === 'active' 
                        ? 'bg-primary animate-pulse' 
                        : 'bg-neutral-200'
                  }`}>
                    {status === 'completed' ? (
                      <Check className="text-white" size={20} />
                    ) : status === 'active' ? (
                      <Play className="text-white" size={20} />
                    ) : (
                      <Lock className="text-neutral-400" size={20} />
                    )}
                  </div>
                  {moduleIndex < course.modules.length - 1 && (
                    <div className={`w-1 h-16 mx-auto mt-2 ${
                      status === 'completed' ? 'bg-success' : 'bg-neutral-200'
                    }`}></div>
                  )}
                </div>

                {/* Module Content */}
                <div className="flex-grow">
                  <div className={`rounded-xl p-4 border ${
                    status === 'completed' 
                      ? 'bg-success/10 border-success/20' 
                      : status === 'active' 
                        ? 'bg-primary/10 border-primary/20' 
                        : 'bg-neutral-100 border-neutral-200'
                  }`}>
                    <h5 className={`font-semibold mb-2 ${
                      status === 'locked' ? 'text-neutral-500' : 'text-neutral-800'
                    }`}>
                      {module.title}
                    </h5>
                    <p className={`text-sm mb-3 ${
                      status === 'locked' ? 'text-neutral-400' : 'text-neutral-600'
                    }`}>
                      {module.description}
                    </p>
                    
                    {/* Task List */}
                    {status !== 'locked' && (
                      <div className="space-y-2 mb-3">
                        {module.tasks.map((task) => (
                          <div key={task.id} className="flex items-center space-x-3 text-sm">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              task.isCompleted 
                                ? 'bg-success' 
                                : status === 'active' 
                                  ? 'bg-primary' 
                                  : 'bg-neutral-200'
                            }`}>
                              {task.isCompleted ? (
                                <Check className="text-white" size={12} />
                              ) : status === 'active' ? (
                                getTaskIcon(task.type)
                              ) : (
                                <Lock className="text-neutral-400" size={10} />
                              )}
                            </div>
                            <span className={`flex-grow ${
                              task.isCompleted 
                                ? 'text-neutral-600 line-through' 
                                : status === 'active' 
                                  ? 'text-neutral-800 font-medium cursor-pointer hover:text-primary' 
                                  : 'text-neutral-400'
                            }`}
                            onClick={() => status === 'active' && !task.isCompleted && handleTaskClick(task)}
                            >
                              {task.title}
                            </span>
                            <span className="text-xs text-neutral-400">
                              {getTaskTypeEmoji(task.type)} {task.type}
                            </span>
                            {task.deadline && !task.isCompleted && status === 'active' && (
                              <Badge variant="secondary" className="text-xs bg-accent/20 text-accent">
                                <Clock size={10} className="mr-1" />
                                Due Today
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className={
                        status === 'completed' 
                          ? 'text-success font-medium' 
                          : status === 'active' 
                            ? 'text-primary font-medium' 
                            : 'text-neutral-400'
                      }>
                        {status === 'completed' && <Check size={14} className="inline mr-1" />}
                        {status === 'active' && <Clock size={14} className="inline mr-1" />}
                        {status === 'locked' && <Lock size={14} className="inline mr-1" />}
                        {status === 'completed' 
                          ? 'Completed' 
                          : status === 'active' 
                            ? 'In Progress' 
                            : 'Locked'
                        }
                      </span>
                      <span className={status === 'locked' ? 'text-neutral-400' : 'text-neutral-500'}>
                        {status === 'locked' 
                          ? `${module.tasks.length} tasks • ${module.tasks.reduce((sum, task) => sum + task.estimatedMinutes, 0)} min`
                          : `${completedTasks} of ${module.tasks.length} tasks • ${progress}% complete`
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
