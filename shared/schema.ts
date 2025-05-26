import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  whatsappNumber: varchar("whatsapp_number"),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastActiveDate: timestamp("last_active_date"),
  totalLearningHours: integer("total_learning_hours").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  topic: varchar("topic").notNull(),
  difficulty: varchar("difficulty").notNull(), // beginner, intermediate, advanced
  estimatedHours: integer("estimated_hours"),
  isActive: boolean("is_active").default(true),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  title: varchar("title").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull(),
  isLocked: boolean("is_locked").default(true),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull().references(() => modules.id),
  title: varchar("title").notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // document, video, assignment
  contentUrl: text("content_url"),
  contentText: text("content_text"),
  estimatedMinutes: integer("estimated_minutes"),
  orderIndex: integer("order_index").notNull(),
  deadline: timestamp("deadline"),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  moduleId: integer("module_id").references(() => modules.id),
  taskId: integer("task_id").references(() => tasks.id),
  progressType: varchar("progress_type").notNull(), // course, module, task
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  courses: many(courses),
  progress: many(userProgress),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  user: one(users, {
    fields: [courses.userId],
    references: [users.id],
  }),
  modules: many(modules),
  progress: many(userProgress),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
  course: one(courses, {
    fields: [modules.courseId],
    references: [courses.id],
  }),
  tasks: many(tasks),
  progress: many(userProgress),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  module: one(modules, {
    fields: [tasks.moduleId],
    references: [modules.id],
  }),
  progress: many(userProgress),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [userProgress.courseId],
    references: [courses.id],
  }),
  module: one(modules, {
    fields: [userProgress.moduleId],
    references: [modules.id],
  }),
  task: one(tasks, {
    fields: [userProgress.taskId],
    references: [tasks.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  whatsappNumber: true,
});

export const insertCourseSchema = createInsertSchema(courses).pick({
  title: true,
  description: true,
  topic: true,
  difficulty: true,
  estimatedHours: true,
});

export const insertModuleSchema = createInsertSchema(modules).pick({
  title: true,
  description: true,
  orderIndex: true,
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  type: true,
  contentUrl: true,
  contentText: true,
  estimatedMinutes: true,
  orderIndex: true,
  deadline: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Module = typeof modules.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
