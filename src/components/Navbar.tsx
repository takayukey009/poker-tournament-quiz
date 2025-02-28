"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';

interface NavbarProps {
  user: User | null;
  activeTab: string;
  onTabChange: (tab: 'quiz' | 'calendar' | 'stats') => void;
}

export default function Navbar({ user, activeTab, onTabChange }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 py-3 px-4 sm:px-6 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-center cursor-pointer" onClick={() => onTabChange('quiz')}>
            <div className="h-8 w-8 mr-2 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">♠️</span>
            </div>
            <span className="text-xl font-bold text-white hidden sm:inline">ポーカークイズ</span>
          </div>
          
          <div className="hidden md:flex ml-10 space-x-1">
            <button 
              onClick={() => onTabChange('quiz')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'quiz' 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              クイズ
            </button>
            <button 
              onClick={() => onTabChange('calendar')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'calendar' 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              カレンダー
            </button>
            <button 
              onClick={() => onTabChange('stats')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'stats' 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              統計
            </button>
          </div>
        </div>
        
        <div className="flex items-center">
          {user ? (
            <div className="relative">
              <button 
                className="flex items-center space-x-2 text-white"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline">{user.email?.split('@')[0]}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              
              {isUserMenuOpen && (
                <motion.div 
                  className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg py-1 z-20"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-4 py-2 border-b border-slate-700">
                    <p className="text-sm font-medium text-white">{user.email}</p>
                  </div>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                    onClick={handleSignOut}
                  >
                    ログアウト
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              onClick={() => window.location.reload()}
            >
              ログイン
            </button>
          )}
          
          <button
            className="ml-4 md:hidden text-slate-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {isMenuOpen ? (
                <path d="M18 6 6 18M6 6l12 12"/>
              ) : (
                <path d="M4 12h16M4 6h16M4 18h16"/>
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* モバイルメニュー */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden mt-2 px-2 pt-2 pb-3 space-y-1"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
        >
          <button 
            onClick={() => {
              onTabChange('quiz');
              setIsMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-md ${
              activeTab === 'quiz' 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            クイズ
          </button>
          <button 
            onClick={() => {
              onTabChange('calendar');
              setIsMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-md ${
              activeTab === 'calendar' 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            カレンダー
          </button>
          <button 
            onClick={() => {
              onTabChange('stats');
              setIsMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-md ${
              activeTab === 'stats' 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            統計
          </button>
        </motion.div>
      )}
    </nav>
  );
}
