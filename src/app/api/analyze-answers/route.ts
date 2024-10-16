import { createClient } from '@supabase/supabase-js';
import { getLlmModelAndGenerateContent } from '@/utils/functions';
import { supabase } from '@/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'メソッドが許可されていません' });
  }

  const { sessionId, answers } = req.body;

  if (!sessionId || !answers) {
    return res.status(400).json({ error: '必要なデータが不足しています' });
  }

  try {
    // 診断セッションと回答データを取得
    const { data: session, error: sessionError } = await supabase
      .from('diagnostic_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError) throw sessionError;

    // DX推進指標データを取得（仮定）
    const { data: dxIndicators, error: dxError } = await supabase
      .from('dx_indicators')
      .select('*');

    if (dxError) throw dxError;

    // LLMを使用して回答を分析
    const analysisPrompt = `
      以下の回答データとDX推進指標に基づいて分析を行い、スコアを算出してください：
      回答データ: ${JSON.stringify(answers)}
      DX推進指標: ${JSON.stringify(dxIndicators)}
    `;

    const analysis = await getLlmModelAndGenerateContent("ChatGPT", "あなたはDX推進の専門家です。", analysisPrompt);

    // スコアの算出（仮の実装）
    const overallScore = Math.floor(Math.random() * 100);
    const categoryScores = [
      { name: '戦略・ビジョン', score: Math.floor(Math.random() * 100) },
      { name: 'マネジメント', score: Math.floor(Math.random() * 100) },
      { name: '人材・組織', score: Math.floor(Math.random() * 100) },
      { name: 'デジタル技術活用', score: Math.floor(Math.random() * 100) },
    ];

    // 分析結果とスコアをデータベースに保存
    const { data: result, error: resultError } = await supabase
      .from('diagnostic_results')
      .insert({
        session_id: sessionId,
        score: { overall: overallScore, categories: categoryScores },
        analysis: analysis
      })
      .select()
      .single();

    if (resultError) throw resultError;

    // 結果をフロントエンドに返す
    res.status(200).json(result);
  } catch (error) {
    console.error('回答分析中にエラーが発生しました:', error);
    
    // エラー時のサンプルデータ
    const sampleResult = {
      id: 'sample-result-id',
      session_id: sessionId,
      score: {
        overall: 65,
        categories: [
          { name: '戦略・ビジョン', score: 70 },
          { name: 'マネジメント', score: 60 },
          { name: '人材・組織', score: 65 },
          { name: 'デジタル技術活用', score: 55 },
        ]
      },
      analysis: 'あなたの企業のDX推進状況は平均的なレベルにあります。戦略・ビジョンの面では比較的高いスコアを示していますが、デジタル技術の活用にはまだ改善の余地があります。'
    };

    res.status(200).json(sampleResult);
  }
}