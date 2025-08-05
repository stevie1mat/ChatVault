'use client';

import { useState, useEffect, useMemo } from 'react';
import { ParsedChatData, SearchFiltersType } from '@/types/chat';
import { chatStorage } from '@/utils/storage';
import { filterMessages } from '@/utils/chatParser';
import SearchFilters from '@/components/SearchFilters';
import ChatView from '@/components/ChatView';

export default function ChatPage() {
  const [chatData, setChatData] = useState<ParsedChatData | null>(null);
  const [filters, setFilters] = useState<SearchFiltersType>({
    keyword: '',
    startDate: null,
    endDate: null,
    timeRange: null,
    sender: 'all'
  });

  // Load chat data from storage
  useEffect(() => {
    const loadChatData = async () => {
      try {
        const storedData = await chatStorage.getChatData();
        if (storedData) {
          // Convert date strings back to Date objects
          if (storedData.messages && storedData.messages.length > 0) {
            storedData.messages = storedData.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }));
            storedData.dateRange = {
              start: new Date(storedData.dateRange.start),
              end: new Date(storedData.dateRange.end)
            };
            setChatData(storedData);
          } else {
            setChatData({
              ...storedData,
              messages: [],
              dateRange: {
                start: new Date(storedData.dateRange.start),
                end: new Date(storedData.dateRange.end)
              }
            });
          }
        }
      } catch (error) {
        console.error('Error loading chat data:', error);
      }
    };

    loadChatData();
  }, []);

  // Filter messages based on current filters
  const filteredMessages = useMemo(() => {
    if (!chatData) return [];
    return filterMessages(chatData.messages, filters);
  }, [chatData, filters]);

  if (!chatData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Chat View</h2>
          <p className="text-gray-600 dark:text-gray-400">
            No chat data available. Please upload a chat file on the main page to view messages.
          </p>
          <a href="/" className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200">
            Upload Chat File
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-left space-y-6">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Messages</h2>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
        <SearchFilters 
          filters={filters} 
          onFiltersChange={setFilters}
          participants={chatData.participants}
        />
      </div>

      {/* Messages Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Messages</h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredMessages.length} of {chatData.totalMessages} messages found
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {chatData.dateRange.start.toLocaleDateString()} - {chatData.dateRange.end.toLocaleDateString()}
            </div>
          </div>
          
          {/* Sender Filter Pills */}
          <div className="flex items-center space-x-2 mt-4">
            <button
              onClick={() => setFilters(prev => ({ ...prev, sender: 'all' }))}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filters.sender === 'all'
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {chatData.participants.map((participant) => (
              <button
                key={participant}
                onClick={() => setFilters(prev => ({ ...prev, sender: participant }))}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filters.sender === participant
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {participant}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto">
          <ChatView messages={filteredMessages} />
        </div>
      </div>
    </div>
  );
} 