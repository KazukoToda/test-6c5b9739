import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { getLlmModelAndGenerateContent } from '@/utils/functions';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'メソッドが許可されていません' });
  }

  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: '質問が提供されていません' });
  }

  try {
    // まず、データベースから既存の回答を検索
    const { data, error } = await supabase
      .from('faq_chatbot')
      .select('response')
      .eq('query', question)
      .single();

    if (data) {
      // 既存の回答が見つかった場合、それを返す
      return res.status(200).json({ response: data.response });
    }

    // 既存の回答が見つからない場合、AIを使用して回答を生成
    const systemPrompt = "あなたはDX推進指標自己診断サポートサービスのFAQチャットボットです。ユーザーの質問に簡潔かつ正確に答えてください。";
    const userPrompt = question;

    const aiResponse = await getLlmModelAndGenerateContent("Gemini", systemPrompt, userPrompt);

    // 生成された回答をデータベースに保存
    const { error: insertError } = await supabase
      .from('faq_chatbot')
      .insert({ query: question, response: aiResponse });

    if (insertError) {
      console.error('回答の保存中にエラーが発生しました:', insertError);
    }

    return res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('エラーが発生しました:', error);

    // エラーが発生した場合、サンプルデータを返す
    const sampleResponse = '申し訳ありませんが、現在システムに問題が発生しています。後ほど再度お試しください。';
    return res.status(200).json({ response: sampleResponse });
  }
}