'use client';

import { useState, useCallback, useMemo } from 'react';
import { ParsedChatData, SearchFilters as SearchFiltersType, ChatMessage } from '@/types/chat';
import { filterMessages } from '@/utils/chatParser';
import FileUpload from '@/components/FileUpload';
import SearchFilters from '@/components/SearchFilters';
import ChatView from '@/components/ChatView';
import ExportButtons from '@/components/ExportButtons';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const [chatData, setChatData] = useState<ParsedChatData | null>(null);
  const [filters, setFilters] = useState<SearchFiltersType>({
    keyword: '',
    startDate: null,
    endDate: null,
    timeRange: null,
    sender: null
  });

  const filteredMessages = useMemo(() => {
    if (!chatData) return [];
    return filterMessages(chatData.messages, filters);
  }, [chatData, filters]);

  const handleChatParsed = useCallback((data: ParsedChatData) => {
    setChatData(data);
    // Reset filters when new chat is loaded
    setFilters({
      keyword: '',
      startDate: null,
      endDate: null,
      timeRange: null,
      sender: null
    });
  }, []);

  const handleFiltersChange = useCallback((newFilters: SearchFiltersType) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  WhatsApp Chat Parser
                </h1>
              </div>
              {chatData && (
                <div className="hidden sm:flex items-center space-x-4">
                  <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                    {chatData.totalMessages} messages
                  </div>
                  <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                    {chatData.participants.length} participants
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {chatData && <ExportButtons messages={filteredMessages} />}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!chatData ? (
          // Upload screen with clean design
          <div className="space-y-16">
            {/* Hero Section */}
            <div className="text-center space-y-8">
              <div className="space-y-6">
                <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
                  Parse Your WhatsApp Chat
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                  Upload your WhatsApp chat export and explore your conversations with powerful search, 
                  filtering, and analysis tools.
                </p>
              </div>
            </div>

            {/* Upload Section */}
            <div className="max-w-2xl mx-auto">
              <FileUpload onChatParsed={handleChatParsed} />
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center space-y-4">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Smart Search
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Find any message instantly with real-time keyword search and advanced filtering options.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Chat Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Analyze your chat patterns with date ranges, time filters, and participant insights.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="text-4xl mb-4">📤</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Export & Share
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Export filtered conversations in multiple formats for backup or analysis.
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                How to Export from WhatsApp
              </h3>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-start space-x-4">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                  <p>Open the chat you want to export in WhatsApp</p>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                  <p>Tap the chat name at the top → More options → Export chat</p>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                  <p>Choose "Without Media" to get a .txt file</p>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                  <p>Upload the file here and start exploring!</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Chat view with clean design
          <div className="space-y-8">
            {/* Chat Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Chat Analysis
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {filteredMessages.length} of {chatData.totalMessages} messages • {chatData.participants.length} participants
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {chatData.dateRange.start.toLocaleDateString()} - {chatData.dateRange.end.toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters sidebar */}
              <div className="lg:col-span-1">
                <SearchFilters
                  participants={chatData.participants}
                  dateRange={chatData.dateRange}
                  onFiltersChange={handleFiltersChange}
                />
              </div>

              {/* Chat view */}
              <div className="lg:col-span-3">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 h-[600px] flex flex-col overflow-hidden">
                  {/* Chat header */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Messages
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {filteredMessages.length} messages found
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {chatData.participants.map((participant, index) => (
                          <div key={participant} className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-300">
                            {participant}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <ChatView messages={filteredMessages} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
