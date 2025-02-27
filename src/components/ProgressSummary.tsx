import React from 'react';
import { preflop, flop, turn, river, icm } from '../data/questionData';

interface ProgressSummaryProps {
  progress: Record<string, string>;
}

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ progress }) => {
  const allQuestions = [...preflop, ...flop, ...turn, ...river, ...icm];
  const totalQuestions = allQuestions.length;
  const solvedQuestions = Object.keys(progress).length;
  const correctQuestions = Object.values(progress).filter(status => status === 'correct').length;
  
  const progressPercentage = totalQuestions > 0 
    ? Math.round((solvedQuestions / totalQuestions) * 100) 
    : 0;
  
  const correctPercentage = solvedQuestions > 0 
    ? Math.round((correctQuestions / solvedQuestions) * 100) 
    : 0;

  return (
    <div className="progress-summary bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">進捗状況</h3>
        <span className="text-sm text-gray-500">
          {solvedQuestions}/{totalQuestions} 問題 ({progressPercentage}%)
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-500 h-2.5 rounded-full" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between mt-4">
        <div className="text-center">
          <p className="text-xs text-gray-500">回答済み</p>
          <p className="font-medium">{solvedQuestions}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">正解率</p>
          <p className="font-medium">{correctPercentage}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">正解数</p>
          <p className="font-medium">{correctQuestions}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">未回答</p>
          <p className="font-medium">{totalQuestions - solvedQuestions}</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressSummary;
