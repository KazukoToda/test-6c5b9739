"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FaChartBar, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CompareResults = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [selectedResults, setSelectedResults] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);

  useEffect(() => {
    fetchDiagnosticResults();
  }, []);

  const fetchDiagnosticResults = async () => {
    const { data, error } = await supabase
      .from('diagnostic_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('診断結果の取得に失敗しました:', error);
      return;
    }

    setSelectedResults(data);
    if (data.length >= 2) {
      compareResults(data[0], data[1]);
    }
  };

  const compareResults = (result1, result2) => {
    const categories = ['戦略', '組織', 'プロセス', 'テクノロジー', '人材'];
    const data = {
      labels: categories,
      datasets: [
        {
          label: '最新の診断結果',
          data: categories.map(() => Math.floor(Math.random() * 100)),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
        {
          label: '前回の診断結果',
          data: categories.map(() => Math.floor(Math.random() * 100)),
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1,
        },
      ],
    };

    setComparisonData(data);
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">診断結果比較</h1>
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">比較対象の診断結果</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedResults.slice(0, 2).map((result, index) => (
              <div key={index} className="border p-4 rounded-md">
                <h3 className="font-medium text-lg mb-2">診断 {index + 1}</h3>
                <p>日時: {new Date(result.created_at).toLocaleString()}</p>
                <p>総合スコア: {result.score.overall}</p>
              </div>
            ))}
          </div>
        </div>

        {comparisonData && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">スコア比較グラフ</h2>
            <div className="w-full h-64">
              <Line data={comparisonData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">改善度分析</h2>
          <div className="space-y-4">
            {['戦略', '組織', 'プロセス', 'テクノロジー', '人材'].map((category) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-lg">{category}</span>
                <div className="flex items-center">
                  {Math.random() > 0.5 ? (
                    <FaArrowUp className="text-green-500 mr-2" />
                  ) : (
                    <FaArrowDown className="text-red-500 mr-2" />
                  )}
                  <span>{Math.floor(Math.random() * 20)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareResults;