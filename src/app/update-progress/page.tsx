"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Topbar from '@/components/Topbar';
import { FaSave } from 'react-icons/fa';

const UpdateProgress = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [plan, setPlan] = useState(null);
  const [status, setStatus] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchPlan = async () => {
      // 本来はURLパラメータなどからplan_idを取得する
      const plan_id = 'sample-plan-id';
      const { data, error } = await supabase
        .from('improvement_plans')
        .select('*')
        .eq('id', plan_id)
        .single();

      if (error) {
        console.error('Error fetching plan:', error);
      } else {
        setPlan(data);
        setStatus(data.status);
      }
    };

    fetchPlan();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!plan) return;

    const { error } = await supabase
      .from('improvement_plans')
      .update({
        status: status,
        description: plan.description + '

' + new Date().toISOString() + ': ' + comment,
        updated_at: new Date().toISOString()
      })
      .eq('id', plan.id);

    if (error) {
      console.error('Error updating plan:', error);
    } else {
      alert('進捗状況が更新されました');
      router.push('/improvement-plan-list');
    }
  };

  if (!plan) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">進捗更新</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">{plan.description}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">進捗状況</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="not_started">未着手</option>
                <option value="in_progress">進行中</option>
                <option value="completed">完了</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">コメント</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows="4"
              ></textarea>
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaSave className="mr-2" />
              更新
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProgress;