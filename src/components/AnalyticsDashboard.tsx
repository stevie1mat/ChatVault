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
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{overviewStats.totalMessages.toLocaleString()}</div>
          <div className="text-gray-600 dark:text-gray-400">Total Messages</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{overviewStats.totalParticipants}</div>
          <div className="text-gray-600 dark:text-gray-400">Participants</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{daysActive}</div>
          <div className="text-gray-600 dark:text-gray-400">Days Active</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">{averageMessagesPerDay}</div>
          <div className="text-gray-600 dark:text-gray-400">Avg/Day</div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Engagement Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Average Message Length</span>
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">{overviewStats.averageMessageLength} characters</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Characters</span>
              <span className="text-lg font-semibold text-green-600 dark:text-green-400">{overviewStats.totalCharacters.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Average Response Gap</span>
              <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">{overviewStats.averageGap} minutes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Most Active Participant</span>
              <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">{overviewStats.mostActiveParticipant[0]}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Activity Peaks</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Peak Hour</span>
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">{overviewStats.mostActiveHour}:00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Peak Day</span>
              <span className="text-lg font-semibold text-green-600 dark:text-green-400">{['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][overviewStats.mostActiveDay]}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Messages at Peak Hour</span>
              <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">{Math.max(...overviewStats.hourlyActivity)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Messages on Peak Day</span>
              <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">{Math.max(...overviewStats.dailyActivity)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Participant Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Participant Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chatData.participants.map((participant: string, index: number) => {
            // Calculate stats for this participant
            const participantMessages = chatData.messages.filter((msg: any) => msg.sender === participant);
            const messageCount = participantMessages.length;
            const totalCharacters = participantMessages.reduce((sum: number, msg: any) => sum + msg.content.length, 0);
            const averageLength = messageCount > 0 ? Math.round(totalCharacters / messageCount) : 0;
            const sharePercentage = Math.round((messageCount / overviewStats.totalMessages) * 100);
            
            return (
              <div key={participant} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900 dark:text-white">{participant}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">#{index + 1}</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Messages:</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">{messageCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Avg Length:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{averageLength} chars</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Share:</span>
                    <span className="font-medium text-purple-600 dark:text-purple-400">{sharePercentage}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 