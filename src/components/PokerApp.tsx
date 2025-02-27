import React, { useState, useEffect, lazy, Suspense } from 'react';
import { preflop, flop, turn, river, icm, Question } from '../data/questionData';
import CategoryTabs from './CategoryTabs';
import ProgressSummary from './ProgressSummary';
import QuestionList from './QuestionList';

// 問題表示コンポーネントは遅延読み込み
const QuestionDetail = lazy(() => import('./QuestionDetail'));

const PokerApp: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState('list'); // list or detail
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [progress, setProgress] = useState<Record<string, string>>({});
  
  // カテゴリーフィルター機能
  const getFilteredQuestions = (): Question[] => {
    if (currentCategory === 'all') return [...preflop, ...flop, ...turn, ...river, ...icm];
    if (currentCategory === 'preflop') return preflop;
    if (currentCategory === 'flop') return flop;
    if (currentCategory === 'turn') return turn;
    if (currentCategory === 'river') return river;
    if (currentCategory === 'icm') return icm;
    return [];
  };
  
  // 進捗管理
  useEffect(() => {
    const savedProgress = localStorage.getItem('questionProgress');
    if (savedProgress) setProgress(JSON.parse(savedProgress));
  }, []);
  
  const updateProgress = (questionId: string, status: string) => {
    const newProgress = {...progress, [questionId]: status};
    setProgress(newProgress);
    localStorage.setItem('questionProgress', JSON.stringify(newProgress));
  };

  // 次の問題・前の問題に移動する機能
  const navigateToQuestion = (direction: 'next' | 'prev') => {
    if (!currentQuestion) return;
    
    const filteredQuestions = getFilteredQuestions();
    const currentIndex = filteredQuestions.findIndex(q => q.id === currentQuestion.id);
    
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredQuestions.length;
    } else {
      newIndex = (currentIndex - 1 + filteredQuestions.length) % filteredQuestions.length;
    }
    
    setCurrentQuestion(filteredQuestions[newIndex]);
  };
  
  return (
    <div className="poker-app max-w-md mx-auto bg-gray-50 min-h-screen">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">テキサスホールデム問題集</h1>
        <p className="text-sm opacity-80">トーナメント戦略を学ぼう</p>
      </header>
      
      {currentPage === 'list' ? (
        <div className="p-4">
          <CategoryTabs 
            currentCategory={currentCategory} 
            setCurrentCategory={setCurrentCategory} 
          />
          <ProgressSummary progress={progress} />
          <QuestionList 
            questions={getFilteredQuestions()} 
            progress={progress}
            onQuestionSelect={(q) => {
              setCurrentQuestion(q);
              setCurrentPage('detail');
            }}
          />
        </div>
      ) : (
        <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
          {currentQuestion && (
            <QuestionDetail 
              question={currentQuestion}
              progress={progress}
              updateProgress={updateProgress}
              onBack={() => setCurrentPage('list')}
              onNext={() => navigateToQuestion('next')}
              onPrev={() => navigateToQuestion('prev')}
            />
          )}
        </Suspense>
      )}
    </div>
  );
};

export default PokerApp;
