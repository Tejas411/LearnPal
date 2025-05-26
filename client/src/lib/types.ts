export interface UserStats {
  activeCourses: number;
  completedTasks: number;
  totalHours: number;
  currentStreak: number;
}

export interface TaskWithModule {
  id: number;
  title: string;
  description: string;
  type: 'document' | 'video' | 'assignment';
  contentUrl?: string;
  contentText?: string;
  estimatedMinutes: number;
  deadline?: string;
  isCompleted: boolean;
  module: {
    title: string;
    course: {
      title: string;
    };
  };
}

export interface CourseWithModules {
  id: number;
  title: string;
  description: string;
  topic: string;
  difficulty: string;
  estimatedHours: number;
  modules: ModuleWithTasks[];
}

export interface ModuleWithTasks {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  isLocked: boolean;
  completedAt?: string;
  tasks: TaskItem[];
}

export interface TaskItem {
  id: number;
  title: string;
  description: string;
  type: 'document' | 'video' | 'assignment';
  contentUrl?: string;
  contentText?: string;
  estimatedMinutes: number;
  orderIndex: number;
  deadline?: string;
  isCompleted: boolean;
  completedAt?: string;
}
