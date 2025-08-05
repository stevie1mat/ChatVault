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
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Analytics Dashboard
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Comprehensive insights into your chat activity
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-3xl border border-blue-200 dark:border-blue-700 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
            <span className="text-xl text-white">💬</span>
          </div>
          <div className="mt-8">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {overviewStats.totalMessages.toLocaleString()}
            </div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">Total Messages</div>
            <div className="mt-4 text-sm text-blue-500 dark:text-blue-400">
              Across {daysActive} days
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 rounded-3xl border border-green-200 dark:border-green-700 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
            <span className="text-xl text-white">👥</span>
          </div>
          <div className="mt-8">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              {overviewStats.totalParticipants}
            </div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">Participants</div>
            <div className="mt-4 text-sm text-green-500 dark:text-green-400">
              Active in conversation
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 rounded-3xl border border-purple-200 dark:border-purple-700 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-xl text-white">📅</span>
          </div>
          <div className="mt-8">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {daysActive}
            </div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">Days Active</div>
            <div className="mt-4 text-sm text-purple-500 dark:text-purple-400">
              Conversation duration
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/30 rounded-3xl border border-orange-200 dark:border-orange-700 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
            <span className="text-xl text-white">📈</span>
          </div>
          <div className="mt-8">
            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {averageMessagesPerDay}
            </div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">Avg/Day</div>
            <div className="mt-4 text-sm text-orange-500 dark:text-orange-400">
              Daily activity rate
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-8 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
              <span className="text-xl text-white">📊</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Engagement Metrics</h3>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-2xl">
              <div className="flex items-center">
                <span className="text-blue-500 mr-3">📝</span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Average Message Length</span>
              </div>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{overviewStats.averageMessageLength} chars</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 rounded-2xl">
              <div className="flex items-center">
                <span className="text-green-500 mr-3">🔤</span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Total Characters</span>
              </div>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">{overviewStats.totalCharacters.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 rounded-2xl">
              <div className="flex items-center">
                <span className="text-purple-500 mr-3">⏱️</span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Average Response Gap</span>
              </div>
              <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{overviewStats.averageGap} min</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/30 rounded-2xl">
              <div className="flex items-center">
                <span className="text-orange-500 mr-3">👑</span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Most Active Participant</span>
              </div>
              <span className="text-xl font-bold text-orange-600 dark:text-orange-400">{overviewStats.mostActiveParticipant[0]}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-8 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4">
              <span className="text-xl text-white">📈</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Peaks</h3>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-2xl">
              <div className="flex items-center">
                <span className="text-blue-500 mr-3">🕐</span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Peak Hour</span>
              </div>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{overviewStats.mostActiveHour}:00</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 rounded-2xl">
              <div className="flex items-center">
                <span className="text-green-500 mr-3">📅</span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Peak Day</span>
              </div>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">{['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][overviewStats.mostActiveDay]}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 rounded-2xl">
              <div className="flex items-center">
                <span className="text-purple-500 mr-3">💬</span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Messages at Peak Hour</span>
              </div>
              <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{Math.max(...overviewStats.hourlyActivity)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/30 rounded-2xl">
              <div className="flex items-center">
                <span className="text-orange-500 mr-3">📊</span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Messages on Peak Day</span>
              </div>
              <span className="text-xl font-bold text-orange-600 dark:text-orange-400">{Math.max(...overviewStats.dailyActivity)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Participant Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-8 shadow-xl">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
            <span className="text-xl text-white">👥</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Participant Overview</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatData.participants.map((participant: string, index: number) => {
            // Calculate stats for this participant
            const participantMessages = chatData.messages.filter((msg: any) => msg.sender === participant);
            const messageCount = participantMessages.length;
            const totalCharacters = participantMessages.reduce((sum: number, msg: any) => sum + msg.content.length, 0);
            const averageLength = messageCount > 0 ? Math.round(totalCharacters / messageCount) : 0;
            const sharePercentage = Math.round((messageCount / overviewStats.totalMessages) * 100);
            
            // Color schemes for different ranks
            const rankColors = [
              { bg: 'from-yellow-500 to-yellow-600', text: 'text-yellow-600', border: 'border-yellow-200', icon: '👑' },
              { bg: 'from-gray-500 to-gray-600', text: 'text-gray-600', border: 'border-gray-200', icon: '🥈' },
              { bg: 'from-orange-500 to-orange-600', text: 'text-orange-600', border: 'border-orange-200', icon: '🥉' }
            ];
            const colorScheme = rankColors[index] || { bg: 'from-blue-500 to-blue-600', text: 'text-blue-600', border: 'border-blue-200', icon: '👤' };
            
            return (
              <div key={participant} className="group relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl border border-gray-200 dark:border-gray-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
                  <span className="text-sm text-white font-bold">#{index + 1}</span>
                </div>
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${colorScheme.bg} rounded-2xl flex items-center justify-center mr-3`}>
                    <span className="text-xl text-white">{colorScheme.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">{participant}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Participant</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded-xl">
                    <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Messages</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{messageCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded-xl">
                    <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Avg Length</span>
                    <span className="font-bold text-green-600 dark:text-green-400">{averageLength} chars</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded-xl">
                    <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Share</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">{sharePercentage}%</span>
                  </div>
                </div>
                {/* Progress bar for share percentage */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
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
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-8 text-white shadow-2xl">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold">🚀 Explore AI-Powered Analytics</h3>
          <p className="text-blue-100 text-lg">
            Discover deeper insights with our advanced AI features
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-2xl mb-2">😊</div>
              <div className="text-sm font-medium">Sentiment Analysis</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-2xl mb-2">🗣️</div>
              <div className="text-sm font-medium">Topic Modeling</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-2xl mb-2">🔄</div>
              <div className="text-sm font-medium">Conversation Patterns</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-2xl mb-2">⏱️</div>
              <div className="text-sm font-medium">Response Times</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 