"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FaChartLine, FaLightbulb, FaFileAlt } from 'react-icons/fa';

const DiagnosticResult = () => {
    const router = useRouter();
    const supabase = createClientComponentClient();
    const [diagnosticResult, setDiagnosticResult] = useState(null);

    useEffect(() => {
        const fetchDiagnosticResult = async () => {
            try {
                const { data, error } = await supabase
                    .from('diagnostic_results')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (error) throw error;
                setDiagnosticResult(data);
            } catch (error) {
                console.error('診断結果の取得に失敗しました:', error.message);
                // サンプルデータを設定
                setDiagnosticResult({
                    score: { overall: 65, categories: [
                        { name: '戦略・ビジョン', score: 70 },
                        { name: 'マネジメント', score: 60 },
                        { name: '人材・組織', score: 65 },
                        { name: 'デジタル技術活用', score: 55 },
                    ]},
                    analysis: 'あなたの企業のDX推進状況は平均的なレベルにあります。戦略・ビジョンの面では比較的高いスコアを示していますが、デジタル技術の活用にはまだ改善の余地があります。'
                });
            }
        };

        fetchDiagnosticResult();
    }, []);

    if (!diagnosticResult) {
        return <div>読み込み中...</div>;
    }

    return (
        <div className="min-h-screen h-full bg-gray-100">
            <Topbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">診断結果</h1>
                <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center">
                        <FaChartLine className="mr-2 text-blue-500" />
                        総合スコア
                    </h2>
                    <div className="text-5xl font-bold text-center text-blue-600 mb-4">
                        {diagnosticResult.score.overall}
                    </div>
                    <p className="text-gray-600 text-center">100点満点中</p>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center">
                        <FaChartLine className="mr-2 text-green-500" />
                        カテゴリ別スコア
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {diagnosticResult.score.categories.map((category, index) => (
                            <div key={index} className="bg-gray-100 rounded-lg p-4">
                                <h3 className="font-semibold mb-2">{category.name}</h3>
                                <div className="relative pt-1">
                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                                        <div style={{ width: `${category.score}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                                    </div>
                                    <div className="text-right">{category.score}/100</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center">
                        <FaLightbulb className="mr-2 text-yellow-500" />
                        分析コメント
                    </h2>
                    <p className="text-gray-700 leading-relaxed">{diagnosticResult.analysis}</p>
                </div>

                <div className="text-center">
                    <button
                        onClick={() => router.push('/improvement-proposal')}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full inline-flex items-center"
                    >
                        <FaFileAlt className="mr-2" />
                        改善提案を見る
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DiagnosticResult;