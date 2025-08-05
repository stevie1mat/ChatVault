'use client';

import { useMemo } from 'react';
import { ChatMessage } from '@/types/chat';

interface AnalyticsDashboardProps {
  messages: ChatMessage[];
  participants: string[];
}

interface AnalyticsData {
  totalMessages: number;
  totalDays: number;
  averageMessagesPerDay: number;
  mostActiveHour: { hour: number; count: number };
  mostActiveDay: { day: string; count: number };
  mostActiveDate: { date: string; count: number };
  participantStats: Array<{
    name: string;
    messageCount: number;
    percentage: number;
    averageLength: number;
  }>;
  hourlyActivity: Array<{ hour: number; count: number }>;
  dailyActivity: Array<{ day: string; count: number }>;
  messageLengthStats: {
    average: number;
    shortest: number;
    longest: number;
  };
}

export default function AnalyticsDashboard({ messages, participants }: AnalyticsDashboardProps) {
  const analytics = useMemo((): AnalyticsData => {
    if (messages.length === 0) {
      return {
        totalMessages: 0,
        totalDays: 0,
        averageMessagesPerDay: 0,
        mostActiveHour: { hour: 0, count: 0 },
        mostActiveDay: { day: '', count: 0 },
        mostActiveDate: { date: '', count: 0 },
        participantStats: [],
        hourlyActivity: [],
        dailyActivity: [],
        messageLengthStats: { average: 0, shortest: 0, longest: 0 }
      };
    }

    // Calculate basic stats
    const totalMessages = messages.length;
    const dates = [...new Set(messages.map(m => m.timestamp.toDateString()))];
    const totalDays = dates.length;
    const averageMessagesPerDay = Math.round(totalMessages / totalDays);

    // Hourly activity
    const hourlyCounts = new Array(24).fill(0);
    messages.forEach(msg => {
      const hour = msg.timestamp.getHours();
      hourlyCounts[hour]++;
    });
    const mostActiveHour = hourlyCounts.reduce((max, count, hour) => 
      count > max.count ? { hour, count } : max, { hour: 0, count: 0 }
    );

    // Daily activity
    const dailyCounts: { [key: string]: number } = {};
    messages.forEach(msg => {
      const day = msg.timestamp.toLocaleDateString('en-US', { weekday: 'long' });
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    });
    const mostActiveDay = Object.entries(dailyCounts).reduce((max, [day, count]) => 
      count > max.count ? { day, count } : max, { day: '', count: 0 }
    );

    // Participant stats
    const participantStats = participants.map(name => {
      const userMessages = messages.filter(m => m.sender === name);
      const messageCount = userMessages.length;
      const percentage = Math.round((messageCount / totalMessages) * 100);
      const averageLength = userMessages.length > 0 
        ? Math.round(userMessages.reduce((sum, m) => sum + m.content.length, 0) / userMessages.length)
        : 0;

      return { name, messageCount, percentage, averageLength };
    }).sort((a, b) => b.messageCount - a.messageCount);

    // Message length stats
    const lengths = messages.map(m => m.content.length);
    const messageLengthStats = {
      average: Math.round(lengths.reduce((sum, len) => sum + len, 0) / lengths.length),
      shortest: Math.min(...lengths),
      longest: Math.max(...lengths)
    };

    return {
      totalMessages,
      totalDays,
      averageMessagesPerDay,
      mostActiveHour,
      mostActiveDay,
      mostActiveDate: { date: '', count: 0 }, // Placeholder, will be updated if needed
      participantStats,
      hourlyActivity: hourlyCounts.map((count, hour) => ({ hour, count })),
      dailyActivity: Object.entries(dailyCounts).map(([day, count]) => ({ day, count })),
      messageLengthStats
    };
  }, [messages, participants]);

  if (messages.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl p-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-4">📊</div>
          <p>No data available for analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl p-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <span className="text-2xl">📊</span>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Chat Analytics
          </h3>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analytics.totalMessages}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Messages</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-100 dark:border-green-800/30">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{analytics.totalDays}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Days Active</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-100 dark:border-purple-800/30">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{analytics.averageMessagesPerDay}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg/Day</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border border-orange-100 dark:border-orange-800/30">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{analytics.messageLengthStats.average}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Length</div>
          </div>
        </div>

        {/* Participant Activity */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Participant Activity</h4>
          <div className="space-y-3">
            {analytics.participantStats.map((participant, index) => (
              <div key={participant.name} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    'bg-orange-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{participant.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {participant.messageCount} messages • {participant.averageLength} chars avg
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{participant.percentage}%</div>
                  <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${participant.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Patterns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Active Hour */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Most Active Hour</h4>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {analytics.mostActiveHour.hour}:00
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {analytics.mostActiveHour.count} messages
              </div>
            </div>
          </div>

          {/* Most Active Day */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Most Active Day</h4>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-100 dark:border-green-800/30">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {analytics.mostActiveDay.day}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {analytics.mostActiveDay.count} messages
              </div>
            </div>
          </div>
        </div>

        {/* Message Length Stats */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Message Length</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analytics.messageLengthStats.shortest}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Shortest</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{analytics.messageLengthStats.average}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{analytics.messageLengthStats.longest}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Longest</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 