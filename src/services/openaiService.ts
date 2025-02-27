import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should be made from the server
});

export interface QuizGenerationParams {
  category: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  topic?: string;
}

/**
 * Generate a poker tournament quiz question using OpenAI
 */
export const generateQuizQuestion = async (params: QuizGenerationParams) => {
  try {
    const { category, difficulty = 'intermediate', topic } = params;
    
    // Create a prompt based on the parameters
    let prompt = `Generate a detailed Texas Hold'em poker tournament quiz question for the ${category} stage of a tournament.`;
    
    if (topic) {
      prompt += ` The question should focus on ${topic}.`;
    }
    
    prompt += ` The difficulty level should be ${difficulty}.`;
    
    prompt += ` Format the response as a JSON object with the following structure:
    {
      "title": "A concise title for the question",
      "category": "${category}",
      "question": "The detailed question scenario with all relevant information",
      "solution": "A comprehensive explanation of the optimal strategy and reasoning"
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert poker tournament strategy coach specializing in Texas Hold'em. Your expertise includes GTO (Game Theory Optimal) strategy, ICM (Independent Chip Model), and tournament-specific adjustments."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating quiz question:', error);
    throw error;
  }
};
