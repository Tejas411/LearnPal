# LearnPath - AI-Powered Learning Platform

## 🎯 Project Overview
LearnPath is a comprehensive learning platform that creates personalized learning paths using AI. Users can define topics they want to learn, and the system generates structured syllabi with modules, tasks, and progress tracking.

## 🏗️ Architecture
- **Frontend**: React with TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Node.js with Express, PostgreSQL database
- **Authentication**: Google OAuth via Replit Auth
- **AI Integration**: OpenAI GPT-4o for syllabus generation
- **Database**: PostgreSQL with Drizzle ORM

## 📁 Project Structure

### Root Files
- `package.json` - Project dependencies and scripts
- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `drizzle.config.ts` - Database configuration
- `tsconfig.json` - TypeScript configuration

### Backend (`/server`)
- `index.ts` - Express server setup
- `db.ts` - Database connection and Drizzle setup
- `storage.ts` - Database operations and storage interface
- `routes.ts` - API routes for courses, tasks, progress
- `replitAuth.ts` - Authentication middleware and setup
- `openai.ts` - AI syllabus generation functions
- `vite.ts` - Development server integration

### Frontend (`/client/src`)
- `App.tsx` - Main application router
- `main.tsx` - React app entry point
- `index.css` - Global styles and theme variables

#### Pages (`/client/src/pages`)
- `landing.tsx` - Landing page for unauthenticated users
- `dashboard.tsx` - Main dashboard for authenticated users
- `not-found.tsx` - 404 error page

#### Components (`/client/src/components`)
- `learning-path.tsx` - Interactive learning path visualization
- `task-modal.tsx` - Task detail modal with completion
- `course-creation.tsx` - AI-powered course creation form
- `ui/` - Reusable UI components (buttons, cards, etc.)

#### Utilities (`/client/src/lib`)
- `types.ts` - TypeScript interfaces for data models
- `queryClient.ts` - React Query setup and API utilities
- `utils.ts` - Utility functions

#### Hooks (`/client/src/hooks`)
- `useAuth.ts` - Authentication state management
- `use-toast.ts` - Toast notification hook

### Shared (`/shared`)
- `schema.ts` - Database schema and types (used by both frontend and backend)

## 🔑 Key Features

### 1. Authentication System
- Google OAuth integration via Replit Auth
- Session management with PostgreSQL storage
- Automatic user profile creation

### 2. AI-Powered Course Generation
- Uses OpenAI GPT-4o to create structured learning paths
- Generates modules with tasks of different types (videos, documents, assignments)
- Includes realistic time estimates and deadlines

### 3. Learning Path Visualization
- Duolingo-style visual learning path
- Module progression with lock/unlock mechanics
- Task completion tracking

### 4. Gamification Elements
- Learning streaks (like Duolingo)
- Achievement badges
- Progress percentage tracking
- Visual feedback for completions

### 5. Task Management
- Three task types: Video, Document, Assignment
- Embedded YouTube videos in task modal
- Deadline tracking and notifications
- Completion workflow with progress updates

### 6. Progress Tracking
- Individual task completion
- Module progress calculation
- Course completion percentage
- User statistics dashboard

## 🎨 Design System
- **Colors**: Purple primary, green secondary, orange accent
- **Typography**: Inter font family
- **Components**: shadcn/ui component library
- **Icons**: Lucide React icons
- **Responsive**: Mobile-first design approach

## 🛠️ Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes

## 🔐 Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- `REPLIT_DOMAINS` - Allowed domains for OAuth
- `REPL_ID` - Replit app ID for OAuth
- `OPENAI_API_KEY` - OpenAI API key for AI features

## 📊 Database Schema

### Tables
1. **users** - User profiles and authentication data
2. **courses** - Learning courses created by users
3. **modules** - Course modules with sequential content
4. **tasks** - Individual learning tasks within modules
5. **user_progress** - Tracks completion of courses/modules/tasks
6. **sessions** - User session storage for authentication

### Key Relationships
- Users → Courses (one-to-many)
- Courses → Modules (one-to-many, ordered)
- Modules → Tasks (one-to-many, ordered)
- Users → Progress (many-to-many tracking)

## 🚀 Current Status
✅ Authentication system working
✅ Database schema deployed
✅ Beautiful UI components
✅ Course creation interface
✅ Learning path visualization
✅ Task completion workflow
✅ Progress tracking
✅ Gamification elements

## 🔄 API Endpoints
- `GET /api/auth/user` - Get current user
- `GET /api/courses` - Get user's courses
- `GET /api/courses/:id` - Get specific course with modules/tasks
- `POST /api/courses/generate` - Generate new course with AI
- `GET /api/tasks/today` - Get today's scheduled tasks
- `POST /api/tasks/:id/complete` - Mark task as complete
- `GET /api/user/stats` - Get user statistics
- `GET /api/progress/:courseId` - Get course progress

The application is fully functional and ready for use! The AI syllabus generation requires an OpenAI API key, but all other features work perfectly.