import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Brain, Target, Trophy, Users, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <GraduationCap className="text-white" size={24} />
              </div>
              <h1 className="text-xl font-bold text-neutral-800">LearnPath</h1>
            </div>
            
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-300"
            >
              Sign In with Google
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl mx-auto mb-8 flex items-center justify-center">
            <Brain className="text-white" size={40} />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
            Your Personalized
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {" "}Learning Journey
            </span>
          </h1>
          
          <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
            Tell us what you want to learn, and our AI will create a structured, 
            graduate-level syllabus tailored to your goals. Track progress, stay motivated, 
            and achieve mastery.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <GraduationCap className="mr-2" size={20} />
              Start Learning Today
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-neutral-300 hover:border-primary"
            >
              Watch Demo
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-neutral-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Brain className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">AI-Powered Syllabi</h3>
                <p className="text-neutral-600">
                  Advanced AI creates comprehensive learning paths with curated resources and structured modules.
                </p>
              </CardContent>
            </Card>

            <Card className="border-neutral-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Target className="text-secondary" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">Progress Tracking</h3>
                <p className="text-neutral-600">
                  Visual progress indicators, completion tracking, and deadline management keep you on track.
                </p>
              </CardContent>
            </Card>

            <Card className="border-neutral-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Trophy className="text-accent" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">Gamified Learning</h3>
                <p className="text-neutral-600">
                  Streaks, achievements, and motivational elements make learning engaging and fun.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Get started in three simple steps and begin your learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-3">Choose Your Topic</h3>
              <p className="text-neutral-600">
                Tell us what you want to learn - from programming to photography, we cover it all.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-3">AI Creates Your Path</h3>
              <p className="text-neutral-600">
                Our AI generates a structured curriculum with modules, tasks, and deadlines.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-orange-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-3">Learn & Track Progress</h3>
              <p className="text-neutral-600">
                Follow your personalized path, complete tasks, and watch your knowledge grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-primary-100">Courses Generated</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-primary-100">Tasks Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-primary-100">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-primary-100">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-neutral-600 mb-8">
            Join thousands of learners who have achieved their goals with LearnPath
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <GraduationCap className="mr-2" size={20} />
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <GraduationCap className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">LearnPath</h3>
          </div>
          <div className="text-center">
            <p>&copy; 2024 LearnPath. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
