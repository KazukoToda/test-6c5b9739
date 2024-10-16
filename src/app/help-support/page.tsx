"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Topbar from '@/components/Topbar';
import { FaQuestionCircle, FaRobot, FaTicketAlt } from 'react-icons/fa';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const HelpSupport = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');

  const faqItems = [
    { question: 'DX推進指標とは何ですか？', answer: 'DX推進指標は、企業のデジタルトランスフォーメーション（DX）の進捗状況を評価するための指標です。' },
    { question: '診断結果はどのように解釈すればいいですか？', answer: '診断結果は、各カテゴリーのスコアと全体的な評価を提供します。改善が必要な領域に焦点を当てて解釈してください。' },
    { question: '改善計画はどのように立てればいいですか？', answer: '診断結果と提案された改善案を基に、優先順位を決め、具体的な目標と期限を設定してください。' },
  ];

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('ユーザーが見つかりません');

      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          subject: ticketSubject,
          description: ticketDescription,
          status: 'open'
        });

      if (error) throw error;

      alert('サポートチケットが発行されました');
      setTicketSubject('');
      setTicketDescription('');
    } catch (error) {
      console.error('チケット発行エラー:', error);
      alert('チケットの発行に失敗しました。もう一度お試しください。');
    }
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">ヘルプ＆サポート</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaQuestionCircle className="mr-2 text-blue-500" />
              よくある質問（FAQ）
            </h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b pb-4">
                  <h3 className="font-medium text-lg mb-2">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaRobot className="mr-2 text-green-500" />
                チャットボットサポート
              </h2>
              <p className="mb-4">24時間対応のチャットボットが、よくある質問にお答えします。</p>
              <Link href="/chatbot" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">
                チャットボットを利用する
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaTicketAlt className="mr-2 text-red-500" />
                サポートチケット発行
              </h2>
              <form onSubmit={handleSubmitTicket}>
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">件名</label>
                  <input
                    type="text"
                    id="subject"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">詳細内容</label>
                  <textarea
                    id="description"
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300">
                  チケットを発行する
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;