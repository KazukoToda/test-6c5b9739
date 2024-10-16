"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Topbar from '@/components/Topbar';
import { FaArrowRight } from 'react-icons/fa';

const NewDiagnostic = () => {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartDiagnostic = () => {
    setIsStarting(true);
    // ここで診断セッションを開始するロジックを実装
    // 例: Supabaseを使用して新しい診断セッションを作成
    // その後、AI質問応答画面に遷移
    setTimeout(() => {
      router.push('/ai-question-response');
    }, 1000);
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">新規診断開始</h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">診断概要</h2>
          <p className="text-gray-600 mb-6">
            このDX推進指標自己診断は、あなたの企業のデジタルトランスフォーメーション（DX）の進捗状況を評価し、
            改善のための具体的な提案を提供します。AIを活用した対話型の診断プロセスにより、
            より深い洞察と正確な評価を得ることができます。
          </p>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">診断の流れ</h3>
          <ol className="list-decimal list-inside text-gray-600 mb-6">
            <li>AIが質問を生成し、あなたの回答を分析します</li>
            <li>企業のDX推進状況を多角的に評価します</li>
            <li>診断結果と改善提案を自動生成します</li>
            <li>カスタマイズ可能な診断レポートを作成します</li>
          </ol>
          <div className="flex justify-center">
            <button
              onClick={handleStartDiagnostic}
              disabled={isStarting}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out flex items-center ${
                isStarting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isStarting ? '診断を開始中...' : '診断を開始する'}
              {!isStarting && <FaArrowRight className="ml-2" />}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewDiagnostic;