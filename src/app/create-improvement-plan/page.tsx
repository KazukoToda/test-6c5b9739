"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/supabase';
import Topbar from '@/components/Topbar';
import { FiSave, FiCalendar } from 'react-icons/fi';

const CreateImprovementPlan = () => {
  const router = useRouter();
  const supabase = createClient();

  const [selectedProposal, setSelectedProposal] = useState(null);
  const [planDescription, setPlanDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    const { data, error } = await supabase
      .from('improvement_proposals')
      .select('*')
      .order('priority', { ascending: true });

    if (error) {
      console.error('提案の取得に失敗しました:', error);
    } else {
      setProposals(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProposal) {
      alert('改善提案を選択してください。');
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      alert('ユーザー情報の取得に失敗しました。');
      return;
    }

    const { data, error } = await supabase
      .from('improvement_plans')
      .insert({
        user_id: userData.user.id,
        proposal_id: selectedProposal.id,
        description: planDescription,
        target_date: targetDate,
        status: 'not_started'
      });

    if (error) {
      alert('改善計画の保存に失敗しました。');
    } else {
      alert('改善計画が正常に保存されました。');
      router.push('/improvement-plan-list');
    }
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">改善計画作成</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="proposal">
              改善提案を選択
            </label>
            <select
              id="proposal"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedProposal ? selectedProposal.id : ''}
              onChange={(e) => setSelectedProposal(proposals.find(p => p.id === e.target.value))}
            >
              <option value="">選択してください</option>
              {proposals.map((proposal) => (
                <option key={proposal.id} value={proposal.id}>
                  {proposal.content}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              計画詳細
            </label>
            <textarea
              id="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="4"
              value={planDescription}
              onChange={(e) => setPlanDescription(e.target.value)}
              placeholder="具体的な改善計画を入力してください"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="targetDate">
              目標日程
            </label>
            <div className="flex items-center">
              <FiCalendar className="mr-2 text-gray-600" />
              <input
                id="targetDate"
                type="date"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
            >
              <FiSave className="mr-2" />
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateImprovementPlan;