import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { signOut } from '../supabase/authService';
import type { User } from '@supabase/supabase-js';

interface UserProfileProps {
  user: User;
  onSignOut: () => void;
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

const UserProfile: React.FC<UserProfileProps> = ({ user, onSignOut, colors }) => {
  const [loading, setLoading] = useState(false);
  
  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      onSignOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  // ユーザーのイニシャルを取得
  const getUserInitial = () => {
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name.charAt(0).toUpperCase();
    }
    return 'U';
  };
  
  return (
    <motion.div
      className={`p-2 sm:p-3 rounded-md ${colors.card} border ${colors.cardBorder} flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center w-full sm:w-auto">
        <motion.div 
          className={`h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ${colors.text} font-bold text-sm`}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          aria-label="User avatar"
        >
          {getUserInitial()}
        </motion.div>
        <div className="ml-2 overflow-hidden">
          <div className={`text-sm font-medium ${colors.text} truncate max-w-[200px]`} title={user.email || ''}>
            {user.email}
          </div>
          <div className={`text-xs ${colors.subtext} flex items-center`}>
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
            ログイン中
          </div>
        </div>
      </div>
      
      <motion.button
        onClick={handleSignOut}
        className={`text-xs px-3 py-1.5 rounded-md ${colors.button} ${colors.text} transition-colors duration-200 hover:bg-opacity-80 w-full sm:w-auto mt-2 sm:mt-0`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={loading}
        aria-label="ログアウト"
      >
        {loading ? (
          <span className="inline-flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            処理中...
          </span>
        ) : 'ログアウト'}
      </motion.button>
    </motion.div>
  );
};

export default UserProfile;
