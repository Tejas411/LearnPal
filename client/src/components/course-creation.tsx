import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Brain, Wand2, Loader2 } from "lucide-react";

interface CourseCreationProps {
  onCourseCreated: () => void;
}

export function CourseCreation({ onCourseCreated }: CourseCreationProps) {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [timeCommitment, setTimeCommitment] = useState("1-2 hours per day");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCourseMutation = useMutation({
    mutationFn: async (courseData: {
      topic: string;
      difficulty: string;
      timeCommitment: string;
    }) => {
      return apiRequest('POST', '/api/courses/generate', courseData);
    },
    onSuccess: () => {
      toast({
        title: "Course Created! 🎉",
        description: `Your personalized learning path for "${topic}" is ready!`,
      });
      
      // Clear form
      setTopic("");
      setDifficulty("beginner");
      setTimeCommitment("1-2 hours per day");
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      
      onCourseCreated();
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Course",
        description: error.message || "Failed to generate course. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic to learn",
        variant: "destructive",
      });
      return;
    }

    createCourseMutation.mutate({
      topic: topic.trim(),
      difficulty,
      timeCommitment,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !createCourseMutation.isPending) {
      handleGenerate();
    }
  };

  return (
    <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl p-8 border border-neutral-200">
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
          <Brain className="text-white" size={32} />
        </div>
        <h3 className="text-2xl font-bold text-neutral-800 mb-3">
          Ready to Learn Something New?
        </h3>
        <p className="text-neutral-600 mb-8">
          Tell us what you want to master, and we'll create a personalized learning path just for you.
        </p>
        
        <Card className="max-w-md mx-auto mb-6">
          <CardContent className="p-6 space-y-4">
            {/* Topic Input */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                What do you want to learn?
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="e.g., Python Programming, Digital Marketing, Photography..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-12"
                  disabled={createCourseMutation.isPending}
                />
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-primary transition-colors"
                  onClick={handleGenerate}
                  disabled={createCourseMutation.isPending}
                >
                  <Wand2 size={16} />
                </button>
              </div>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Difficulty Level
              </label>
              <Select value={difficulty} onValueChange={setDifficulty} disabled={createCourseMutation.isPending}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Commitment */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Time Commitment
              </label>
              <Select value={timeCommitment} onValueChange={setTimeCommitment} disabled={createCourseMutation.isPending}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30 minutes per day">30 minutes per day</SelectItem>
                  <SelectItem value="1-2 hours per day">1-2 hours per day</SelectItem>
                  <SelectItem value="2-4 hours per day">2-4 hours per day</SelectItem>
                  <SelectItem value="4+ hours per day">4+ hours per day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          size="lg"
          onClick={handleGenerate}
          disabled={createCourseMutation.isPending || !topic.trim()}
          className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:transform-none"
        >
          {createCourseMutation.isPending ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={20} />
              Generating Your Path...
            </>
          ) : (
            <>
              <Wand2 className="mr-2" size={20} />
              Generate My Learning Path
            </>
          )}
        </Button>
        
        <p className="text-xs text-neutral-500 mt-4">
          <Brain className="inline mr-1" size={12} />
          Powered by AI • Personalized for your learning style
        </p>
      </div>
    </div>
  );
}
