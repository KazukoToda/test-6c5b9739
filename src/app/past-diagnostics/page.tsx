"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaChartBar, FaCheckSquare } from 'react-icons/fa';
import Topbar from '@/components/Topbar';
import { createClient } from '@/supabase';

const PastDiagnostics = () => {
  const [diagnosticResults, setDiagnosticResults] = useState([]);
  const [selectedResults, setSelectedResults] = useState([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchDiagnosticResults();
  }, []);

  const fetchDiagnosticResults = async () => {
    const { data, error } = await supabase
      .from('diagnostic_results')
      .select('*, diagnostic_sessions(start_time)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('診断結果の取得に失敗しました:', error);
      // サンプルデータを表示
      setDiagnosticResults([
        { id: '1', score: { overall: 75 }, created_at: '2023-06-01T10:00:00Z', diagnostic_sessions: { start_time: '2023-06-01T09:30:00Z' } },
        { id: '2', score: { overall: 82 }, created_at: '2023-05-15T14:30:00Z', diagnostic_sessions: { start_time: '2023-05-15T14:00:00Z' } },
      ]);
    } else {
      setDiagnosticResults(data);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedResults(prev => 
      prev.includes(id) ? prev.filter(resultId => resultId !== id) : [...prev, id]
    );
  };

  const handleCompareClick = () => {
    if (selectedResults.length === 2) {
      router.push(`/compare-diagnostics?id1=${selectedResults[0]}&id2=${selectedResults[1]}`);
    } else {
      alert('比較するには2つの診断結果を選択してください。');
    }
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">過去の診断結果</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          {diagnosticResults.map((result) => (
            <div key={result.id} className="border-b border-gray-200 py-4 flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  診断日時: {new Date(result.diagnostic_sessions.start_time).toLocaleString()}
                </p>
                <p className="text-gray-600">
                  総合スコア: {result.score.overall}
                </p>
              </div>
              <div className="flex items-center">
                <Link href={`/diagnostic-result?id=${result.id}`} className="mr-4">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center">
                    <FaChartBar className="mr-2" />
                    詳細表示
                  </button>
                </Link>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    checked={selectedResults.includes(result.id)}
                    onChange={() => handleCheckboxChange(result.id)}
                  />
                  <span className="ml-2 text-gray-700">比較対象</span>
                </label>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleCompareClick}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
            disabled={selectedResults.length !== 2}
          >
            <FaCheckSquare className="mr-2" />
            選択した結果を比較
          </button>
        </div>
      </div>
    </div>
  );
};

export default PastDiagnostics;