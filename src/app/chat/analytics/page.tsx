'use client';

import { useState, useEffect, useMemo } from 'react';
import { ParsedChatData, SearchFilters as SearchFiltersType, ChatMessage } from '@/types/chat';
import { filterMessages } from '@/utils/chatParser';
import { chatStorage } from '@/utils/storage';
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
  const [isLoading, setIsLoading] = useState(true);

  // Get chat data from storage
  useEffect(() => {
    const loadChatData = async () => {
      setIsLoading(true);
      try {
        const storedData = await chatStorage.getChatData();
        console.log('Loaded chat data:', storedData);
        if (storedData) {
          console.log('Messages count:', storedData.messages?.length);
          console.log('Total messages:', storedData.totalMessages);
          console.log('Participants:', storedData.participants);
          
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
            console.log('Setting full chat data with', storedData.messages.length, 'messages');
            setChatData(storedData);
          } else {
            console.log('Setting minimal chat data (no messages)');
            setChatData({
              ...storedData,
              messages: [],
              dateRange: {
                start: new Date(storedData.dateRange.start),
                end: new Date(storedData.dateRange.end)
              }
            });
          }
        } else {
          console.log('No stored chat data found');
        }
      } catch (error) {
        console.error('Error loading chat data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChatData();
  }, []);

  const filteredMessages = useMemo(() => {
    if (!chatData) return [];
    return filterMessages(chatData.messages, filters);
  }, [chatData, filters]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const overviewStats = useMemo(() => {
    if (!chatData || chatData.messages.length === 0) return null;

    const totalMessages = chatData.messages.length;
    const totalParticipants = chatData.participants.length;
    const daysActive = Math.ceil((chatData.dateRange.end.getTime() - chatData.dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
    const averageMessagesPerDay = Math.round(totalMessages / daysActive);
    
    // Calculate engagement metrics
    const totalCharacters = chatData.messages.reduce((sum, msg) => sum + msg.content.length, 0);
    const averageMessageLength = Math.round(totalCharacters / totalMessages);
    
    // Calculate conversation flow
    const conversationGaps = [];
    for (let i = 1; i < chatData.messages.length; i++) {
      const gap = (chatData.messages[i].timestamp.getTime() - chatData.messages[i-1].timestamp.getTime()) / (1000 * 60); // in minutes
      if (gap > 0) conversationGaps.push(gap);
    }
    const averageGap = conversationGaps.length > 0 ? Math.round(conversationGaps.reduce((sum, gap) => sum + gap, 0) / conversationGaps.length) : 0;
    
    // Calculate activity patterns
    const hourlyActivity = new Array(24).fill(0);
    const dailyActivity = new Array(7).fill(0);
    
    chatData.messages.forEach(message => {
      hourlyActivity[message.timestamp.getHours()]++;
      dailyActivity[message.timestamp.getDay()]++;
    });
    
    const mostActiveHour = hourlyActivity.indexOf(Math.max(...hourlyActivity));
    const mostActiveDay = dailyActivity.indexOf(Math.max(...dailyActivity));
    
    // Calculate participant engagement
    const participantStats = new Map();
    chatData.participants.forEach(participant => {
      participantStats.set(participant, {
        messageCount: 0,
        totalCharacters: 0,
        averageLength: 0
      });
    });
    
    chatData.messages.forEach(message => {
      const stats = participantStats.get(message.sender);
      if (stats) {
        stats.messageCount++;
        stats.totalCharacters += message.content.length;
      }
    });
    
    participantStats.forEach(stats => {
      stats.averageLength = Math.round(stats.totalCharacters / stats.messageCount);
    });
    
    const mostActiveParticipant = Array.from(participantStats.entries())
      .sort((a, b) => b[1].messageCount - a[1].messageCount)[0];
    
    return {
      totalMessages,
      totalParticipants,
      daysActive,
      averageMessagesPerDay,
      totalCharacters,
      averageMessageLength,
      averageGap,
      mostActiveHour,
      mostActiveDay,
      mostActiveParticipant,
      hourlyActivity,
      dailyActivity
    };
  }, [chatData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-8 max-w-md mx-auto">
          <div className="space-y-6">
            <div className="relative">
              <div className="w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h2>
            </div>
            <div className="space-y-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full animate-pulse"></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Loading your chat insights...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!chatData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-8 max-w-lg mx-auto p-8">
          <div className="relative">
            <div className="w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20"></div>
              <div className="absolute inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-40"></div>
              <div className="absolute inset-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-4xl">📊</span>
              </div>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Analytics Dashboard
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            No chat data available. Upload a chat file to unlock powerful analytics insights.
          </p>
          <a 
            href="/" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span className="mr-2">📤</span>
            Upload Chat File
          </a>
        </div>
      </div>
    );
  }

  if (chatData.messages.length === 0) {
    // Enhanced view for minimal data (when chat was too large)
    const daysActive = Math.ceil((chatData.dateRange.end.getTime() - chatData.dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
    const averageMessagesPerDay = Math.round(chatData.totalMessages / daysActive);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20"></div>
                <div className="absolute inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-40"></div>
                <div className="absolute inset-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-3xl">📊</span>
                </div>
              </div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Analytics Overview
              </h2>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Your chat was too large for detailed analytics. Here are the enhanced basic statistics with AI-powered insights available.
            </p>
          </div>

          {/* AI Features Promo */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">🚀 AI-Powered Analytics Available</h3>
              <p className="text-purple-100 text-lg">
                Explore advanced insights with our new AI features
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">😊</div>
                  <div className="text-sm font-medium">Sentiment Analysis</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🗣️</div>
                  <div className="text-sm font-medium">Topic Modeling</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🔄</div>
                  <div className="text-sm font-medium">Conversation Patterns</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">⏱️</div>
                  <div className="text-sm font-medium">Response Times</div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">💬</span>
                </div>
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {chatData.totalMessages.toLocaleString()}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Total Messages</div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">👥</span>
                </div>
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {chatData.participants.length}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Participants</div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">📅</span>
                </div>
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {daysActive}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Days Active</div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">📈</span>
                </div>
                <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                  {averageMessagesPerDay}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Avg/Day</div>
              </div>
            </div>
          </div>

          {/* Enhanced Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-8 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-xl text-white">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Chat Statistics</h3>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Chat Duration</span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{daysActive} days</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Date Range</span>
                  <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {chatData.dateRange.start.toLocaleDateString()} - {chatData.dateRange.end.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Average Messages/Day</span>
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{averageMessagesPerDay}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Total Participants</span>
                  <span className="text-xl font-bold text-orange-600 dark:text-orange-400">{chatData.participants.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-8 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-xl text-white">👥</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Participant Information</h3>
              </div>
              <div className="space-y-4">
                {chatData.participants.map((participant, index) => (
                  <div key={participant} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">{participant}</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">#{index + 1}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-700">
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>💡 Pro Tip:</strong> For comprehensive AI-powered insights, try uploading a smaller chat file or explore our new AI analysis features in the sidebar.
                </div>
              </div>
            </div>
          </div>

          {/* Activity Insights */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-8 shadow-xl">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl text-white">📈</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Insights</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-2xl">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {Math.round(chatData.totalMessages / daysActive)}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Messages per Day</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 rounded-2xl">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {Math.round((chatData.totalMessages / daysActive) / 24)}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Messages per Hour</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 rounded-2xl">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {Math.round(chatData.totalMessages / chatData.participants.length)}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Messages per Participant</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <a 
              href="/" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="mr-2">💬</span>
              Back to Chat
            </a>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Explore AI-powered analytics in the sidebar for deeper insights
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!overviewStats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto">
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin"></div>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Analytics Overview
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Calculating overview statistics...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <AnalyticsDashboard 
          chatData={chatData}
          filteredMessages={filteredMessages}
          overviewStats={overviewStats}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>
    </div>
  );
} 