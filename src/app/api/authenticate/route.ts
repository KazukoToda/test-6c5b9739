import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import { getLlmModelAndGenerateContent } from '@/utils/functions';
import { supabase } from '@/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'メソッドが許可されていません' });
  }

  const { email, password } = req.body;

  try {
    // Supabaseの認証機能を使用してユーザーを認証
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      return res.status(401).json({ error: '認証に失敗しました' });
    }

    // ユーザー情報を取得
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) {
      throw userError;
    }

    // JWTトークンを生成（Supabaseが自動的に生成）
    const token = data.session?.access_token;

    // 認証結果とユーザー情報を返す
    res.status(200).json({
      user: userData,
      token,
    });
  } catch (error) {
    console.error('認証エラー:', error);
    res.status(500).json({ error: '認証中にエラーが発生しました' });
  }
}