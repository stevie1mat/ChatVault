'use client';

import { useState, useEffect, useMemo } from 'react';
import { ParsedChatData, SearchFilters as SearchFiltersType, ChatMessage } from '@/types/chat';
import { filterMessages } from '@/utils/chatParser';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import ThemeToggle from '@/components/ThemeToggle';

export default function AnalyticsPage() {
  const [chatData, setChatData] = useState<ParsedChatData | null>(null);
  const [filters, setFilters] = useState<SearchFiltersType>({
    keyword: '',
    startDate: null,
    endDate: null,
    timeRange: null,
    sender: null
  });

  // Get chat data from localStorage or sessionStorage
  useEffect(() => {
    console.log('Analytics page mounted');
    const storedChatData = localStorage.getItem('chatData');
    console.log('Stored chat data:', storedChatData);
    if (storedChatData) {
      try {
        const parsedData = JSON.parse(storedChatData);
        console.log('Parsed data:', parsedData);
        
        // Check if we have full message data or just analytics data
        if (parsedData.messages && parsedData.messages.length > 0) {
          // Convert date strings back to Date objects
          parsedData.messages = parsedData.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          parsedData.dateRange = {
            start: new Date(parsedData.dateRange.start),
            end: new Date(parsedData.dateRange.end)
          };
          console.log('Processed data with messages:', parsedData);
          setChatData(parsedData);
        } else {
          // We only have minimal data, show a message
          console.log('Only minimal data available');
          setChatData({
            ...parsedData,
            messages: [], // No messages available
            dateRange: {
              start: new Date(parsedData.dateRange.start),
              end: new Date(parsedData.dateRange.end)
            }
          });
        }
      } catch (error) {
        console.error('Error parsing stored chat data:', error);
      }
    } else {
      console.log('No stored chat data found');
    }
  }, []);

  const filteredMessages = useMemo(() => {
    if (!chatData) return [];
    return filterMessages(chatData.messages, filters);
  }, [chatData, filters]);

  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);
  };

  if (!chatData) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">ChatVault Analytics</h1>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                  ← Back to Chat
                </a>
                <a href="https://github.com/stevie1mat/ChatVault" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors" title="View on GitHub">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                No chat data available. Please upload a chat file on the main page to view analytics.
              </p>
              <div className="mt-4 space-y-2">
                <button 
                  onClick={() => {
                    const stored = localStorage.getItem('chatData');
                    console.log('Manual check - stored data:', stored);
                    if (stored) {
                      try {
                        const parsed = JSON.parse(stored);
                        console.log('Manual check - parsed data:', parsed);
                        console.log('Manual check - messages count:', parsed.messages?.length);
                        console.log('Manual check - participants:', parsed.participants);
                        console.log('Manual check - dateRange:', parsed.dateRange);
                      } catch (e) {
                        console.error('Manual check - parse error:', e);
                      }
                    } else {
                      console.log('Manual check - No data found in localStorage');
                      console.log('Manual check - All localStorage keys:', Object.keys(localStorage));
                    }
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Debug: Check localStorage
                </button>
                <button 
                  onClick={() => {
                    localStorage.setItem('test', 'test-value');
                    const testValue = localStorage.getItem('test');
                    console.log('localStorage test - stored:', testValue);
                    localStorage.removeItem('test');
                    console.log('localStorage test - All keys:', Object.keys(localStorage));
                  }}
                  className="px-4 py-2 bg-blue-200 dark:bg-blue-700 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-300 dark:hover:bg-blue-600 transition-colors"
                >
                  Test localStorage
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <a href="/" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                Upload Chat File
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">ChatVault Analytics</h1>
              <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                    {chatData.totalMessages} messages
                  </span>
                  <span>•</span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                    {chatData.participants.length} participants
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">
                    {chatData.dateRange.start.toLocaleDateString()} - {chatData.dateRange.end.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                ← Back to Chat
              </a>
              <a href="https://github.com/stevie1mat/ChatVault" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors" title="View on GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {chatData.messages.length === 0 ? (
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Basic Analytics
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
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
            <div className="mt-8">
              <a href="/" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                Back to Chat
              </a>
            </div>
          </div>
        ) : (
          <AnalyticsDashboard messages={filteredMessages} participants={chatData.participants} />
        )}
      </div>
    </div>
  );
} 