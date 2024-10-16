"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/supabase';
import Topbar from '@/components/Topbar';
import { FaEnvelope, FaLock, FaBuilding, FaBriefcase, FaUserTie } from 'react-icons/fa';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [department, setDepartment] = useState('');
    const [position, setPosition] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const supabase = createClient();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                await supabase.from('users').insert({
                    id: data.user.id,
                    email,
                    company_name: companyName,
                    department,
                    position,
                });
                router.push('/login');
            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen h-full bg-gray-100">
            <Topbar />
            <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            新規アカウント登録
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    メールアドレス
                                </label>
                                <div className="flex items-center">
                                    <FaEnvelope className="text-gray-400 mr-2" />
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="メールアドレス"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    パスワード
                                </label>
                                <div className="flex items-center">
                                    <FaLock className="text-gray-400 mr-2" />
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="パスワード"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="company-name" className="sr-only">
                                    企業名
                                </label>
                                <div className="flex items-center">
                                    <FaBuilding className="text-gray-400 mr-2" />
                                    <input
                                        id="company-name"
                                        name="company-name"
                                        type="text"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="企業名"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="department" className="sr-only">
                                    部署名
                                </label>
                                <div className="flex items-center">
                                    <FaBriefcase className="text-gray-400 mr-2" />
                                    <input
                                        id="department"
                                        name="department"
                                        type="text"
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="部署名"
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="position" className="sr-only">
                                    役職
                                </label>
                                <div className="flex items-center">
                                    <FaUserTie className="text-gray-400 mr-2" />
                                    <input
                                        id="position"
                                        name="position"
                                        type="text"
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="役職"
                                        value={position}
                                        onChange={(e) => setPosition(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm mt-2">{error}</div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                登録
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;