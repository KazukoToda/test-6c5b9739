import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getLlmModelAndGenerateContent } from '@/utils/functions';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { selectedItems, dateRange, reportFormat } = req.body;

    // データの取得
    const { data: diagnosticResults, error: fetchError } = await supabase
      .from('diagnostic_results')
      .select('*')
      .gte('created_at', dateRange.start)
      .lte('created_at', dateRange.end);

    if (fetchError) {
      throw new Error('診断結果の取得に失敗しました');
    }

    // AIを使用してレポートを生成
    const systemPrompt = "あなたはDX推進指標自己診断サポートサービスのレポート作成AIです。";
    const userPrompt = `以下の診断結果データを基に、選択された項目（${selectedItems.join(', ')}）についてのカスタムレポートを作成してください。

${JSON.stringify(diagnosticResults)}`;

    const reportContent = await getLlmModelAndGenerateContent("Gemini", systemPrompt, userPrompt);

    // PDFレポートの生成（実際のPDF生成ロジックは省略）
    const pdfReport = `カスタムレポート内容:

${reportContent}`;

    // レポートの保存
    const { data: savedReport, error: saveError } = await supabase
      .from('reports')
      .insert({ content: pdfReport, format: reportFormat })
      .select()
      .single();

    if (saveError) {
      throw new Error('レポートの保存に失敗しました');
    }

    res.status(200).json({ success: true, reportId: savedReport.id });
  } catch (error) {
    console.error('カスタムレポート生成エラー:', error);
    res.status(500).json({ 
      success: false, 
      error: '予期せぬエラーが発生しました',
      sampleData: {
        reportId: 'sample-123',
        content: 'これはサンプルのカスタムレポート内容です。実際のデータの代わりに使用されています。'
      }
    });
  }
}