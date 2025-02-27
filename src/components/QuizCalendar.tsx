"use client";

import React from 'react';
import { motion } from 'framer-motion';
import type { QuizQuestion } from '../supabase/quizService';

interface QuizCalendarProps {
  questions: QuizQuestion[];
  progress: Record<number, boolean>;
  currentDay: number;
  onDaySelect: (day: number) => void;
  colors: {
    bg: string;
    card: string;
    text: string;
    subtext: string;
    accent: string;
    button: string;
    progressBar: string;
    progressBg: string;
    header: string;
    cardBorder: string;
  };
}

const QuizCalendar: React.FC<QuizCalendarProps> = ({ 
  questions, 
  progress, 
  currentDay, 
  onDaySelect,
  colors
}) => {
  // カテゴリーごとの色を定義
  const categoryColors = {
    'プリフロップ': { bg: 'bg-blue-500 bg-opacity-20', text: 'text-blue-500' },
    'フロップ': { bg: 'bg-green-500 bg-opacity-20', text: 'text-green-500' },
    'ターン': { bg: 'bg-yellow-500 bg-opacity-20', text: 'text-yellow-500' },
    'リバー': { bg: 'bg-red-500 bg-opacity-20', text: 'text-red-500' },
    'ショーダウン': { bg: 'bg-purple-500 bg-opacity-20', text: 'text-purple-500' },
    'その他': { bg: 'bg-gray-500 bg-opacity-20', text: 'text-gray-500' },
  };

  // 月のグリッドを作成
  const renderCalendarGrid = () => {
    const days = Array.from({ length: questions.length }, (_, i) => i + 1);
    
    // 7日ごとに行を分ける
    const rows = [];
    for (let i = 0; i < days.length; i += 7) {
      rows.push(days.slice(i, i + 7));
    }

    return (
      <div className="grid gap-4">
        {rows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="grid grid-cols-7 gap-1 sm:gap-2">
            {row.map(day => {
              const question = questions.find(q => q.day === day);
              const category = question?.category || 'その他';
              const categoryStyle = categoryColors[category as keyof typeof categoryColors] || categoryColors['その他'];
              const isCompleted = progress[day] || false;
              const isCurrentDay = day === currentDay;

              return (
                <motion.div
                  key={`day-${day}`}
                  className={`
                    p-1 sm:p-3 rounded-lg cursor-pointer relative
                    ${isCurrentDay ? 'ring-2 ring-offset-1 ring-blue-500' : ''}
                    ${isCompleted ? categoryStyle.bg : `${colors.card} opacity-70`}
                    hover:opacity-100 transition-all
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDaySelect(day)}
                >
                  <div className="flex flex-col items-center">
                    <span className={`text-sm sm:text-lg font-bold ${colors.text}`}>{day}</span>
                    {question && (
                      <span className={`text-xs ${categoryStyle.text} mt-1 text-center hidden sm:block`}>
                        {category}
                      </span>
                    )}
                    {isCompleted && (
                      <span className="absolute top-0 right-0 text-xs sm:text-sm text-green-500">✓</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // カテゴリーの凡例を表示
  const renderCategoryLegend = () => {
    return (
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {Object.entries(categoryColors).map(([category, style]) => (
          <div key={category} className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${style.bg} mr-1`}></div>
            <span className={`text-xs ${style.text}`}>{category}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      className={`p-2 sm:p-4 ${colors.card} rounded-lg shadow-md border ${colors.cardBorder}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className={`text-lg sm:text-xl font-bold mb-2 sm:mb-4 ${colors.text} text-center`}>問題カレンダー</h2>
      <p className={`mb-2 sm:mb-4 ${colors.subtext} text-center text-xs sm:text-sm`}>
        日付をクリックして問題に移動できます。色は問題のカテゴリーを表します。
      </p>
      
      {renderCalendarGrid()}
      {renderCategoryLegend()}
      
      <div className="mt-4 sm:mt-6 flex justify-between items-center">
        <div className={`${colors.subtext} text-xs sm:text-sm`}>
          <span className="font-bold">{Object.values(progress).filter(Boolean).length}</span> / {questions.length} 完了
        </div>
        <div className={`h-2 flex-1 mx-2 sm:mx-4 rounded-full ${colors.progressBg}`}>
          <div 
            className={`h-full rounded-full ${colors.progressBar}`}
            style={{ width: `${(Object.values(progress).filter(Boolean).length / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuizCalendar;
