"use client"

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';
import { FaPaperPlane } from 'react-icons/fa';
import { createClient } from '@/supabase';

const FAQChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    setIsLoading(true);
    setMessages(prev => [...prev, { type: 'user', content: inputMessage }]);
    setInputMessage('');

    try {
      const { data, error } = await supabase
        .from('faq_chatbot')
        .select('response')
        .eq('query', inputMessage)
        .single();

      if (error) throw error;

      const botResponse = data ? data.response : '申し訳ありませんが、その質問にはお答えできません。';
      setMessages(prev => [...prev, { type: 'bot', content: botResponse }]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages(prev => [...prev, { type: 'bot', content: 'エラーが発生しました。もう一度お試しください。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-full bg-gray-100 flex flex-col">
      <Topbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">FAQチャットボット</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div ref={chatContainerRef} className="h-96 overflow-y-auto mb-4">
            {messages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-3 rounded-lg ${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-center">
                <div className="inline-block p-3 bg-gray-200 rounded-lg">
                  回答を生成中...
                </div>
              </div>
            )}
          </div>
          <div className="flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="質問を入力してください"
              className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQChatbot;