import { createClient } from '@supabase/supabase-js';
import { getLlmModelAndGenerateContent } from '@/utils/functions';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { reportContent } = req.body;

  try {
    // AIを使用してレポートの内容を生成
    const systemPrompt = "あなたはDX推進指標の診断結果に基づいてレポートを作成するAIアシスタントです。";
    const userPrompt = `以下の内容に基づいて、詳細な診断レポートを生成してください：
    概要: ${reportContent.summary}
    詳細分析: ${reportContent.detailedAnalysis.join(', ')}
    推奨事項: ${reportContent.recommendations.join(', ')}`;

    const generatedReport = await getLlmModelAndGenerateContent("Gemini", systemPrompt, userPrompt);

    // PDFの生成（実際のPDF生成ロジックはここに実装する必要があります）
    // この例では、PDFの生成をシミュレートしています
    const pdfBuffer = Buffer.from(generatedReport);

    // レポートをデータベースに保存
    const { data, error } = await supabase
      .from('reports')
      .insert({
        content: generatedReport,
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) throw error;

    // レポートIDをフロントエンドに返す
    res.status(200).json({ success: true, reportId: data[0].id });
  } catch (error) {
    console.error('レポート生成エラー:', error);
    res.status(500).json({ success: false, error: 'レポート生成中にエラーが発生しました' });
  }
}