import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { signOut } from '../supabase/authService';

interface UserProfileProps {
  user: Record<string, any>;
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
  
  return (
    <motion.div
      className={`p-3 rounded-md ${colors.card} border ${colors.cardBorder} flex items-center justify-between`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center">
        <div className={`h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ${colors.text} font-bold text-sm`}>
          {user.email?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="ml-2">
          <div className={`text-sm font-medium ${colors.text}`}>
            {user.email}
          </div>
          <div className={`text-xs ${colors.subtext}`}>
            ログイン中
          </div>
        </div>
      </div>
      
      <motion.button
        onClick={handleSignOut}
        className={`text-xs px-2 py-1 rounded ${colors.button} ${colors.text}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={loading}
      >
        {loading ? '...' : 'ログアウト'}
      </motion.button>
    </motion.div>
  );
};

export default UserProfile;
