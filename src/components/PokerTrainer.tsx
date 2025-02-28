"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllQuizQuestions } from '../supabase/quizService';
import type { QuizQuestion } from '../supabase/quizService';
import QuizCalendar from './QuizCalendar';
import StatsDashboard from './StatsDashboard';
import AuthForm from './AuthForm';
import UserProfile from './UserProfile';
import { getCurrentUser, getUserProgress, saveUserProgress } from '../supabase/authService';
import type { User } from '@supabase/supabase-js';
import BackgroundPaths from './ui/BackgroundPaths';

const PokerTrainer = () => {
  const [currentDay, setCurrentDay] = useState(1);
  const [showAnswer, setShowAnswer] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [progress, setProgress] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'quiz' | 'calendar' | 'stats'>('quiz');
  const [user, setUser] = useState<User | null>(null);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  // テーマの色
  const colors = theme === 'dark' 
    ? {
        bg: 'bg-background',
        card: 'bg-gray-800',
        text: 'text-foreground',
        subtext: 'text-gray-300',
        button: 'bg-primary hover:bg-primary-hover',
        cardBorder: 'border-gray-700',
        header: 'bg-gray-800',
        accent: 'text-accent',
        categoryBg: 'bg-blue-900',
        progressBar: 'bg-primary',
        progressBg: 'bg-gray-700'
      }
    : {
        bg: 'bg-background',
        card: 'bg-white',
        text: 'text-foreground',
        subtext: 'text-gray-600',
        button: 'bg-primary hover:bg-primary-hover',
        cardBorder: 'border-gray-200',
        header: 'bg-white',
        accent: 'text-accent',
        categoryBg: 'bg-blue-100',
        progressBar: 'bg-primary',
        progressBg: 'bg-gray-200'
      };

  // 初期データの読み込み
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 問題データの取得
        const questions = await getAllQuizQuestions();
        setQuestions(questions);
        
        // ユーザー情報の取得
        const { user, error: userError } = await getCurrentUser();
        if (userError) throw userError;
        setUser(user);
        
        // 進捗データの取得
        if (user) {
          // ログイン済みの場合はSupabaseから進捗を取得
          const { progress: userProgress, error: progressError } = await getUserProgress(user.id);
          if (progressError) throw progressError;
          setProgress(userProgress || {});
        } else {
          // 未ログインの場合はローカルストレージから進捗を取得
          const savedProgress = localStorage.getItem('quizProgress');
          if (savedProgress) {
            setProgress(JSON.parse(savedProgress));
          }
        }
      } catch (err: unknown) {
        console.error('Error loading data:', err);
        setError('データの読み込み中にエラーが発生しました。');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // 進捗状況を保存
  const saveProgress = (day: number, completed: boolean) => {
    const newProgress = { ...progress, [day]: completed };
    setProgress(newProgress);
    if (user) {
      // ログイン済みの場合はSupabaseに保存
      saveUserProgress(user.id, newProgress).catch(err => {
        console.error('Error saving progress:', err);
      });
    } else {
      // 未ログインの場合はローカルストレージに保存
      localStorage.setItem('quizProgress', JSON.stringify(newProgress));
    }
  };
  
  // 認証成功時の処理
  const handleAuthSuccess = async () => {
    try {
      // 最新のユーザー情報を取得
      const { user: currentUser, error: userError } = await getCurrentUser();
      if (userError) throw userError;
      setUser(currentUser);
      
      if (currentUser) {
        // ユーザーの進捗データを取得
        const { progress: userProgress, error: progressError } = await getUserProgress(currentUser.id);
        if (progressError) throw progressError;
        
        // ローカルの進捗データとマージ
        const localProgress = JSON.parse(localStorage.getItem('quizProgress') || '{}');
        const mergedProgress = { ...localProgress, ...userProgress };
        
        // マージした進捗データを保存
        setProgress(mergedProgress);
        await saveUserProgress(currentUser.id, mergedProgress);
      }
      
      setShowAuthForm(false);
    } catch (err) {
      console.error('Error after authentication:', err);
    }
  };
  
  // ログアウト時の処理
  const handleSignOut = () => {
    setUser(null);
    // ローカルストレージの進捗データを保持
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const goToPreviousDay = () => {
    if (currentDay > 1) {
      setCurrentDay(currentDay - 1);
      setShowAnswer(false);
    }
  };

  const goToNextDay = () => {
    if (currentDay < questions.length) {
      setCurrentDay(currentDay + 1);
      setShowAnswer(false);
    }
  };

  // カテゴリーに応じた色とラベルを取得
  const getCategoryStyle = (category: string) => {
    const styles: Record<string, { bg: string, text: string, label: string }> = {
      'early': { 
        bg: 'bg-blue-500', 
        text: 'text-white',
        label: 'トーナメント序盤'
      },
      'middle': { 
        bg: 'bg-green-500', 
        text: 'text-white',
        label: 'トーナメント中盤'
      },
      'late': { 
        bg: 'bg-purple-500', 
        text: 'text-white',
        label: 'トーナメント終盤'
      },
      'bubble': { 
        bg: 'bg-yellow-500', 
        text: 'text-black',
        label: 'バブル'
      },
      'final': { 
        bg: 'bg-red-500', 
        text: 'text-white',
        label: 'ファイナルテーブル'
      }
    };
    
    return styles[category] || { bg: 'bg-gray-500', text: 'text-white', label: category };
  };

  // 全体の進捗率を計算
  const calculateProgress = () => {
    return Math.round((Object.keys(progress).length / questions.length) * 100);
  };

  // トーナメント問題データ (フォールバック用)
  const localQuestions = [
    {
      day: 1,
      title: "トーナメント序盤のスタックサイズ効果と3ベット戦略",
      category: "early",
      question: `ブラインド100/200（アンティ25）、12人テーブル、ディープスタック形式。
• あなた（100BB）はハイジャック（HJ）から A♥K♦ で2.5BBオープン。
• カットオフ（CO, 120BB）が3ベット（7BB）。
• フォールドがあなたに回ってきた。

トーナメント序盤のディープスタック状況で、このハンドをどう扱いますか？ 4ベット、コール、フォールドのどれが最も期待値が高いでしょう？`,
      solution: `• 解説
• トーナメント序盤のディープスタック時は、チップEVが重視されポジションの価値が高まる。
• AKoはプレミアムハンドだが、ポジション不利（HJ vs CO）である点に注意。
• 戦略的選択肢:
  1. 4ベット（16-18BB程度）: GTOソルバーも推奨するプレイ。相手のコール・5ベットレンジを引き出すことでバリューを取れる。
  2. コール: ディープだとポジション不利は厳しいが、ボードによってはポストフロップでバリューを得やすい。
  3. フォールド: 最も期待値が低い選択肢。AKoはあまりにも強すぎるためフォールドは非効率。

• 結論: トーナメント序盤のディープスタックなら、4ベット を推奨。スタック的に負けても再エントリー/リバイ可能期間であればアグレッシブに攻めるべき。`
    },
    {
      day: 2,
      title: "早期のアンティ効果とオープンレンジ",
      category: "early",
      question: `ブラインド100/200（アンティ25）、9人テーブル、全員70BB以上。
• あなたはUTG+1でK♥Q♠を持っている。
• UTGはフォールド。

通常のノーリミットキャッシュゲームでは、UTG+1からKQoをオープンするのはやや広めのレンジですが、トーナメントのアンティあり状況ではどう判断しますか？`,
      solution: `• 解説
• アンティの存在がプリフロップのオープンレンジに影響:
  - ノーアンティ: UTG+1からのKQoは多くのGTOレンジではフォールド推奨
  - アンティあり: レンジが広がり、KQoも含まれることが多い

• アンティの効果:
  1. ポットが最初から大きくなるため、勝率が低くてもオープンEVがプラスになりやすい
  2. スティールの価値が上がり、ポジション序盤でもプレイ可能なハンドが増える

• KQoのUTG+1オープン:
  - アンティ25/ブラインド200 = 12.5%のアンティ比率は、レンジを20-25%広げる効果がある
  - KQoはボーダーラインだが、アンティありならオープンレイズ（2.3-2.5BB）が推奨

• 結論: アンティありのトーナメント形式では2.3BBでオープンが基本戦略。ただしテーブルがタイトな傾向なら、レイズサイズは2.2BBにすることでスチール成功率を高めることも検討。`
    }
  ];

  // 現在表示する問題を取得
  const selectedDay = questions.find(q => q.day === currentDay) || questions[0] || localQuestions[0];
  const categoryStyle = getCategoryStyle(selectedDay?.category || 'early');

  if (isLoading) {
    return (
      <div className={`flex flex-col min-h-screen items-center justify-center ${colors.bg}`}>
        <div className={`${colors.text} text-xl`}>読み込み中...</div>
      </div>
    );
  }

  // スプラッシュ画面を表示
  if (showSplashScreen) {
    return (
      <BackgroundPaths 
        title="Poker Training App" 
        onLoginClick={() => {
          setShowSplashScreen(false);
          setShowAuthForm(true);
        }} 
      />
    );
  }

  return (
    <div className={`flex flex-col min-h-screen ${colors.bg}`}>
      {/* ヘッダー */}
      <motion.header 
        className={`sticky top-0 z-10 flex justify-between items-center p-4 ${colors.header} shadow-md`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={`text-xl font-bold ${colors.text}`}>テキサスホールデム問題集</h1>
        <div className="flex items-center space-x-3">
          <div className={`hidden sm:flex text-sm ${colors.subtext} items-center`}>
            <div className="w-20 mr-2">進捗:</div>
            <div className="w-24 bg-gray-700 rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
            </div>
            <span className="ml-2">{calculateProgress()}%</span>
          </div>
          <button 
            onClick={toggleTheme} 
            className={`p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500 ${colors.text} transition-colors`}
            aria-label={theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {user ? (
            <UserProfile 
              user={user} 
              onSignOut={handleSignOut} 
              colors={colors} 
            />
          ) : (
            <motion.button
              onClick={() => setShowAuthForm(true)}
              className={`ml-2 px-4 py-2 text-sm rounded-md ${colors.button} ${colors.text} shadow-sm`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ログイン
            </motion.button>
          )}
        </div>
      </motion.header>

      {/* 進捗バー (モバイル用) */}
      <div className="sm:hidden">
        <div className={`flex items-center px-4 py-2 ${colors.subtext}`}>
          <div className="w-16 mr-2">進捗:</div>
          <div className="flex-1 bg-gray-700 rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
          </div>
          <span className="ml-2 w-12 text-right">{calculateProgress()}%</span>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className={`flex justify-center p-2 ${colors.header} border-b ${colors.cardBorder} sticky top-[73px] z-10`}>
        <nav className="flex flex-wrap justify-center space-x-2">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'quiz' 
                ? `${colors.button} ${colors.text} shadow-sm` 
                : `${colors.text} hover:bg-gray-700 hover:bg-opacity-30`
            }`}
          >
            問題
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'calendar' 
                ? `${colors.button} ${colors.text} shadow-sm` 
                : `${colors.text} hover:bg-gray-700 hover:bg-opacity-30`
            }`}
          >
            カレンダー
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'stats' 
                ? `${colors.button} ${colors.text} shadow-sm` 
                : `${colors.text} hover:bg-gray-700 hover:bg-opacity-30`
            }`}
          >
            統計
          </button>
        </nav>
      </div>

      {/* メインコンテンツ */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-4xl mx-auto w-full overflow-x-hidden">
        {error && (
          <div className="mb-6 p-4 bg-red-500 bg-opacity-20 text-red-700 rounded-md border border-red-300">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}
        
        {activeTab === 'quiz' && (
          <motion.div 
            className={`mb-6 p-5 sm:p-6 md:p-8 ${colors.card} rounded-lg shadow-card hover:shadow-card-hover border ${colors.cardBorder} transition-shadow`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
              <div className="flex items-center">
                <span className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${colors.button} ${colors.text} mr-3 font-bold text-lg`}>
                  {currentDay}
                </span>
                <h2 className={`text-lg font-bold ${colors.text}`}>Day {selectedDay.day}</h2>
              </div>
              <span className={`px-4 py-1.5 text-sm font-medium rounded-full ${categoryStyle.bg} ${categoryStyle.text} self-start sm:self-auto`}>
                {categoryStyle.label}
              </span>
            </div>
            <h3 className={`text-xl sm:text-2xl font-bold mb-4 ${colors.accent}`}>{selectedDay.title}</h3>
            <div className={`mb-6 whitespace-pre-line ${colors.text} leading-relaxed text-base sm:text-lg`}>
              {selectedDay.question}
            </div>
            <motion.button
              onClick={() => {
                setShowAnswer(!showAnswer);
                if (!showAnswer) {
                  saveProgress(selectedDay.day, true);
                }
              }}
              className={`w-full py-4 mb-6 rounded-md font-bold text-lg ${colors.button} ${colors.text} transition-colors shadow-sm`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {showAnswer ? "問題を隠す" : "解答を見る"}
            </motion.button>
            
            {showAnswer && (
              <motion.div 
                className={`p-5 rounded-md bg-opacity-10 bg-blue-500 ${colors.subtext} whitespace-pre-line leading-relaxed text-base`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                {selectedDay.solution}
              </motion.div>
            )}
          </motion.div>
        )}
        {activeTab === 'calendar' && (
          <QuizCalendar 
            questions={questions}
            progress={progress}
            currentDay={currentDay}
            onDaySelect={(day) => {
              setCurrentDay(day);
              setActiveTab('quiz');
              setShowAnswer(false);
            }}
            colors={colors}
          />
        )}
        {activeTab === 'stats' && (
          <StatsDashboard 
            questions={questions}
            progress={progress}
            colors={colors}
          />
        )}
        
        {/* ナビゲーションボタン */}
        {activeTab === 'quiz' && (
          <div className="flex justify-between mt-6">
            <motion.button
              onClick={goToPreviousDay}
              disabled={currentDay <= 1}
              className={`flex items-center px-4 py-3 rounded-md ${currentDay <= 1 ? 'opacity-50 cursor-not-allowed' : ''} ${colors.text} hover:bg-gray-700 hover:bg-opacity-10 transition-colors`}
              whileHover={currentDay > 1 ? { scale: 1.05 } : {}}
              whileTap={currentDay > 1 ? { scale: 0.95 } : {}}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              前の問題
            </motion.button>
            <motion.button
              onClick={goToNextDay}
              disabled={currentDay >= questions.length}
              className={`flex items-center px-4 py-3 rounded-md ${currentDay >= questions.length ? 'opacity-50 cursor-not-allowed' : ''} ${colors.text} hover:bg-gray-700 hover:bg-opacity-10 transition-colors`}
              whileHover={currentDay < questions.length ? { scale: 1.05 } : {}}
              whileTap={currentDay < questions.length ? { scale: 0.95 } : {}}
            >
              次の問題
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </div>
        )}
      </main>

      {/* 認証フォームモーダル */}
      {showAuthForm && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAuthForm(false)}
        >
          <motion.div
            className="w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <AuthForm onSuccess={handleAuthSuccess} colors={colors} />
          </motion.div>
        </motion.div>
      )}
      
      {/* フッター */}
      <footer className={`p-6 text-center ${colors.subtext} text-sm border-t ${colors.cardBorder}`}>
        <div className="max-w-4xl mx-auto">
          <p className="mb-2">テキサスホールデムトーナメント問題集 2025</p>
          <p className="text-xs">毎日のポーカートーナメント戦略学習プラットフォーム</p>
        </div>
      </footer>
    </div>
  );
};

export default PokerTrainer;
