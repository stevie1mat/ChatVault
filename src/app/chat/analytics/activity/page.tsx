'use client';

import { useState, useEffect, useMemo } from 'react';
import { ParsedChatData, ChatMessage } from '@/types/chat';
import { chatStorage } from '@/utils/storage';

export default function ActivityPage() {
  const [chatData, setChatData] = useState<ParsedChatData | null>(null);

  // Get chat data from storage
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

  const activityStats = useMemo(() => {
    if (!chatData || chatData.messages.length === 0) return null;

    const hourlyActivity = new Array(24).fill(0);
    const dailyActivity = new Array(7).fill(0);
    const monthlyActivity = new Array(12).fill(0);
    const dateActivity = new Map();
    
    let totalMessages = 0;
    let averageMessagesPerDay = 0;
    let mostActiveDate = null;
    let mostActiveDateCount = 0;

    chatData.messages.forEach(message => {
      const hour = message.timestamp.getHours();
      const day = message.timestamp.getDay();
      const month = message.timestamp.getMonth();
      const dateKey = message.timestamp.toDateString();
      
      hourlyActivity[hour]++;
      dailyActivity[day]++;
      monthlyActivity[month]++;
      
      const currentDateCount = (dateActivity.get(dateKey) || 0) + 1;
      dateActivity.set(dateKey, currentDateCount);
      
      if (currentDateCount > mostActiveDateCount) {
        mostActiveDateCount = currentDateCount;
        mostActiveDate = message.timestamp;
      }
      
      totalMessages++;
    });

    const daysActive = Math.ceil((chatData.dateRange.end.getTime() - chatData.dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
    averageMessagesPerDay = Math.round(totalMessages / daysActive);

    const mostActiveHour = hourlyActivity.indexOf(Math.max(...hourlyActivity));
    const mostActiveDay = dailyActivity.indexOf(Math.max(...dailyActivity));
    const mostActiveMonth = monthlyActivity.indexOf(Math.max(...monthlyActivity));

    return {
      hourlyActivity,
      dailyActivity,
      monthlyActivity,
      totalMessages,
      averageMessagesPerDay,
      mostActiveHour,
      mostActiveDay,
      mostActiveMonth,
      mostActiveDate,
      mostActiveDateCount,
      daysActive
    };
  }, [chatData]);

  if (!chatData) {
    return (
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Activity Patterns</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No chat data available. Please upload a chat file on the main page to view analytics.
          </p>
        </div>
      </div>
    );
  }

  if (chatData.messages.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Activity Patterns</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Chat data was too large for detailed activity analytics.
          </p>
        </div>
      </div>
    );
  }

  if (!activityStats) {
    return (
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Activity Patterns</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Calculating activity patterns...
          </p>
        </div>
      </div>
    );
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Activity Patterns</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Discover when and how often your chat is most active
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{activityStats.totalMessages}</div>
          <div className="text-gray-600 dark:text-gray-400">Total Messages</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{activityStats.averageMessagesPerDay}</div>
          <div className="text-gray-600 dark:text-gray-400">Avg/Day</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{activityStats.mostActiveHour}:00</div>
          <div className="text-gray-600 dark:text-gray-400">Peak Hour</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">{dayNames[activityStats.mostActiveDay]}</div>
          <div className="text-gray-600 dark:text-gray-400">Peak Day</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hourly Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Hourly Activity</h3>
          <div className="space-y-4">
            <div className="flex space-x-1">
              {activityStats.hourlyActivity.map((count, hour) => (
                <div key={hour} className="flex-1 text-center">
                  <div
                    className="bg-blue-500 rounded-t"
                    style={{
                      height: `${Math.max(20, (count / Math.max(...activityStats.hourlyActivity)) * 200)}px`,
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
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Peak activity at {activityStats.mostActiveHour}:00 with {Math.max(...activityStats.hourlyActivity)} messages
            </div>
          </div>
        </div>

        {/* Daily Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Daily Activity</h3>
          <div className="space-y-4">
            <div className="flex space-x-1">
              {activityStats.dailyActivity.map((count, day) => (
                <div key={day} className="flex-1 text-center">
                  <div
                    className="bg-green-500 rounded-t"
                    style={{
                      height: `${Math.max(20, (count / Math.max(...activityStats.dailyActivity)) * 200)}px`,
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
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Most active on {dayNames[activityStats.mostActiveDay]} with {Math.max(...activityStats.dailyActivity)} messages
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Monthly Activity</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-6 gap-4">
            {activityStats.monthlyActivity.map((count, month) => (
              <div key={month} className="text-center">
                <div
                  className="bg-purple-500 rounded-t mx-auto relative"
                  style={{
                    width: '40px',
                    height: `${Math.max(20, (count / Math.max(...activityStats.monthlyActivity)) * 200)}px`,
                    backgroundColor: count > 0 
                      ? `hsl(${280 + (count / Math.max(...activityStats.monthlyActivity)) * 60}, 70%, 60%)`
                      : '#e5e7eb'
                  }}
                  title={`${monthNames[month]} - ${count} messages`}
                >
                  {count > 0 && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-1 rounded">
                      {count}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">{monthNames[month].slice(0, 3)}</div>
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Most active in {monthNames[activityStats.mostActiveMonth]} with {Math.max(...activityStats.monthlyActivity)} messages
          </div>
        </div>
      </div>

      {/* Most Active Date */}
      {activityStats.mostActiveDate && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Most Active Date</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {activityStats.mostActiveDate.toLocaleDateString()}
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-400">
              {activityStats.mostActiveDateCount} messages
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              {dayNames[activityStats.mostActiveDate.getDay()]} • {activityStats.mostActiveDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 