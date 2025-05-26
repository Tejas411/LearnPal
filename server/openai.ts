import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface SyllabusModule {
  title: string;
  description: string;
  orderIndex: number;
  tasks: {
    title: string;
    description: string;
    type: 'document' | 'video' | 'assignment';
    contentUrl?: string;
    contentText?: string;
    estimatedMinutes: number;
    orderIndex: number;
  }[];
}

export interface GeneratedSyllabus {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  modules: SyllabusModule[];
}

export async function generateSyllabus(
  topic: string, 
  difficulty: string = 'beginner',
  timeCommitment: string = '1-2 hours per day'
): Promise<GeneratedSyllabus> {
  try {
    const prompt = `Create a comprehensive learning syllabus for "${topic}" at ${difficulty} level with ${timeCommitment} time commitment.

Structure the response as a JSON object with the following format:
{
  "title": "Course title",
  "description": "Brief course description (2-3 sentences)",
  "difficulty": "${difficulty}",
  "estimatedHours": number,
  "modules": [
    {
      "title": "Module title",
      "description": "Module description",
      "orderIndex": number (starting from 0),
      "tasks": [
        {
          "title": "Task title",
          "description": "Task description with learning objectives",
          "type": "document" | "video" | "assignment",
          "contentUrl": "URL to free online resource (if available)",
          "contentText": "Brief content overview or instructions",
          "estimatedMinutes": number,
          "orderIndex": number (starting from 0)
        }
      ]
    }
  ]
}

Requirements:
- Create 6-10 modules that build upon each other
- Each module should have 3-6 tasks
- Mix different task types (documents, videos, assignments)
- Include real URLs to free online resources when possible (YouTube, Khan Academy, MDN, etc.)
- Make sure tasks are practical and actionable
- Estimate realistic time commitments
- Focus on hands-on learning and real-world applications
- Ensure progressive difficulty within modules`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert curriculum designer who creates structured, practical learning paths. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000,
    });

    const syllabusData = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate the response structure
    if (!syllabusData.title || !syllabusData.modules || !Array.isArray(syllabusData.modules)) {
      throw new Error('Invalid syllabus structure received from AI');
    }

    return syllabusData as GeneratedSyllabus;
  } catch (error) {
    console.error('Error generating syllabus:', error);
    throw new Error(`Failed to generate syllabus: ${error.message}`);
  }
}

export async function generateTaskContent(
  taskTitle: string,
  taskType: 'document' | 'video' | 'assignment',
  moduleContext: string
): Promise<string> {
  try {
    const prompt = `Generate detailed content for a learning task:
    
Task: ${taskTitle}
Type: ${taskType}
Module Context: ${moduleContext}

Create comprehensive content that includes:
- Clear learning objectives
- Step-by-step instructions or explanation
- Key concepts to understand
- Practical examples where applicable
- Assessment criteria (for assignments)

Keep the content engaging, educational, and appropriate for the task type.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert educator who creates engaging, comprehensive learning content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 2000,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating task content:', error);
    throw new Error(`Failed to generate task content: ${error.message}`);
  }
}
