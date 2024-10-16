"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Topbar from '@/components/Topbar';
import { FaChartLine, FaHistory, FaTasks, FaCog, FaQuestionCircle } from 'react-icons/fa';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
    };
    fetchUser();
  }, []);

  const cards = [
    { title: '新規診断開始', icon: FaChartLine, link: '/new-diagnosis' },
    { title: '過去の診断結果', icon: FaHistory, link: '/diagnosis-history' },
    { title: '改善計画一覧', icon: FaTasks, link: '/improvement-plans' },
    { title: 'アカウント設定', icon: FaCog, link: '/account-settings' },
    { title: 'ヘルプサポート', icon: FaQuestionCircle, link: '/help-support' },
  ];

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">ダッシュボード</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <Link href={card.link} key={index}>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
                <card.icon className="text-4xl text-blue-500 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">{card.title}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;