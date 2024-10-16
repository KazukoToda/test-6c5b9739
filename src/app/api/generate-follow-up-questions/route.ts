import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/supabase';
import axios from 'axios';
import { getLlmModelAndGenerateContent } from '@/utils/functions';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { sessionId, answer } = req.body;

  if (!sessionId || !answer) {
    return res.status(400).json({ error: '必要なパラメータが不足しています' });
  }

  try {
    // セッション情報の取得
    const { data: session, error: sessionError } = await supabase
      .from('diagnostic_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError) throw sessionError;

    // 直前の質問の取得
    const { data: lastQuestion, error: questionError } = await supabase
      .from('questions')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (questionError) throw questionError;

    // 回答の保存
    const { error: answerError } = await supabase
      .from('answers')
      .insert({
        question_id: lastQuestion.id,
        content: answer,
      });

    if (answerError) throw answerError;

    // AIによる追加質問の生成
    const systemPrompt = "あなたはDX推進指標の自己診断を行うAIアシスタントです。ユーザーの回答に基づいて、より深い理解を得るための追加質問を生成してください。";
    const userPrompt = `前回の質問: ${lastQuestion.content}
ユーザーの回答: ${answer}

追加の質問を生成してください。`;

    let aiResponse;
    try {
      aiResponse = await getLlmModelAndGenerateContent("Gemini", systemPrompt, userPrompt);
    } catch (error) {
      console.error('AI API request failed:', error);
      aiResponse = "貴社のDXへの取り組みについて、具体的な事例を挙げていただけますか？";
    }

    // 新しい質問の保存
    const { data: newQuestion, error: newQuestionError } = await supabase
      .from('questions')
      .insert({
        session_id: sessionId,
        content: aiResponse,
        order: lastQuestion.order + 1,
      })
      .select()
      .single();

    if (newQuestionError) throw newQuestionError;

    // セッションの完了チェック（例：10問で完了とする）
    const isComplete = newQuestion.order >= 10;

    if (isComplete) {
      await supabase
        .from('diagnostic_sessions')
        .update({ status: 'completed', end_time: new Date() })
        .eq('id', sessionId);
    }

    res.status(200).json({
      question: aiResponse,
      isComplete: isComplete,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
}