import { createClient } from '@supabase/supabase-js';

// Supabaseクライアントの初期化
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ユーザー登録
export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error signing up:', error);
    return { data: null, error };
  }
};

// ログイン
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { data: null, error };
  }
};

// Googleでログイン
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    return { data: null, error };
  }
};

// ログアウト
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error };
  }
};

// 現在のユーザーを取得
export const getCurrentUser = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    if (!session) {
      return { user: null, error: null };
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    return { user, error: null };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { user: null, error };
  }
};

// ユーザープロファイルの取得
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return { profile: data, error: null };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { profile: null, error };
  }
};

// ユーザープロファイルの作成/更新
export const upsertUserProfile = async (userId: string, profileData: Record<string, unknown>) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({ 
        user_id: userId,
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .select();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error upserting user profile:', error);
    return { data: null, error };
  }
};

// ユーザーの進捗状況を保存
export const saveUserProgress = async (userId: string, progress: Record<number, boolean>) => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({ 
        user_id: userId,
        progress_data: progress,
        updated_at: new Date().toISOString(),
      })
      .select();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving user progress:', error);
    return { data: null, error };
  }
};

// ユーザーの進捗状況を取得
export const getUserProgress = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('progress_data')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // レコードが見つからない場合は空のオブジェクトを返す
        return { data: {}, error: null };
      }
      throw error;
    }
    
    return { data: data.progress_data, error: null };
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return { data: {}, error };
  }
};
