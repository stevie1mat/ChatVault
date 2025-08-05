'use client';

import { useState, useEffect, useMemo } from 'react';
import { ParsedChatData, SearchFilters as SearchFiltersType, ChatMessage } from '@/types/chat';
import { filterMessages } from '@/utils/chatParser';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

export default function AnalyticsOverviewPage() {
  const [chatData, setChatData] = useState<ParsedChatData | null>(null);
  const [filters, setFilters] = useState<SearchFiltersType>({
    keyword: '',
    startDate: null,
    endDate: null,
    timeRange: null,
    sender: null
  });

  // Get chat data from localStorage
  useEffect(() => {
    const storedChatData = localStorage.getItem('chatData');
    if (storedChatData) {
      try {
        const parsedData = JSON.parse(storedChatData);
        if (parsedData.messages && parsedData.messages.length > 0) {
          parsedData.messages = parsedData.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          parsedData.dateRange = {
            start: new Date(parsedData.dateRange.start),
            end: new Date(parsedData.dateRange.end)
          };
          setChatData(parsedData);
        } else {
          setChatData({
            ...parsedData,
            messages: [],
            dateRange: {
              start: new Date(parsedData.dateRange.start),
              end: new Date(parsedData.dateRange.end)
            }
          });
        }
      } catch (error) {
        console.error('Error parsing stored chat data:', error);
      }
    }
  }, []);

  const filteredMessages = useMemo(() => {
    if (!chatData) return [];
    return filterMessages(chatData.messages, filters);
  }, [chatData, filters]);

  if (!chatData) {
    return (
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics Overview
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            No chat data available. Please upload a chat file on the main page to view analytics.
          </p>
        </div>
        <div className="flex justify-center">
          <a href="/" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
            Upload Chat File
          </a>
        </div>
      </div>
    );
  }

  if (chatData.messages.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Analytics Overview</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Chat data was too large for full analytics. Here are the basic statistics:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{chatData.totalMessages}</div>
            <div className="text-gray-600 dark:text-gray-400">Total Messages</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{chatData.participants.length}</div>
            <div className="text-gray-600 dark:text-gray-400">Participants</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {Math.ceil((chatData.dateRange.end.getTime() - chatData.dateRange.start.getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Days Active</div>
          </div>
        </div>

        <div className="text-center">
          <a href="/" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
            Back to Chat
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Analytics Overview</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Comprehensive insights into your chat activity and patterns
        </p>
      </div>
      
      <AnalyticsDashboard messages={filteredMessages} participants={chatData.participants} />
    </div>
  );
} 