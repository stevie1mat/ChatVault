'use client';

import { useMemo } from 'react';
import { ChatMessage } from '@/types/chat';

interface AnalyticsDashboardProps {
  chatData: any;
  filteredMessages: ChatMessage[];
  overviewStats: any;
  filters: any;
  onFilterChange: (key: string, value: any) => void;
}

export default function AnalyticsDashboard({ chatData, filteredMessages, overviewStats, filters, onFilterChange }: AnalyticsDashboardProps) {
  if (!chatData || !overviewStats) {
    return (
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Analytics Overview</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No data available for analytics.
          </p>
        </div>
      </div>
    );
  }

  const daysActive = Math.ceil((chatData.dateRange.end.getTime() - chatData.dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
  const averageMessagesPerDay = Math.round(chatData.totalMessages / daysActive);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Chat Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Comprehensive insights into your conversation patterns and engagement
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="absolute top-4 right-4 text-white/20 text-3xl">💬</div>
          <div className="text-4xl font-bold text-white mb-2">{overviewStats.totalMessages.toLocaleString()}</div>
          <div className="text-blue-100 font-medium">Total Messages</div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-2xl"></div>
        </div>
        
        <div className="group relative bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="absolute top-4 right-4 text-white/20 text-3xl">👥</div>
          <div className="text-4xl font-bold text-white mb-2">{overviewStats.totalParticipants}</div>
          <div className="text-green-100 font-medium">Participants</div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-2xl"></div>
        </div>
        
        <div className="group relative bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="absolute top-4 right-4 text-white/20 text-3xl">📅</div>
          <div className="text-4xl font-bold text-white mb-2">{daysActive}</div>
          <div className="text-purple-100 font-medium">Days Active</div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-2xl"></div>
        </div>
        
        <div className="group relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="absolute top-4 right-4 text-white/20 text-3xl">📊</div>
          <div className="text-4xl font-bold text-white mb-2">{averageMessagesPerDay}</div>
          <div className="text-orange-100 font-medium">Avg/Day</div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-2xl"></div>
        </div>
      </div>

      {/* Engagement & Activity Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Engagement Metrics</h3>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
              <div className="flex items-center">
                <span className="text-blue-600 dark:text-blue-400 mr-3">📏</span>
                <span className="text-gray-700 dark:text-gray-300">Average Message Length</span>
              </div>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{overviewStats.averageMessageLength} characters</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
              <div className="flex items-center">
                <span className="text-green-600 dark:text-green-400 mr-3">📝</span>
                <span className="text-gray-700 dark:text-gray-300">Total Characters</span>
              </div>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">{overviewStats.totalCharacters.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
              <div className="flex items-center">
                <span className="text-purple-600 dark:text-purple-400 mr-3">⏱️</span>
                <span className="text-gray-700 dark:text-gray-300">Average Response Gap</span>
              </div>
              <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{overviewStats.averageGap} minutes</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl">
              <div className="flex items-center">
                <span className="text-orange-600 dark:text-orange-400 mr-3">🏆</span>
                <span className="text-gray-700 dark:text-gray-300">Most Active Participant</span>
              </div>
              <span className="text-xl font-bold text-orange-600 dark:text-orange-400">{overviewStats.mostActiveParticipant[0]}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Peaks</h3>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
              <div className="flex items-center">
                <span className="text-blue-600 dark:text-blue-400 mr-3">🕐</span>
                <span className="text-gray-700 dark:text-gray-300">Peak Hour</span>
              </div>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{overviewStats.mostActiveHour}:00</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
              <div className="flex items-center">
                <span className="text-green-600 dark:text-green-400 mr-3">📅</span>
                <span className="text-gray-700 dark:text-gray-300">Peak Day</span>
              </div>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">{['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][overviewStats.mostActiveDay]}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
              <div className="flex items-center">
                <span className="text-purple-600 dark:text-purple-400 mr-3">💬</span>
                <span className="text-gray-700 dark:text-gray-300">Messages at Peak Hour</span>
              </div>
              <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{Math.max(...overviewStats.hourlyActivity)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl">
              <div className="flex items-center">
                <span className="text-orange-600 dark:text-orange-400 mr-3">📈</span>
                <span className="text-gray-700 dark:text-gray-300">Messages on Peak Day</span>
              </div>
              <span className="text-xl font-bold text-orange-600 dark:text-orange-400">{Math.max(...overviewStats.dailyActivity)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Participant Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
            <span className="text-2xl">👥</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Participant Overview</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chatData.participants.map((participant: string, index: number) => {
            // Calculate stats for this participant
            const participantMessages = chatData.messages.filter((msg: any) => msg.sender === participant);
            const messageCount = participantMessages.length;
            const totalCharacters = participantMessages.reduce((sum: number, msg: any) => sum + msg.content.length, 0);
            const averageLength = messageCount > 0 ? Math.round(totalCharacters / messageCount) : 0;
            const sharePercentage = Math.round((messageCount / overviewStats.totalMessages) * 100);
            
            const rankColors = [
              'from-yellow-500 to-yellow-600',
              'from-gray-400 to-gray-500',
              'from-orange-500 to-orange-600',
              'from-blue-500 to-blue-600'
            ];
            
            return (
              <div key={participant} className="group relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 bg-gradient-to-r ${rankColors[index % rankColors.length]} rounded-full flex items-center justify-center mr-3`}>
                      <span className="text-white font-bold text-sm">#{index + 1}</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white text-lg">{participant}</span>
                  </div>
                  <div className="text-2xl">👤</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Messages:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">{messageCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Avg Length:</span>
                    <span className="font-bold text-green-600 dark:text-green-400 text-lg">{averageLength} chars</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Share:</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400 text-lg">{sharePercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${sharePercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold">🚀 Advanced Analytics</h3>
          <p className="text-blue-100">
            Explore AI-powered insights with sentiment analysis, topic modeling, and conversation patterns
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <a href="/chat/analytics/sentiment" className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200 font-medium">
              😊 Sentiment Analysis
            </a>
            <a href="/chat/analytics/topics" className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200 font-medium">
              🗣️ Topic Modeling
            </a>
            <a href="/chat/analytics/patterns" className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200 font-medium">
              🔄 Conversation Patterns
            </a>
            <a href="/chat/analytics/response-times" className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200 font-medium">
              ⏱️ Response Times
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 