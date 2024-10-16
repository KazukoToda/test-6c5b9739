"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiLock, FiBell, FiSave } from 'react-icons/fi';
import Topbar from '@/components/Topbar';
import { createClient } from '@/supabase';

const AccountSettings = () => {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState({
    email: '',
    companyName: '',
    department: '',
    position: '',
  });
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('email, company_name, department, position')
          .eq('id', user.id)
          .single();

        if (data) {
          setUser({
            email: data.email,
            companyName: data.company_name,
            department: data.department,
            position: data.position,
          });
        }
      }
    };

    fetchUserData();
  }, []);

  const handleUserChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (e) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked });
  };

  const handleSave = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { error } = await supabase
        .from('users')
        .update({
          company_name: user.companyName,
          department: user.department,
          position: user.position,
        })
        .eq('id', authUser.id);

      if (error) {
        console.error('Error updating user data:', error);
      } else {
        alert('設定を保存しました');
      }
    }
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">アカウント設定</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">個人情報</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">メールアドレス</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleUserChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">会社名</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={user.companyName}
                onChange={handleUserChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">部署</label>
              <input
                type="text"
                id="department"
                name="department"
                value={user.department}
                onChange={handleUserChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700">役職</label>
              <input
                type="text"
                id="position"
                name="position"
                value={user.position}
                onChange={handleUserChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">パスワード変更</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="current" className="block text-sm font-medium text-gray-700">現在のパスワード</label>
              <input
                type="password"
                id="current"
                name="current"
                value={password.current}
                onChange={handlePasswordChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="new" className="block text-sm font-medium text-gray-700">新しいパスワード</label>
              <input
                type="password"
                id="new"
                name="new"
                value={password.new}
                onChange={handlePasswordChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">新しいパスワード（確認）</label>
              <input
                type="password"
                id="confirm"
                name="confirm"
                value={password.confirm}
                onChange={handlePasswordChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">通知設定</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="email"
                name="email"
                checked={notifications.email}
                onChange={handleNotificationChange}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <label htmlFor="email" className="ml-2 block text-sm text-gray-900">
                メール通知を受け取る
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="push"
                name="push"
                checked={notifications.push}
                onChange={handleNotificationChange}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <label htmlFor="push" className="ml-2 block text-sm text-gray-900">
                プッシュ通知を受け取る
              </label>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          設定を保存
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;