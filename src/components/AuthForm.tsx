import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { signIn, signUp } from '../supabase/authService';

interface AuthFormProps {
  onSuccess: () => void;
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

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess, colors }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    if (!isLogin && password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }
    
    setLoading(true);
    
    try {
      if (isLogin) {
        // ログイン処理
        const { data, error } = await signIn(email, password);
        if (error) throw error;
        
        setMessage('ログインに成功しました');
        onSuccess();
      } else {
        // 新規登録処理
        const { data, error } = await signUp(email, password);
        if (error) throw error;
        
        setMessage('登録に成功しました。メールを確認してください。');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={`w-full max-w-md mx-auto p-4 sm:p-6 ${colors.card} rounded-lg shadow-md border ${colors.cardBorder}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className={`text-xl font-bold mb-6 text-center ${colors.text}`}>
        {isLogin ? 'ログイン' : '新規登録'}
      </h2>
      
      {error && (
        <motion.div 
          className="mb-4 p-3 bg-red-500 bg-opacity-20 text-red-700 rounded-md text-sm"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.div>
      )}
      
      {message && (
        <motion.div 
          className="mb-4 p-3 bg-green-500 bg-opacity-20 text-green-700 rounded-md text-sm"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          {message}
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className={`block mb-1 text-sm font-medium ${colors.text}`}>
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-2 rounded-md border ${colors.cardBorder} bg-opacity-20 bg-gray-700 ${colors.text}`}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className={`block mb-1 text-sm font-medium ${colors.text}`}>
            パスワード
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-2 rounded-md border ${colors.cardBorder} bg-opacity-20 bg-gray-700 ${colors.text}`}
            required
          />
        </div>
        
        {!isLogin && (
          <div>
            <label htmlFor="confirmPassword" className={`block mb-1 text-sm font-medium ${colors.text}`}>
              パスワード（確認）
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full p-2 rounded-md border ${colors.cardBorder} bg-opacity-20 bg-gray-700 ${colors.text}`}
              required
            />
          </div>
        )}
        
        <motion.button
          type="submit"
          className={`w-full py-2 rounded-md font-bold ${colors.button} ${colors.text} transition-colors`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              処理中...
            </span>
          ) : (
            isLogin ? 'ログイン' : '登録する'
          )}
        </motion.button>
      </form>
      
      <div className="mt-4 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className={`text-sm ${colors.accent} hover:underline`}
        >
          {isLogin ? '新規登録はこちら' : 'ログインはこちら'}
        </button>
      </div>
    </motion.div>
  );
};

export default AuthForm;
