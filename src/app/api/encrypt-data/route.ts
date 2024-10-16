import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { data } = req.body;

  try {
    // 暗号化キーの生成（実際の運用では安全に管理されたキーを使用してください）
    const encryptionKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    // データの暗号化
    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
    let encryptedData = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encryptedData += cipher.final('hex');

    // 暗号化されたデータをデータベースに保存
    const { data: savedData, error } = await supabase
      .from('encrypted_data')
      .insert({
        data: encryptedData,
        iv: iv.toString('hex')
      });

    if (error) throw error;

    res.status(200).json({ message: 'データが正常に暗号化され保存されました', id: savedData[0].id });
  } catch (error) {
    console.error('データの暗号化と保存中にエラーが発生しました:', error);
    res.status(500).json({ error: 'データの暗号化と保存中にエラーが発生しました' });
  }
}