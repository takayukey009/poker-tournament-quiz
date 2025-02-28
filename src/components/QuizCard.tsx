"use client";

import React from 'react';
import { motion } from 'framer-motion';
import type { QuizQuestion } from '../supabase/quizService';

interface QuizCardProps {
  quiz: QuizQuestion;
  onAnswerClick: (index: number) => void;
  selectedAnswer?: number | null;
  showAnswer?: boolean;
}

export default function QuizCard({ 
  quiz, 
  onAnswerClick, 
  selectedAnswer = null, 
  showAnswer = false,
}: QuizCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto overflow-hidden rounded-xl border border-slate-700 bg-slate-800 text-white shadow-xl"
    >
      <div className="bg-slate-700 p-4 pb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="px-2 py-1 bg-blue-900/50 text-blue-300 border border-blue-700 rounded-md text-sm">
            Day {quiz.day}
          </span>
          <span className="px-2 py-1 bg-green-900/50 text-green-300 border border-green-700 rounded-md text-sm">
            {quiz.category}
          </span>
        </div>
        <h2 className="text-xl font-bold">{quiz.title}</h2>
        {quiz.description && (
          <p className="text-slate-300 text-sm mt-1">{quiz.description}</p>
        )}
      </div>
      
      <div className="p-4">
        <div className="prose prose-invert max-w-none mb-6">
          <div dangerouslySetInnerHTML={{ __html: quiz.content || quiz.question }} />
        </div>
        
        <div className="space-y-3">
          {(quiz.options || []).map((option, index) => {
            // 回答後の状態に応じたスタイルを設定
            let optionStyle = "border-slate-600 hover:bg-slate-700";
            
            if (showAnswer) {
              if (index === quiz.correct_answer) {
                optionStyle = "border-green-600 bg-green-900/30 text-green-200";
              } else if (index === selectedAnswer) {
                optionStyle = "border-red-600 bg-red-900/30 text-red-200";
              }
            } else if (index === selectedAnswer) {
              optionStyle = "border-blue-600 bg-blue-900/30 text-blue-200";
            }
            
            return (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  className={`w-full text-left py-4 px-4 rounded-lg border ${optionStyle} transition-colors flex items-start`}
                  onClick={() => onAnswerClick(index)}
                  disabled={showAnswer}
                >
                  <span className="mr-3 inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-700 text-sm flex-shrink-0 mt-0.5">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </button>
              </motion.div>
            );
          })}
        </div>
        
        {showAnswer && (
          <motion.div 
            className="mt-6 p-4 border border-slate-600 rounded-lg bg-slate-700/50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-2">解説</h3>
            <div dangerouslySetInnerHTML={{ __html: quiz.explanation || '' }} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
