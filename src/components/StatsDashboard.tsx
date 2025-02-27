"use client";

import React from 'react';
import { motion } from 'framer-motion';
import type { QuizQuestion } from '../supabase/quizService';

interface StatsDashboardProps {
  questions: QuizQuestion[];
  progress: Record<number, boolean>;
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

const StatsDashboard: React.FC<StatsDashboardProps> = ({ questions, progress, colors }) => {
  // カテゴリー別の統計を計算
  const calculateCategoryStats = () => {
    const categories: Record<string, { total: number; completed: number }> = {};
    
    questions.forEach(question => {
      const category = question.category;
      if (!categories[category]) {
        categories[category] = { total: 0, completed: 0 };
      }
      
      categories[category].total += 1;
      if (progress[question.day]) {
        categories[category].completed += 1;
      }
    });
    
    return categories;
  };
  
  const categoryStats = calculateCategoryStats();
  const totalCompleted = Object.values(progress).filter(Boolean).length;
  const totalQuestions = questions.length;
  const completionPercentage = totalQuestions > 0 
    ? Math.round((totalCompleted / totalQuestions) * 100) 
    : 0;
  
  // カテゴリーごとの色を定義
  const categoryColors = {
    'プリフロップ': { bg: 'bg-blue-500', text: 'text-blue-500' },
    'フロップ': { bg: 'bg-green-500', text: 'text-green-500' },
    'ターン': { bg: 'bg-yellow-500', text: 'text-yellow-500' },
    'リバー': { bg: 'bg-red-500', text: 'text-red-500' },
    'ショーダウン': { bg: 'bg-purple-500', text: 'text-purple-500' },
    'その他': { bg: 'bg-gray-500', text: 'text-gray-500' },
  };
  
  // パフォーマンス最適化のためのメモ化
  const sortedCategories = React.useMemo(() => {
    return Object.entries(categoryStats).sort((a, b) => {
      // 完了率で降順ソート
      const aPercentage = a[1].total > 0 ? a[1].completed / a[1].total : 0;
      const bPercentage = b[1].total > 0 ? b[1].completed / b[1].total : 0;
      return bPercentage - aPercentage;
    });
  }, [categoryStats]);
  
  return (
    <motion.div
      className={`p-2 sm:p-4 ${colors.card} rounded-lg shadow-md border ${colors.cardBorder}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className={`text-lg sm:text-xl font-bold mb-2 sm:mb-4 ${colors.text} text-center`}>学習進捗</h2>
      
      {/* 全体の進捗 */}
      <div className="mb-4 sm:mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className={`font-bold ${colors.text} text-sm sm:text-base`}>全体の進捗</span>
          <span className={`${colors.subtext} text-xs sm:text-sm`}>{totalCompleted} / {totalQuestions} ({completionPercentage}%)</span>
        </div>
        <div className={`h-3 sm:h-4 w-full rounded-full ${colors.progressBg} overflow-hidden`}>
          <motion.div 
            className={`h-full rounded-full ${colors.progressBar}`}
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
            aria-label={`${completionPercentage}% completed overall`}
          ></motion.div>
        </div>
      </div>
      
      {/* カテゴリー別の進捗 */}
      <h3 className={`text-base sm:text-lg font-bold mb-2 sm:mb-3 ${colors.text}`}>カテゴリー別の進捗</h3>
      <div className="space-y-3 sm:space-y-4">
        {sortedCategories.map(([category, stats]) => {
          const categoryPercentage = stats.total > 0 
            ? Math.round((stats.completed / stats.total) * 100) 
            : 0;
          
          const categoryColor = categoryColors[category as keyof typeof categoryColors] || categoryColors['その他'];
          
          return (
            <div key={category} className="mb-2 sm:mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className={`font-medium ${categoryColor.text} text-xs sm:text-sm`}>{category}</span>
                <span className={`${colors.subtext} text-xs`}>{stats.completed} / {stats.total} ({categoryPercentage}%)</span>
              </div>
              <div className={`h-2 sm:h-3 w-full rounded-full ${colors.progressBg} overflow-hidden`}>
                <motion.div 
                  className={`h-full rounded-full ${categoryColor.bg}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${categoryPercentage}%` }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  aria-label={`${categoryPercentage}% completed for ${category}`}
                ></motion.div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* 学習のヒント */}
      <motion.div 
        className={`mt-4 sm:mt-6 p-2 sm:p-3 rounded-md bg-opacity-10 bg-blue-500 ${colors.subtext}`}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className={`text-sm sm:text-md font-bold mb-1 sm:mb-2 ${colors.accent}`}>学習のヒント</h3>
        <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
          <li>毎日1問ずつ解くことで、継続的に学習を進めましょう</li>
          <li>苦手なカテゴリーを重点的に復習することで効率的に上達できます</li>
          <li>解答を見た後も、自分の言葉で説明できるか確認しましょう</li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default StatsDashboard;
