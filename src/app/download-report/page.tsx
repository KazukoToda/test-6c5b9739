"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';
import { createClient } from '@/supabase';
import { FaDownload } from 'react-icons/fa';

const DownloadReport = () => {
    const [report, setReport] = useState(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchReport = async () => {
            const { data, error } = await supabase
                .from('reports')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error) {
                console.error('レポートの取得に失敗しました:', error);
                setReport({
                    id: 'sample-id',
                    content: {
                        summary: 'サンプルレポート概要',
                        detailed_analysis: ['分析項目1', '分析項目2'],
                        recommendations: ['推奨事項1', '推奨事項2']
                    },
                    created_at: new Date().toISOString()
                });
            } else {
                setReport(data);
            }
        };

        fetchReport();
    }, []);

    const handleDownload = () => {
        // ここでPDFダウンロードのロジックを実装
        alert('PDFのダウンロードを開始します');
    };

    if (!report) {
        return <div>読み込み中...</div>;
    }

    return (
        <div className="min-h-screen h-full bg-gray-100">
            <Topbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">レポートダウンロード</h1>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">レポート概要</h2>
                    <p className="text-gray-600 mb-4">{report.content.summary}</p>
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2 text-gray-700">詳細分析</h3>
                        <ul className="list-disc pl-5">
                            {report.content.detailed_analysis.map((item, index) => (
                                <li key={index} className="text-gray-600">{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2 text-gray-700">推奨事項</h3>
                        <ul className="list-disc pl-5">
                            {report.content.recommendations.map((item, index) => (
                                <li key={index} className="text-gray-600">{item}</li>
                            ))}
                        </ul>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">作成日時: {new Date(report.created_at).toLocaleString('ja-JP')}</p>
                    <button
                        onClick={handleDownload}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                    >
                        <FaDownload className="mr-2" />
                        PDFをダウンロード
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DownloadReport;