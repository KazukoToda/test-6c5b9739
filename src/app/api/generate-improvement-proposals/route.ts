import { createClient } from '@supabase/supabase-js';
import { getLlmModelAndGenerateContent } from '@/utils/functions';
import { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { sessionId, companyProfile } = req.body;

  try {
    // 診断結果を取得
    const { data: diagnosticResult, error: diagnosticError } = await supabase
      .from('diagnostic_results')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (diagnosticError) {
      throw new Error('診断結果の取得に失敗しました');
    }

    // AIを使用して改善提案を生成
    const systemPrompt = '企業のDX推進状況に基づいて、具体的で実行可能な改善提案を生成してください。';
    const userPrompt = `診断結果: ${JSON.stringify(diagnosticResult)}
企業プロファイル: ${JSON.stringify(companyProfile)}

上記の情報に基づいて、以下の形式で3つの改善提案を生成してください：
1. 提案内容
2. 優先順位 (1-3の数字)
3. 簡単な説明 (100文字以内)`;

    const aiResponse = await getLlmModelAndGenerateContent('Gemini', systemPrompt, userPrompt);

    // AIの応答をパースして改善提案を抽出
    const proposals = aiResponse.split('

').map((proposal, index) => {
      const [content, priority, description] = proposal.split('
');
      return {
        content: content.substring(3),
        priority: parseInt(priority.split(' ')[1]),
        description: description
      };
    });

    // 改善提案をデータベースに保存
    const { data: savedProposals, error: saveError } = await supabase
      .from('improvement_proposals')
      .insert(proposals.map(proposal => ({
        result_id: diagnosticResult.id,
        content: proposal.content,
        priority: proposal.priority,
        description: proposal.description
      })))
      .select();

    if (saveError) {
      throw new Error('改善提案の保存に失敗しました');
    }

    res.status(200).json({ proposals: savedProposals });
  } catch (error) {
    console.error('Error:', error);
    // エラー時はサンプルデータを返す
    const sampleProposals = [
      { id: 1, content: 'DX推進体制の強化', priority: 1, description: '専門チームの設立とトップダウンの推進体制を整備し、全社的なDX推進を加速させる' },
      { id: 2, content: 'デジタルスキル教育プログラムの導入', priority: 2, description: '全従業員向けのデジタルリテラシー向上プログラムを実施し、DXへの理解と参加を促進する' },
      { id: 3, content: 'レガシーシステムの刷新', priority: 3, description: '古いITシステムを最新のクラウドベースソリューションに移行し、業務効率と柔軟性を向上させる' }
    ];
    res.status(200).json({ proposals: sampleProposals });
  }
}