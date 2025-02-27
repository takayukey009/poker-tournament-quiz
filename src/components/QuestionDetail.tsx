import React, { useState } from 'react';
import type { Question } from '../data/questionData';

interface QuestionDetailProps {
  question: Question;
  progress: Record<string, string>;
  updateProgress: (questionId: string, status: string) => void;
  onBack: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const QuestionDetail: React.FC<QuestionDetailProps> = ({
  question,
  progress,
  updateProgress,
  onBack,
  onNext,
  onPrev
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const status = progress[question.id] || 'unsolved';

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    
    const newStatus = selectedOption === question.correctAnswer ? 'correct' : 'incorrect';
    updateProgress(question.id, newStatus);
    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowAnswer(false);
    onNext();
  };

  const handlePrevQuestion = () => {
    setSelectedOption(null);
    setShowAnswer(false);
    onPrev();
  };

  return (
    <div className="question-detail p-4">
      <div className="mb-4 flex justify-between items-center">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 rounded-md"
        >
          戻る
        </button>
        <div className="text-sm font-medium">
          {status === 'correct' ? '✅ 正解済み' : 
           status === 'incorrect' ? '❌ 不正解' : '🔄 未回答'}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">{question.title}</h2>
        <div className="bg-gray-100 p-3 rounded-md mb-4">
          <p>{question.description}</p>
        </div>
        
        {question.image && (
          <div className="mb-4">
            <img 
              src={question.image} 
              alt="問題の図" 
              className="w-full rounded-md"
            />
          </div>
        )}

        <div className="mb-6">
          <h3 className="font-medium mb-2">選択肢:</h3>
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                className={`w-full text-left p-3 rounded-md border ${
                  selectedOption === index 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300'
                } ${
                  showAnswer && index === question.correctAnswer
                    ? 'bg-green-100 border-green-500'
                    : showAnswer && index === selectedOption && index !== question.correctAnswer
                    ? 'bg-red-100 border-red-500'
                    : ''
                }`}
                disabled={showAnswer}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {!showAnswer ? (
          <button
            onClick={handleCheckAnswer}
            disabled={selectedOption === null}
            className={`w-full py-3 rounded-md font-medium ${
              selectedOption === null
                ? 'bg-gray-300 text-gray-500'
                : 'bg-blue-500 text-white'
            }`}
          >
            回答を確認
          </button>
        ) : (
          <div className="mt-6">
            <h3 className="font-medium mb-2">解説:</h3>
            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
              <p>{question.explanation}</p>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrevQuestion}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                前の問題
              </button>
              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                次の問題
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetail;
