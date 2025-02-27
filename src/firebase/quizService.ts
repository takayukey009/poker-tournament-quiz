import { ref, get, set, push, update, remove, query, orderByChild, equalTo } from 'firebase/database';
import { database } from './config';

export interface QuizQuestion {
  id?: string;
  day: number;
  title: string;
  category: string;
  question: string;
  solution: string;
}

// Get all quiz questions
export const getAllQuizQuestions = async (): Promise<QuizQuestion[]> => {
  try {
    const quizRef = ref(database, 'quizQuestions');
    const snapshot = await get(quizRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    throw error;
  }
};

// Get quiz questions by category
export const getQuizQuestionsByCategory = async (category: string): Promise<QuizQuestion[]> => {
  try {
    const quizRef = ref(database, 'quizQuestions');
    const categoryQuery = query(quizRef, orderByChild('category'), equalTo(category));
    const snapshot = await get(categoryQuery);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
    }
    
    return [];
  } catch (error) {
    console.error(`Error fetching quiz questions for category ${category}:`, error);
    throw error;
  }
};

// Add a new quiz question
export const addQuizQuestion = async (question: QuizQuestion): Promise<string> => {
  try {
    const quizRef = ref(database, 'quizQuestions');
    const newQuizRef = push(quizRef);
    await set(newQuizRef, question);
    return newQuizRef.key || '';
  } catch (error) {
    console.error('Error adding quiz question:', error);
    throw error;
  }
};

// Update an existing quiz question
export const updateQuizQuestion = async (id: string, question: Partial<QuizQuestion>): Promise<void> => {
  try {
    const quizRef = ref(database, `quizQuestions/${id}`);
    await update(quizRef, question);
  } catch (error) {
    console.error(`Error updating quiz question ${id}:`, error);
    throw error;
  }
};

// Delete a quiz question
export const deleteQuizQuestion = async (id: string): Promise<void> => {
  try {
    const quizRef = ref(database, `quizQuestions/${id}`);
    await remove(quizRef);
  } catch (error) {
    console.error(`Error deleting quiz question ${id}:`, error);
    throw error;
  }
};

// Initialize database with sample questions if empty
export const initializeQuizQuestions = async (questions: QuizQuestion[]): Promise<void> => {
  try {
    const quizRef = ref(database, 'quizQuestions');
    const snapshot = await get(quizRef);
    
    if (!snapshot.exists()) {
      const updates: Record<string, QuizQuestion> = {};
      
      questions.forEach((question, index) => {
        const newKey = `question${index + 1}`;
        updates[newKey] = question;
      });
      
      await update(quizRef, updates);
      console.log('Database initialized with sample questions');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};
