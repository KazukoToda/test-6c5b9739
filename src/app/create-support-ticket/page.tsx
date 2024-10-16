"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';
import { createClient } from '@/supabase';
import { FiSend } from 'react-icons/fi';

const CreateSupportTicket = () => {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('ログインしてください');
      return;
    }

    const { data, error } = await supabase
      .from('support_tickets')
      .insert({
        user_id: user.id,
        subject,
        description,
        status: 'open'
      });

    if (error) {
      alert('エラーが発生しました: ' + error.message);
    } else {
      alert('サポートチケットが発行されました');
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">サポートチケット発行</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              問題カテゴリ
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">選択してください</option>
              <option value="technical">技術的な問題</option>
              <option value="account">アカウント関連</option>
              <option value="billing">請求関連</option>
              <option value="other">その他</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
              件名
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              詳細説明
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
            >
              <FiSend className="mr-2" />
              提出する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSupportTicket;