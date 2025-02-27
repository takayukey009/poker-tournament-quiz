import React from 'react';
import type { Question } from '../data/questionData';

interface QuestionListProps {
  questions: Question[];
  progress: Record<string, string>;
  onQuestionSelect: (question: Question) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({ 
  questions, 
  progress, 
  onQuestionSelect 
}) => {
  // 難易度でソート
  const sortedQuestions = [...questions].sort((a, b) => {
    const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
  });

  const getCategoryLabel = (category: string) => {
    const labels = {
      preflop: 'プリフロップ',
      flop: 'フロップ',
      turn: 'ターン',
      river: 'リバー',
      icm: 'ICM'
    };
    return labels[category] || category;
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels = {
      beginner: '初級',
      intermediate: '中級',
      advanced: '上級'
    };
    return labels[difficulty] || difficulty;
  };

  const getStatusIcon = (questionId: string) => {
    const status = progress[questionId];
    if (!status) return '🔄';
    return status === 'correct' ? '✅' : '❌';
  };

  return (
    <div className="question-list">
      <div className="grid gap-3">
        {sortedQuestions.map((question) => (
          <button
            key={question.id}
            onClick={() => onQuestionSelect(question)}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-left hover:border-blue-300 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 rounded-md mr-2">
                  {getCategoryLabel(question.category)}
                </span>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 rounded-md">
                  {getDifficultyLabel(question.difficulty)}
                </span>
              </div>
              <span className="text-lg">{getStatusIcon(question.id)}</span>
            </div>
            <h3 className="font-medium mb-1">{question.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{question.description}</p>
          </button>
        ))}
      </div>
      
      {questions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">この条件に一致する問題はありません</p>
        </div>
      )}
    </div>
  );
};

export default QuestionList;
