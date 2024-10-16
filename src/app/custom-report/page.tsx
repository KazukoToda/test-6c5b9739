"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FaFileAlt, FaCalendarAlt, FaFileDownload } from 'react-icons/fa';
import axios from 'axios';

const CustomReport = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [selectedItems, setSelectedItems] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [reportFormat, setReportFormat] = useState('pdf');
  const [loading, setLoading] = useState(false);

  const reportItems = [
    { id: 1, name: '全体スコア' },
    { id: 2, name: 'カテゴリ別スコア' },
    { id: 3, name: '分析コメント' },
    { id: 4, name: '改善提案' },
    { id: 5, name: '進捗状況' },
  ];

  const handleItemSelect = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleDateChange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  const handleFormatChange = (e) => {
    setReportFormat(e.target.value);
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/generate-custom-report', {
        selectedItems,
        dateRange,
        reportFormat
      });
      
      // Handle the response, e.g., download the report
      console.log('レポート生成成功:', response.data);
      // TODO: レポートのダウンロード処理を実装
    } catch (error) {
      console.error('レポート生成エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">カスタムレポート作成</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">レポート項目選択</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {reportItems.map(item => (
              <div key={item.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`item-${item.id}`}
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleItemSelect(item.id)}
                  className="mr-2"
                />
                <label htmlFor={`item-${item.id}`} className="text-gray-700">{item.name}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">データ範囲指定</h2>
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="start-date">開始日</label>
              <input
                type="date"
                id="start-date"
                name="start"
                value={dateRange.start}
                onChange={handleDateChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="end-date">終了日</label>
              <input
                type="date"
                id="end-date"
                name="end"
                value={dateRange.end}
                onChange={handleDateChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">レポート形式選択</h2>
          <select
            value={reportFormat}
            onChange={handleFormatChange}
            className="w-full p-2 border rounded"
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
          </select>
        </div>
        
        <button
          onClick={generateReport}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center w-full md:w-auto"
        >
          {loading ? (
            <span>生成中...</span>
          ) : (
            <>
              <FaFileDownload className="mr-2" />
              レポート生成
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CustomReport;