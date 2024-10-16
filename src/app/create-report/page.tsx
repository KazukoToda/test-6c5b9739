"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase';
import Topbar from '@/components/Topbar';
import { FaDownload, FaEdit } from 'react-icons/fa';
import axios from 'axios';

const CreateReport = () => {
    const router = useRouter();
    const [reportContent, setReportContent] = useState({
        summary: '',
        detailedAnalysis: [],
        recommendations: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchReportData();
    }, []);

    const fetchReportData = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('reports')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error) throw error;

            if (data) {
                setReportContent(data.content);
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
            // サンプルデータを表示
            setReportContent({
                summary: 'DX推進状況の概要',
                detailedAnalysis: ['技術導入の遅れ', '組織文化の課題', 'デジタルスキルの不足'],
                recommendations: ['クラウド技術の導入', '社内研修プログラムの実施', 'アジャイル開発手法の採用']
            });
        } finally {
            setIsLoading(false);
        }
    };

    const generateReport = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('/api/generate-report', { reportContent });
            if (response.data.success) {
                router.push('/report-download');
            } else {
                throw new Error('レポート生成に失敗しました');
            }
        } catch (error) {
            console.error('Error generating report:', error);
            alert('レポート生成中にエラーが発生しました。もう一度お試しください。');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen h-full bg-gray-100">
            <Topbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">診断レポート作成</h1>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">レポート内容プレビュー</h2>
                        <div className="mb-6">
                            <h3 className="text-xl font-medium mb-2">概要</h3>
                            <p className="text-gray-700">{reportContent.summary}</p>
                        </div>
                        <div className="mb-6">
                            <h3 className="text-xl font-medium mb-2">詳細分析</h3>
                            <ul className="list-disc list-inside text-gray-700">
                                {reportContent.detailedAnalysis.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="mb-6">
                            <h3 className="text-xl font-medium mb-2">推奨事項</h3>
                            <ul className="list-disc list-inside text-gray-700">
                                {reportContent.recommendations.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex justify-between items-center mt-8">
                            <button
                                onClick={() => router.push('/edit-report')}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
                            >
                                <FaEdit className="mr-2" />
                                編集する
                            </button>
                            <button
                                onClick={generateReport}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
                            >
                                <FaDownload className="mr-2" />
                                レポート生成
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateReport;