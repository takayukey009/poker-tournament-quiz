import { supabase } from './client';

export interface QuizQuestion {
  id?: string;
  day: number;
  title: string;
  category: string;
  question: string;
  solution: string;
  description?: string;
  content?: string;
  options?: string[];
  correct_answer?: number;
  explanation?: string;
  created_at?: string;
}

// 全てのクイズ問題を取得
export const getAllQuizQuestions = async (): Promise<QuizQuestion[]> => {
  try {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .order('day', { ascending: true });
    
    if (error) {
      console.error('Error fetching quiz questions:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getAllQuizQuestions:', error);
    throw error;
  }
};

// カテゴリー別にクイズ問題を取得
export const getQuizQuestionsByCategory = async (category: string): Promise<QuizQuestion[]> => {
  try {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('category', category)
      .order('day', { ascending: true });
    
    if (error) {
      console.error(`Error fetching quiz questions for category ${category}:`, error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error(`Error in getQuizQuestionsByCategory:`, error);
    throw error;
  }
};

// 新しいクイズ問題を追加
export const addQuizQuestion = async (question: QuizQuestion): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('quiz_questions')
      .insert([question])
      .select();
    
    if (error) {
      console.error('Error adding quiz question:', error);
      throw error;
    }
    
    return data?.[0]?.id || '';
  } catch (error) {
    console.error('Error in addQuizQuestion:', error);
    throw error;
  }
};

// クイズ問題を更新
export const updateQuizQuestion = async (id: string, question: Partial<QuizQuestion>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('quiz_questions')
      .update(question)
      .eq('id', id);
    
    if (error) {
      console.error(`Error updating quiz question ${id}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Error in updateQuizQuestion:`, error);
    throw error;
  }
};

// クイズ問題を削除
export const deleteQuizQuestion = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting quiz question ${id}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Error in deleteQuizQuestion:`, error);
    throw error;
  }
};

// サンプルデータでデータベースを初期化
export const initializeQuizQuestions = async (questions: QuizQuestion[]): Promise<void> => {
  try {
    // 既存のデータを確認
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*');
    
    if (error) {
      console.error('Error checking existing quiz questions:', error);
      throw error;
    }
    
    // データが存在しない場合のみ初期化
    if (!data || data.length === 0) {
      const { error: insertError } = await supabase
        .from('quiz_questions')
        .insert(questions);
      
      if (insertError) {
        console.error('Error initializing database:', insertError);
        throw insertError;
      }
      
      console.log('Database initialized with sample questions');
    }
  } catch (error) {
    console.error('Error in initializeQuizQuestions:', error);
    throw error;
  }
};
