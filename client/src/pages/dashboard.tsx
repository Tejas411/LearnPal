import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { CourseWithModules, UserStats, TaskWithModule } from "@/lib/types";
import { LearningPath } from "@/components/learning-path";
import { TaskModal } from "@/components/task-modal";
import { CourseCreation } from "@/components/course-creation";
import { 
  GraduationCap, 
  Flame, 
  BookOpen, 
  Clock, 
  Target,
  Plus,
  Calendar,
  BarChart3,
  Play,
  FileText,
  PenTool
} from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState<TaskWithModule | null>(null);
  const [showCourseCreation, setShowCourseCreation] = useState(false);

  // Fetch user stats
  const { data: stats } = useQuery<UserStats>({
    queryKey: ["/api/user/stats"],
  });

  // Fetch user courses
  const { data: courses = [] } = useQuery<CourseWithModules[]>({
    queryKey: ["/api/courses"],
  });

  // Fetch today's tasks
  const { data: todaysTasks = [] } = useQuery<TaskWithModule[]>({
    queryKey: ["/api/tasks/today"],
  });

  const currentCourse = courses[0]; // Most recent active course

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="text-red-600" size={16} />;
      case 'document':
        return <FileText className="text-blue-600" size={16} />;
      case 'assignment':
        return <PenTool className="text-green-600" size={16} />;
      default:
        return <BookOpen className="text-neutral-600" size={16} />;
    }
  };

  const getTaskTypeColor = (type: string) => {
    switch (type) {
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

  const getTimeUntilDeadline = (deadline?: string) => {
    if (!deadline) return null;
    
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffHours = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 0) return "Overdue";
    if (diffHours < 1) return "Due Now";
    if (diffHours < 24) return "Due Today";
    if (diffHours < 48) return "Tomorrow";
    return "Later";
  };

  const getDeadlineBadgeColor = (deadline?: string) => {
    const timeText = getTimeUntilDeadline(deadline);
    switch (timeText) {
      case "Overdue":
      case "Due Now":
        return "bg-red-100 text-red-600";
      case "Due Today":
        return "bg-accent/20 text-accent";
      case "Tomorrow":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-neutral-200 text-neutral-600";
    }
  };

  // Calculate course progress
  const calculateProgress = (course: CourseWithModules) => {
    if (!course.modules.length) return 0;
    
    const totalTasks = course.modules.reduce((sum, module) => sum + module.tasks.length, 0);
    const completedTasks = course.modules.reduce(
      (sum, module) => sum + module.tasks.filter(task => task.isCompleted).length, 
      0
    );
    
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-neutral-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <GraduationCap className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-neutral-800">LearnPath</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-neutral-600 hover:text-primary transition-colors">Dashboard</a>
              <a href="#" className="text-neutral-600 hover:text-primary transition-colors">My Courses</a>
              <a href="#" className="text-neutral-600 hover:text-primary transition-colors">Progress</a>
            </div>

            <div className="flex items-center space-x-4">
              {/* Streak Counter */}
              <Badge className="bg-gradient-to-r from-accent to-orange-400 text-white">
                <Flame size={14} className="mr-1" />
                {stats?.currentStreak || 0}
              </Badge>
              
              {/* Profile */}
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8 border-2 border-primary">
                  <AvatarImage src={user?.profileImageUrl || ''} />
                  <AvatarFallback>
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-medium text-neutral-700">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/api/logout'}
                className="text-neutral-600"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.firstName}! 🌟
              </h2>
              <p className="text-primary-100 mb-4">Ready to continue your learning journey?</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl font-bold">{stats?.activeCourses || 0}</div>
                  <div className="text-sm text-primary-100">Active Courses</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl font-bold">{stats?.completedTasks || 0}</div>
                  <div className="text-sm text-primary-100">Tasks Completed</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl font-bold">{stats?.totalHours || 0}h</div>
                  <div className="text-sm text-primary-100">Learning Time</div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Learning Path */}
          <div className="lg:col-span-2 space-y-6">
            
            {currentCourse ? (
              <>
                {/* Current Course Header */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-800">{currentCourse.title}</h3>
                        <p className="text-neutral-600 text-sm">{currentCourse.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{calculateProgress(currentCourse)}%</div>
                        <div className="text-xs text-neutral-500">Complete</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <Progress value={calculateProgress(currentCourse)} className="mb-4" />
                    
                    <div className="flex items-center justify-between text-sm text-neutral-600">
                      <span>{currentCourse.modules.filter(m => m.completedAt).length} of {currentCourse.modules.length} modules completed</span>
                      <span>Est. completion: {Math.ceil(currentCourse.estimatedHours / 2)} weeks</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Learning Path Visualization */}
                <LearningPath course={currentCourse} onTaskClick={setSelectedTask} />
              </>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-neutral-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <BookOpen className="text-neutral-400" size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2">No Active Courses</h3>
                  <p className="text-neutral-600 mb-6">Create your first learning path to get started!</p>
                  <Button onClick={() => setShowCourseCreation(true)}>
                    <Plus className="mr-2" size={16} />
                    Create Course
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Today's Tasks */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-neutral-800">Today's Tasks</h4>
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="text-primary" size={16} />
                  </div>
                </div>
                
                <div className="space-y-3">
                  {todaysTasks.length > 0 ? (
                    todaysTasks.slice(0, 3).map((task) => (
                      <div 
                        key={task.id}
                        className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                        onClick={() => setSelectedTask(task)}
                      >
                        <div className={`w-10 h-10 ${getTaskTypeColor(task.type)} rounded-lg flex items-center justify-center`}>
                          {getTaskIcon(task.type)}
                        </div>
                        <div className="flex-grow">
                          <h6 className="font-medium text-neutral-800 text-sm">{task.title}</h6>
                          <p className="text-xs text-neutral-500">
                            {task.module.course.title} • {task.estimatedMinutes} min
                          </p>
                        </div>
                        <Badge className={getDeadlineBadgeColor(task.deadline)} variant="secondary">
                          {getTimeUntilDeadline(task.deadline)}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="text-neutral-400 mx-auto mb-2" size={32} />
                      <p className="text-neutral-600 text-sm">No tasks due today</p>
                    </div>
                  )}
                </div>

                {todaysTasks.length > 3 && (
                  <Button variant="ghost" className="w-full mt-4">
                    View All Tasks
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Achievement Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-neutral-800">Achievements</h4>
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                    <Target className="text-accent" size={16} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Recent Achievement */}
                  {stats?.currentStreak && stats.currentStreak >= 7 && (
                    <div className="p-4 bg-gradient-to-r from-accent/10 to-orange-100 rounded-xl border border-accent/20">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                          <Flame className="text-white" size={20} />
                        </div>
                        <div>
                          <h6 className="font-semibold text-neutral-800 text-sm">{stats.currentStreak}-Day Streak!</h6>
                          <p className="text-xs text-neutral-600">Keep the momentum going</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Badges Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-neutral-50 rounded-lg">
                      <div className="w-8 h-8 bg-primary rounded-full mx-auto mb-2 flex items-center justify-center">
                        <GraduationCap className="text-white" size={16} />
                      </div>
                      <p className="text-xs text-neutral-600 font-medium">First Course</p>
                    </div>
                    
                    <div className="text-center p-3 bg-neutral-50 rounded-lg">
                      <div className="w-8 h-8 bg-secondary rounded-full mx-auto mb-2 flex items-center justify-center">
                        <Target className="text-white" size={16} />
                      </div>
                      <p className="text-xs text-neutral-600 font-medium">Task Master</p>
                    </div>
                    
                    <div className="text-center p-3 bg-neutral-50 rounded-lg">
                      <div className="w-8 h-8 bg-neutral-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-neutral-500 text-xs">?</span>
                      </div>
                      <p className="text-xs text-neutral-400 font-medium">Coming Soon</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-neutral-800 mb-4">Quick Actions</h4>
                
                <div className="space-y-3">
                  <Button 
                    className="w-full justify-start bg-gradient-to-r from-primary to-secondary"
                    onClick={() => setShowCourseCreation(true)}
                  >
                    <Plus className="mr-2" size={16} />
                    Start New Course
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="mr-2" size={16} />
                    View Progress
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2" size={16} />
                    Manage Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Creation Section */}
        {!currentCourse && (
          <div className="mt-12">
            <CourseCreation onCourseCreated={() => setShowCourseCreation(false)} />
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedTask && (
        <TaskModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
        />
      )}
      
      {showCourseCreation && (
        <CourseCreation onCourseCreated={() => setShowCourseCreation(false)} />
      )}
    </div>
  );
}
