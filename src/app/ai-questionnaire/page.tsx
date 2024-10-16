"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';
import { FiSend } from 'react-icons/fi';
import axios from 'axios';

const AIQuestionnaire = () => {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [progress, setProgress] = useState(0);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    const startNewSession = async () => {
      try {
        const response = await axios.post('/api/generate-questions');
        setSessionId(response.data.sessionId);
        setCurrentQuestion(response.data.question);
      } catch (error) {
        console.error('Failed to start new session:', error);
        setCurrentQuestion('AIが生成した質問がここに表示されます。');
      }
    };

    startNewSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    try {
      const response = await axios.post('/api/generate-follow-up-questions', {
        sessionId,
        answer,
      });
      setCurrentQuestion(response.data.question);
      setAnswer('');
      setProgress((prev) => Math.min(prev + 10, 100));

      if (response.data.isComplete) {
        router.push('/diagnosis-result');
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">AI質問応答</h1>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">{currentQuestion}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="回答を入力してください..."
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
            >
              <FiSend className="mr-2" />
              送信
            </button>
          </form>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                  進捗
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-600">
                  {progress}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIQuestionnaire;