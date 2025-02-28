"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllQuizQuestions } from '../supabase/quizService';
import type { QuizQuestion } from '../supabase/quizService';
import QuizCalendar from './QuizCalendar';
import StatsDashboard from './StatsDashboard';
import { getCurrentUser, getUserProgress, saveUserProgress } from '../supabase/authService';
import type { User } from '@supabase/supabase-js';
import BackgroundPaths from './ui/BackgroundPaths';
import SplashScreen from './SplashScreen';
import Navbar from './Navbar';
import PageTransition from './PageTransition';

const PokerTrainer = () => {
  const [currentDay, setCurrentDay] = useState(1);
  const [showAnswer, setShowAnswer] = useState(false);
  const [progress, setProgress] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'quiz' | 'calendar' | 'stats'>('quiz');
  const [user, setUser] = useState<User | null>(null);
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  // テーマの色
  const colors = {
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
  const handleAuthSuccess = () => {
    try {
      // 最新のユーザー情報を取得
      getCurrentUser().then(({ user: currentUser, error: userError }) => {
        if (userError) throw userError;
        setUser(currentUser);
        
        // ユーザーの進捗データを取得
        if (currentUser) {
          getUserProgress(currentUser.id).then(({ data: userProgress, error: progressError }) => {
            if (progressError) throw progressError;
            
            // ローカルの進捗データとマージ
            const localProgress = JSON.parse(localStorage.getItem('quizProgress') || '{}');
            const mergedProgress = { ...localProgress, ...userProgress };
            
            // 進捗データを更新
            setProgress(mergedProgress);
            
            // サーバーに保存
            saveUserProgress(currentUser.id, mergedProgress);
          });
        }
      });
    } catch (err) {
      console.error('Error after authentication:', err);
    }
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

  // カテゴリーに応じたスタイルを取得
  const getCategoryStyle = (category: string) => {
    const styles: Record<string, { bg: string, text: string, label: string }> = {
      'トーナメント基礎': { bg: 'bg-blue-500', text: 'text-white', label: 'トーナメント基礎' },
      'ハンドレンジ': { bg: 'bg-green-500', text: 'text-white', label: 'ハンドレンジ' },
      'ポジション': { bg: 'bg-purple-500', text: 'text-white', label: 'ポジション' },
      'ICM': { bg: 'bg-red-500', text: 'text-white', label: 'ICM' },
      'バブル': { bg: 'bg-yellow-500', text: 'text-black', label: 'バブル' },
      'ファイナルテーブル': { bg: 'bg-orange-500', text: 'text-white', label: 'ファイナルテーブル' },
    };
    
    return styles[category] || { bg: 'bg-gray-500', text: 'text-white', label: category };
  };

  // トーナメント問題データ (フォールバック用)
  const localQuestions = [
    {
      day: 1,
      title: "トーナメント序盤のスタックサイズ効果と3ベット戦略",
      category: "トーナメント基礎",
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
      category: "トーナメント基礎",
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
  const categoryStyle = getCategoryStyle(selectedDay?.category || 'トーナメント基礎');

  // スプラッシュ画面を表示（ローディングよりも先にチェック）
  if (showSplashScreen) {
    return (
      <SplashScreen 
        onLoginClick={(mode) => {
          setShowSplashScreen(false);
          if (mode !== 'guest') {
            handleAuthSuccess();
          }
        }} 
      />
    );
  }

  // ローディング画面
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-4"
        />
        <p className="text-lg">読み込み中...</p>
      </div>
    );
  }

  // エラー画面
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">エラーが発生しました</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md transition-colors"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen ${colors.bg}`}>
      <>
        <Navbar 
          user={user} 
          activeTab={activeTab} 
          onTabChange={(tab) => setActiveTab(tab as 'quiz' | 'calendar' | 'stats')}
        />
        
        <main className="flex-grow p-4 sm:p-6">
          <PageTransition>
            {activeTab === 'quiz' && (
              <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h1 className="text-2xl font-bold text-white mb-4 sm:mb-0">
                    ポーカートーナメントクイズ
                  </h1>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={goToPreviousDay}
                      disabled={currentDay <= 1}
                      className={`px-3 py-2 rounded-md ${
                        currentDay <= 1 
                          ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                          : 'bg-slate-700 hover:bg-slate-600 text-white'
                      }`}
                    >
                      前の日
                    </button>
                    <div className="px-3 py-2 bg-slate-800 rounded-md text-white">
                      Day {currentDay}
                    </div>
                    <button
                      onClick={goToNextDay}
                      disabled={currentDay >= questions.length}
                      className={`px-3 py-2 rounded-md ${
                        currentDay >= questions.length 
                          ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                          : 'bg-slate-700 hover:bg-slate-600 text-white'
                      }`}
                    >
                      次の日
                    </button>
                  </div>
                </div>
                
                {selectedDay ? (
                  <motion.div 
                    className={`mb-6 p-5 sm:p-6 md:p-8 ${colors.card} rounded-lg shadow-card hover:shadow-card-hover border ${colors.cardBorder} transition-shadow`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${colors.button} ${colors.text} mr-3 font-bold text-lg`}>
                          {selectedDay.day}
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
                ) : (
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-center text-white">
                    <p>この日のクイズはありません。</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'calendar' && (
              <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-white mb-6">学習カレンダー</h1>
                <QuizCalendar 
                  questions={questions} 
                  progress={progress} 
                  onDayClick={(day) => {
                    setCurrentDay(day);
                    setActiveTab('quiz');
                  }} 
                />
              </div>
            )}
            
            {activeTab === 'stats' && (
              <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-white mb-6">学習統計</h1>
                <StatsDashboard 
                  questions={questions} 
                  progress={progress} 
                />
              </div>
            )}
          </PageTransition>
        </main>
        
        <footer className="bg-slate-900 border-t border-slate-800 py-4 px-6 text-center text-slate-400 text-sm">
          <p> 2024</p>
        </footer>
      </>
      <BackgroundPaths />
    </div>
  );
};

export default PokerTrainer;
