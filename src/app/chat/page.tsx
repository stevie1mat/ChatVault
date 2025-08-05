'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { ParsedChatData, ChatMessage } from '@/types/chat';
import { chatStorage } from '@/utils/storage';
import { filterMessages } from '@/utils/chatParser';
import ChatView from '@/components/ChatView';
import AISearch from '@/components/AISearch';
import AISearchResults from '@/components/AISearchResults';

export default function ChatPage() {
  const [chatData, setChatData] = useState<ParsedChatData | null>(null);
  const [filters, setFilters] = useState({
    keyword: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    timeRange: null as { start: string; end: string } | null,
    sender: null as string | null
  });
  const [aiSearchResults, setAiSearchResults] = useState<ChatMessage[]>([]);
  const [aiSearchReasons, setAiSearchReasons] = useState<{[key: string]: string}>({});
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | undefined>(undefined);
  const chatContainerRef = useRef<HTMLDivElement>(null);

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

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleAISearchResults = (results: ChatMessage[], reasons?: {[key: string]: string}, answer?: string) => {
    setAiSearchResults(results);
    setAiSearchReasons(reasons || {});
    setHighlightedMessageId(undefined);
  };

  const handleClearAISearch = () => {
    setAiSearchResults([]);
    setAiSearchReasons({});
    setHighlightedMessageId(undefined);
  };

  const handleJumpToMessage = (message: ChatMessage) => {
    setHighlightedMessageId(message.id);
    
    // Scroll to the message
    setTimeout(() => {
      const messageElement = document.querySelector(`[data-message-id="${message.id}"]`);
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

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
      {/* AI Search Section */}
      <AISearch 
        messages={chatData.messages}
        onSearchResults={handleAISearchResults}
        onClearSearch={handleClearAISearch}
      />
      
      {/* AI Search Results */}
      {aiSearchResults.length > 0 && (
        <AISearchResults 
          results={aiSearchResults}
          onJumpToMessage={handleJumpToMessage}
          searchReasons={aiSearchReasons}
        />
      )}
      
      {/* Messages Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {/* Sender Filter Pills */}
            <div className="flex items-center space-x-2">
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

            {/* Search Filters - Smaller and on the right */}
            <div className="flex items-center space-x-3">
              {/* Keyword Search */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={filters.keyword}
                  onChange={(e) => handleFilterChange('keyword', e.target.value)}
                  className="w-32 px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {/* Date Range */}
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  min={formatDate(chatData.dateRange.start)}
                  max={formatDate(chatData.dateRange.end)}
                  value={filters.startDate ? formatDate(filters.startDate) : ''}
                  onChange={(e) => handleFilterChange('startDate', e.target.value ? new Date(e.target.value) : null)}
                  className="w-28 px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Time Range */}
              <div className="flex items-center space-x-2">
                <input
                  type="time"
                  value={filters.timeRange?.start || ''}
                  onChange={(e) => handleFilterChange('timeRange', {
                    start: e.target.value,
                    end: e.target.value
                  })}
                  className="w-20 px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Analytics Button */}
              <a
                href="/chat/analytics"
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                View Analytics
              </a>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-[600px] overflow-y-auto" ref={chatContainerRef}>
          <ChatView 
            messages={filteredMessages} 
            highlightedMessageId={highlightedMessageId}
            onMessageClick={(message) => setHighlightedMessageId(message.id)}
          />
        </div>
      </div>
    </div>
  );
} 