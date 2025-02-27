-- ユーザープロファイルテーブル
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) の設定
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- ユーザー自身のプロファイルのみ読み取り可能
CREATE POLICY "ユーザー自身のプロファイルのみ読み取り可能" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- ユーザー自身のプロファイルのみ更新可能
CREATE POLICY "ユーザー自身のプロファイルのみ更新可能" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- ユーザー自身のプロファイルのみ挿入可能
CREATE POLICY "ユーザー自身のプロファイルのみ挿入可能" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ユーザー自身のプロファイルのみ削除可能
CREATE POLICY "ユーザー自身のプロファイルのみ削除可能" ON user_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- ユーザー進捗テーブル
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  progress_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) の設定
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- ユーザー自身の進捗のみ読み取り可能
CREATE POLICY "ユーザー自身の進捗のみ読み取り可能" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

-- ユーザー自身の進捗のみ更新可能
CREATE POLICY "ユーザー自身の進捗のみ更新可能" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- ユーザー自身の進捗のみ挿入可能
CREATE POLICY "ユーザー自身の進捗のみ挿入可能" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ユーザー自身の進捗のみ削除可能
CREATE POLICY "ユーザー自身の進捗のみ削除可能" ON user_progress
  FOR DELETE USING (auth.uid() = user_id);

-- インデックスの作成
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
