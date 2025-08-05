'use client';
import { useState, useEffect, useMemo } from 'react';
import { ParsedChatData, SearchFilters as SearchFiltersType, ChatMessage } from '@/types/chat';
import { filterMessages } from '@/utils/chatParser';
import { chatStorage } from '@/utils/storage';

interface DetailedAnalyticsData {
  participantStats: Array<{
    name: string;
    messageCount: number;
    percentage: number;
    averageLength: number;
  }>;
  mostActiveHour: { hour: number; count: number };
  mostActiveDay: { day: string; count: number };
  mostActiveDate: { date: string; count: number };
  messageLengthStats: {
    average: number;
    shortest: number;
    longest: number;
  };
}

export default function DetailedAnalyticsPage() {
  const [chatData, setChatData] = useState<ParsedChatData | null>(null);
  const [filters, setFilters] = useState<SearchFiltersType>({
    keyword: '',
    startDate: null,
    endDate: null,
    timeRange: null,
    sender: null
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

  useEffect(() => {
    const loadChatData = async () => {
      try {
        const storedData = await chatStorage.getChatData();
        if (storedData) {
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

  const filteredMessages = useMemo(() => {
    if (!chatData) return [];
    return filterMessages(chatData.messages, filters);
  }, [chatData, filters]);

  const detailedAnalytics = useMemo((): DetailedAnalyticsData => {
    if (filteredMessages.length === 0) {
      return {
        participantStats: [],
        mostActiveHour: { hour: 0, count: 0 },
        mostActiveDay: { day: 'N/A', count: 0 },
        mostActiveDate: { date: 'N/A', count: 0 },
        messageLengthStats: {
          average: 0,
          shortest: 0,
          longest: 0,
        },
      };
    }

    // Participant Activity Analysis
    const participantMessages = new Map<string, number>();
    filteredMessages.forEach(message => {
      if (!participantMessages.has(message.sender)) {
        participantMessages.set(message.sender, 0);
      }
      participantMessages.set(message.sender, participantMessages.get(message.sender)! + 1);
    });

    const totalMessages = filteredMessages.length;
    const participantStats = Array.from(participantMessages.entries()).map(([name, count]) => ({
      name,
      messageCount: count,
      percentage: totalMessages > 0 ? (count / totalMessages) * 100 : 0,
      averageLength: 0, // Placeholder, will be calculated later
    }));

    // Most Active Hour Analysis
    const hourCounts = new Array(24).fill(0);
    filteredMessages.forEach(message => {
      hourCounts[message.timestamp.getHours()]++;
    });
    const mostActiveHour = hourCounts.reduce((max, count, hour) => {
      if (count > max.count) {
        return { hour, count };
      }
      return max;
    }, { hour: 0, count: 0 });

    // Most Active Day Analysis
    const dayCounts = new Array(7).fill(0);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    filteredMessages.forEach(message => {
      const day = message.timestamp.getDay();
      dayCounts[day]++;
    });
    const mostActiveDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
    const mostActiveDay = { day: dayNames[mostActiveDayIndex], count: dayCounts[mostActiveDayIndex] };

    // Most Active Date Analysis
    const dateCounts = new Map<string, number>();
    filteredMessages.forEach(message => {
      const date = message.timestamp.toISOString().split('T')[0];
      if (!dateCounts.has(date)) {
        dateCounts.set(date, 0);
      }
      dateCounts.set(date, dateCounts.get(date)! + 1);
    });
    const mostActiveDate = Array.from(dateCounts.entries()).reduce((max, [date, count]) => {
      if (count > max.count) {
        return { date, count };
      }
      return max;
    }, { date: 'N/A', count: 0 });

    // Message Length Analysis
    const messageLengths: number[] = [];
    filteredMessages.forEach(message => {
      messageLengths.push(message.content.length);
    });
    const averageLength = messageLengths.length > 0 ? messageLengths.reduce((a, b) => a + b, 0) / messageLengths.length : 0;
    const shortest = messageLengths.length > 0 ? Math.min(...messageLengths) : 0;
    const longest = messageLengths.length > 0 ? Math.max(...messageLengths) : 0;

    return {
      participantStats,
      mostActiveHour,
      mostActiveDay,
      mostActiveDate,
      messageLengthStats: {
        average: averageLength,
        shortest,
        longest,
      },
    };
  }, [filteredMessages]);

  const handleCategoryClick = (category: string, messages: string[]) => {
    setSelectedCategory(category);
    setSelectedMessages(messages);
  };

  const closeModal = () => {
    setSelectedCategory(null);
    setSelectedMessages([]);
  };

  if (!chatData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Detailed Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">
            No chat data available. Please upload a chat file on the main page to view analytics.
          </p>
          <a href="/" className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200">
            Upload Chat File
          </a>
        </div>
      </div>
    );
  }

  if (chatData.messages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Detailed Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Chat data was too large for detailed analytics. Please use a smaller chat file.
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
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Detailed Analytics</h2>
      </div>

      {/* Participant Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Participant Activity</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Participant
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Messages
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Percentage
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Avg. Length
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {detailedAnalytics.participantStats.map((participant, index) => (
                <tr key={participant.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {participant.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {participant.messageCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {Math.round(participant.percentage)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {Math.round(participant.averageLength)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Most Active Hour */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Most Active Hour</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {detailedAnalytics.mostActiveHour.hour}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Hour</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800/30">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {detailedAnalytics.mostActiveHour.count}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Messages</div>
          </div>
        </div>
      </div>

      {/* Most Active Day */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Most Active Day</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800/30">
                         <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
               {detailedAnalytics.mostActiveDay.day}
             </div>
             <div className="text-sm text-gray-600 dark:text-gray-400">Day</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4 border border-orange-100 dark:border-orange-800/30">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {detailedAnalytics.mostActiveDay.count}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Messages</div>
          </div>
        </div>
      </div>

      {/* Most Active Date */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Most Active Date</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-4 border border-yellow-100 dark:border-yellow-800/30">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {detailedAnalytics.mostActiveDate.date}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Date</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl p-4 border border-red-100 dark:border-red-800/30">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {detailedAnalytics.mostActiveDate.count}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Messages</div>
          </div>
        </div>
      </div>

      {/* Message Length Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Message Length Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800/30">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {Math.round(detailedAnalytics.messageLengthStats.average)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Average Length</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {detailedAnalytics.messageLengthStats.shortest}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Shortest</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl p-4 border border-red-100 dark:border-red-800/30">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {detailedAnalytics.messageLengthStats.longest}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Longest</div>
          </div>
        </div>
      </div>

      {/* Special Occasions Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedCategory} Messages
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {selectedMessages.map((message, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <p className="text-gray-900 dark:text-white">{message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 