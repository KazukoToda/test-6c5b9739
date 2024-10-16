import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/supabase';
import { getLlmModelAndGenerateContent } from '@/utils/functions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // セッションIDを生成
    const { data: session, error: sessionError } = await supabase
      .from('diagnostic_sessions')
      .insert({ user_id: req.body.userId, status: 'in_progress' })
      .select()
      .single();

    if (sessionError) throw sessionError;

    // DX推進指標データを取得（サンプルデータ）
    const dxIndicators = [
      { category: '戦略・ビジョン', items: ['デジタル戦略の策定', 'デジタルビジョンの共有'] },
      { category: '組織・体制', items: ['デジタル人材の確保', 'デジタル組織の構築'] },
      { category: 'プロセス・業務改革', items: ['業務プロセスのデジタル化', 'データ駆動型意思決定'] },
      { category: 'デジタル技術活用', items: ['クラウド活用', 'AI・IoTの導入'] },
      { category: '顧客体験', items: ['デジタルチャネルの整備', 'パーソナライゼーション'] }
    ];

    // LLMを使用して質問を生成
    const systemPrompt = 'あなたはDX推進指標に基づいて企業のデジタル化状況を診断する専門家です。';
    const userPrompt = `以下のDX推進指標に基づいて、企業のデジタル化状況を診断するための質問を5つ生成してください。質問は具体的で、回答しやすいものにしてください。

DX推進指標:
${JSON.stringify(dxIndicators, null, 2)}`;

    const generatedQuestions = await getLlmModelAndGenerateContent('Gemini', systemPrompt, userPrompt);

    // 生成された質問をパースしてデータベースに保存
    const questions = JSON.parse(generatedQuestions).map((q: string, index: number) => ({
      session_id: session.id,
      content: q,
      order: index + 1
    }));

    const { error: questionsError } = await supabase
      .from('questions')
      .insert(questions);

    if (questionsError) throw questionsError;

    // フロントエンドに最初の質問を返す
    res.status(200).json({
      sessionId: session.id,
      question: questions[0].content
    });
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({
      error: 'Failed to generate questions',
      sessionId: 'sample-session-id',
      question: 'あなたの会社のデジタル戦略について説明してください。'
    });
  }
}