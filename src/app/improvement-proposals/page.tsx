"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaChartLine, FaClipboardList, FaFileAlt, FaPencilAlt } from 'react-icons/fa';
import Topbar from '@/components/Topbar';
import { createClient } from '@/supabase';

const ImprovementProposals = () => {
  const router = useRouter();
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    const { data, error } = await supabase
      .from('improvement_proposals')
      .select('*')
      .order('priority', { ascending: true });

    if (error) {
      console.error('Error fetching proposals:', error);
      // ダミーデータを表示
      setProposals([
        { id: 1, content: 'DX推進体制の強化', priority: 1 },
        { id: 2, content: 'デジタルスキル教育プログラムの導入', priority: 2 },
        { id: 3, content: 'レガシーシステムの刷新', priority: 3 },
      ]);
    } else {
      setProposals(data);
    }
  };

  const handleProposalClick = (proposal) => {
    setSelectedProposal(proposal);
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">改善提案</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">優先順位付き改善提案リスト</h2>
            <ul className="bg-white rounded-lg shadow-md">
              {proposals.map((proposal) => (
                <li
                  key={proposal.id}
                  className="p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  onClick={() => handleProposalClick(proposal)}
                >
                  <div className="flex items-center">
                    <span className="text-lg font-medium text-gray-800 mr-4">
                      {proposal.priority}.
                    </span>
                    <span className="text-gray-700">{proposal.content}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-1">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">提案詳細</h2>
            {selectedProposal ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {selectedProposal.content}
                </h3>
                <p className="text-gray-600 mb-4">
                  優先順位: {selectedProposal.priority}
                </p>
                <p className="text-gray-700">
                  この改善提案に基づいて具体的なアクションプランを立てることをお勧めします。
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-gray-500">
                提案を選択すると詳細が表示されます。
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 flex justify-center space-x-4">
          <Link href="/create-report"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
          >
            <FaFileAlt className="mr-2" />
            レポート作成
          </Link>
          <Link href="/create-improvement-plan"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
          >
            <FaPencilAlt className="mr-2" />
            改善計画作成
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ImprovementProposals;