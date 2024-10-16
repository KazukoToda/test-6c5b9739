"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiEdit, FiCheckCircle, FiClock } from 'react-icons/fi';
import Topbar from '@/components/Topbar';
import { createClient } from '@/supabase';

const ImprovementPlans = () => {
    const [plans, setPlans] = useState([]);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        fetchImprovementPlans();
    }, []);

    const fetchImprovementPlans = async () => {
        const { data, error } = await supabase
            .from('improvement_plans')
            .select('*, improvement_proposals(content)')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('改善計画の取得に失敗しました:', error);
            return;
        }

        setPlans(data);
    };

    const updatePlanStatus = async (id, newStatus) => {
        const { error } = await supabase
            .from('improvement_plans')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            console.error('ステータス更新に失敗しました:', error);
            return;
        }

        fetchImprovementPlans();
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'not_started':
                return <FiClock className="text-gray-500" />;
            case 'in_progress':
                return <FiEdit className="text-blue-500" />;
            case 'completed':
                return <FiCheckCircle className="text-green-500" />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen h-full bg-gray-100">
            <Topbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">改善計画一覧</h1>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <div key={plan.id} className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">{plan.description}</h2>
                            <p className="text-sm text-gray-600 mb-4">{plan.improvement_proposals.content}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    {getStatusIcon(plan.status)}
                                    <span className="ml-2 text-sm font-medium text-gray-700">
                                        {plan.status === 'not_started' ? '未着手' : plan.status === 'in_progress' ? '進行中' : '完了'}
                                    </span>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => updatePlanStatus(plan.id, 'in_progress')}
                                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    >
                                        進行中
                                    </button>
                                    <button
                                        onClick={() => updatePlanStatus(plan.id, 'completed')}
                                        className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                    >
                                        完了
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImprovementPlans;