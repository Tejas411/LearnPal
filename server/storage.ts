import {
  users,
  courses,
  modules,
  tasks,
  userProgress,
  type User,
  type UpsertUser,
  type Course,
  type Module,
  type Task,
  type UserProgress,
  type InsertCourse,
  type InsertModule,
  type InsertTask,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStreak(userId: string, newStreak: number): Promise<void>;
  
  // Course operations
  createCourse(userId: string, courseData: InsertCourse): Promise<Course>;
  getUserCourses(userId: string): Promise<Course[]>;
  getCourseWithModules(courseId: number): Promise<Course & { modules: (Module & { tasks: Task[] })[] } | null>;
  
  // Module operations
  createModule(courseId: number, moduleData: InsertModule): Promise<Module>;
  updateModuleLockStatus(moduleId: number, isLocked: boolean): Promise<void>;
  
  // Task operations
  createTask(moduleId: number, taskData: InsertTask): Promise<Task>;
  getTodaysTasks(userId: string): Promise<Task[]>;
  markTaskComplete(taskId: number, userId: string): Promise<void>;
  
  // Progress operations
  getUserProgress(userId: string, courseId: number): Promise<UserProgress[]>;
  updateProgress(userId: string, courseId: number, moduleId?: number, taskId?: number): Promise<void>;
  getUserStats(userId: string): Promise<{
    activeCourses: number;
    completedTasks: number;
    totalHours: number;
    currentStreak: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStreak(userId: string, newStreak: number): Promise<void> {
    await db
      .update(users)
      .set({
        currentStreak: newStreak,
        longestStreak: newStreak,
        lastActiveDate: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  // Course operations
  async createCourse(userId: string, courseData: InsertCourse): Promise<Course> {
    const [course] = await db
      .insert(courses)
      .values({
        ...courseData,
        userId,
      })
      .returning();
    return course;
  }

  async getUserCourses(userId: string): Promise<Course[]> {
    return await db
      .select()
      .from(courses)
      .where(and(eq(courses.userId, userId), eq(courses.isActive, true)))
      .orderBy(desc(courses.createdAt));
  }

  async getCourseWithModules(courseId: number): Promise<Course & { modules: (Module & { tasks: Task[] })[] } | null> {
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
      with: {
        modules: {
          orderBy: asc(modules.orderIndex),
          with: {
            tasks: {
              orderBy: asc(tasks.orderIndex),
            },
          },
        },
      },
    });
    return course || null;
  }

  // Module operations
  async createModule(courseId: number, moduleData: InsertModule): Promise<Module> {
    const [module] = await db
      .insert(modules)
      .values({
        ...moduleData,
        courseId,
      })
      .returning();
    return module;
  }

  async updateModuleLockStatus(moduleId: number, isLocked: boolean): Promise<void> {
    await db
      .update(modules)
      .set({ isLocked })
      .where(eq(modules.id, moduleId));
  }

  // Task operations
  async createTask(moduleId: number, taskData: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values({
        ...taskData,
        moduleId,
      })
      .returning();
    return task;
  }

  async getTodaysTasks(userId: string): Promise<Task[]> {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return await db.query.tasks.findMany({
      where: and(
        eq(tasks.isCompleted, false),
        // Get tasks due today or overdue
      ),
      with: {
        module: {
          with: {
            course: {
              where: eq(courses.userId, userId),
            },
          },
        },
      },
      orderBy: asc(tasks.deadline),
    });
  }

  async markTaskComplete(taskId: number, userId: string): Promise<void> {
    const now = new Date();
    
    // Mark task as completed
    await db
      .update(tasks)
      .set({
        isCompleted: true,
        completedAt: now,
      })
      .where(eq(tasks.id, taskId));

    // Get task details to update progress
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
      with: {
        module: {
          with: {
            course: true,
          },
        },
      },
    });

    if (task) {
      // Update user progress
      await this.updateProgress(userId, task.module.course.id, task.moduleId, taskId);
      
      // Update user streak
      const user = await this.getUser(userId);
      if (user) {
        const newStreak = user.currentStreak + 1;
        await this.updateUserStreak(userId, newStreak);
      }
    }
  }

  // Progress operations
  async getUserProgress(userId: string, courseId: number): Promise<UserProgress[]> {
    return await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.courseId, courseId)))
      .orderBy(desc(userProgress.createdAt));
  }

  async updateProgress(userId: string, courseId: number, moduleId?: number, taskId?: number): Promise<void> {
    const progressData = {
      userId,
      courseId,
      moduleId,
      taskId,
      progressType: taskId ? 'task' : moduleId ? 'module' : 'course',
      isCompleted: true,
      completedAt: new Date(),
    };

    await db.insert(userProgress).values(progressData);
  }

  async getUserStats(userId: string): Promise<{
    activeCourses: number;
    completedTasks: number;
    totalHours: number;
    currentStreak: number;
  }> {
    const user = await this.getUser(userId);
    const activeCourses = await db
      .select()
      .from(courses)
      .where(and(eq(courses.userId, userId), eq(courses.isActive, true)));

    const completedTasksCount = await db.query.userProgress.findMany({
      where: and(
        eq(userProgress.userId, userId),
        eq(userProgress.progressType, 'task'),
        eq(userProgress.isCompleted, true)
      ),
    });

    return {
      activeCourses: activeCourses.length,
      completedTasks: completedTasksCount.length,
      totalHours: user?.totalLearningHours || 0,
      currentStreak: user?.currentStreak || 0,
    };
  }
}

export const storage = new DatabaseStorage();
