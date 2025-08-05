'use client';
import { useState, useEffect, useMemo } from 'react';
import { ParsedChatData, SearchFilters as SearchFiltersType, ChatMessage } from '@/types/chat';
import { filterMessages } from '@/utils/chatParser';
import { chatStorage } from '@/utils/storage';

export default function ActivityChartsPage() {
  const [chatData, setChatData] = useState<ParsedChatData | null>(null);
  const [filters, setFilters] = useState<SearchFiltersType>({
    keyword: '',
    startDate: null,
    endDate: null,
    timeRange: null,
    sender: null
  });

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

  const activityStats = useMemo(() => {
    if (!chatData || chatData.messages.length === 0) return null;

    const hourlyActivity = new Array(24).fill(0);
    const dailyActivity = new Array(7).fill(0);

    chatData.messages.forEach(message => {
      const hour = message.timestamp.getHours();
      const day = message.timestamp.getDay();
      hourlyActivity[hour]++;
      dailyActivity[day]++;
    });

    return {
      hourlyActivity,
      dailyActivity
    };
  }, [chatData]);

  if (!chatData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Activity Charts</h2>
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Activity Charts</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Chat data was too large for detailed activity charts. Please use a smaller chat file.
          </p>
          <a href="/" className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200">
            Upload Chat File
          </a>
        </div>
      </div>
    );
  }

  if (!activityStats) {
    return (
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Activity Charts</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Calculating activity statistics...
          </p>
        </div>
      </div>
    );
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Activity Charts</h2>
      </div>

      {/* Activity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Hourly Activity</h3>
          <div className="space-y-4">
            <div className="flex space-x-1">
              {activityStats.hourlyActivity.map((count, hour) => (
                <div key={hour} className="flex-1 text-center">
                  <div
                    className="bg-blue-500 rounded-t"
                    style={{
                      height: `${Math.max(20, (count / Math.max(...activityStats.hourlyActivity)) * 150)}px`,
                      backgroundColor: count > 0 
                        ? `hsl(${200 + (count / Math.max(...activityStats.hourlyActivity)) * 60}, 70%, 60%)`
                        : '#e5e7eb'
                    }}
                    title={`${hour}:00 - ${count} messages`}
                  />
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">{hour}:00</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Daily Activity</h3>
          <div className="space-y-4">
            <div className="flex space-x-1">
              {activityStats.dailyActivity.map((count, day) => (
                <div key={day} className="flex-1 text-center">
                  <div
                    className="bg-green-500 rounded-t"
                    style={{
                      height: `${Math.max(20, (count / Math.max(...activityStats.dailyActivity)) * 150)}px`,
                      backgroundColor: count > 0 
                        ? `hsl(${120 + (count / Math.max(...activityStats.dailyActivity)) * 60}, 70%, 60%)`
                        : '#e5e7eb'
                    }}
                    title={`${dayNames[day]} - ${count} messages`}
                  />
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">{dayNames[day].slice(0, 3)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 