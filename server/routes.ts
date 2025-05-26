import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { generateSyllabus } from "./openai";
import { insertCourseSchema } from "@shared/schema";
import { z } from "zod";

const createCourseRequestSchema = z.object({
  topic: z.string().min(1),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  timeCommitment: z.string().default('1-2 hours per day'),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User stats endpoint
  app.get('/api/user/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Course routes
  app.get('/api/courses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const courses = await storage.getUserCourses(userId);
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get('/api/courses/:id', isAuthenticated, async (req: any, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourseWithModules(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  app.post('/api/courses/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { topic, difficulty, timeCommitment } = createCourseRequestSchema.parse(req.body);

      // Generate syllabus using AI
      const syllabus = await generateSyllabus(topic, difficulty, timeCommitment);

      // Create course
      const course = await storage.createCourse(userId, {
        title: syllabus.title,
        description: syllabus.description,
        topic: topic,
        difficulty: syllabus.difficulty,
        estimatedHours: syllabus.estimatedHours,
      });

      // Create modules and tasks
      for (const moduleData of syllabus.modules) {
        const module = await storage.createModule(course.id, {
          title: moduleData.title,
          description: moduleData.description,
          orderIndex: moduleData.orderIndex,
        });

        // Unlock first module
        if (moduleData.orderIndex === 0) {
          await storage.updateModuleLockStatus(module.id, false);
        }

        // Create tasks for this module
        for (const taskData of moduleData.tasks) {
          await storage.createTask(module.id, {
            title: taskData.title,
            description: taskData.description,
            type: taskData.type,
            contentUrl: taskData.contentUrl,
            contentText: taskData.contentText,
            estimatedMinutes: taskData.estimatedMinutes,
            orderIndex: taskData.orderIndex,
            deadline: new Date(Date.now() + (taskData.orderIndex + 1) * 24 * 60 * 60 * 1000), // Stagger deadlines
          });
        }
      }

      // Fetch the complete course with modules and tasks
      const completeCourse = await storage.getCourseWithModules(course.id);
      res.json(completeCourse);
    } catch (error) {
      console.error("Error generating course:", error);
      res.status(500).json({ message: "Failed to generate course" });
    }
  });

  // Task routes
  app.get('/api/tasks/today', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tasks = await storage.getTodaysTasks(userId);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching today's tasks:", error);
      res.status(500).json({ message: "Failed to fetch today's tasks" });
    }
  });

  app.post('/api/tasks/:id/complete', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const taskId = parseInt(req.params.id);
      
      await storage.markTaskComplete(taskId, userId);
      
      res.json({ message: "Task marked as complete" });
    } catch (error) {
      console.error("Error completing task:", error);
      res.status(500).json({ message: "Failed to complete task" });
    }
  });

  // Progress routes
  app.get('/api/progress/:courseId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const courseId = parseInt(req.params.courseId);
      
      const progress = await storage.getUserProgress(userId, courseId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
