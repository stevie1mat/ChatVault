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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-8 max-w-md mx-auto">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
            <div className="space-y-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse"></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Loading chat data...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!chatData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
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
    // Enhanced view for minimal data (when chat was too large)
    const daysActive = Math.ceil((chatData.dateRange.end.getTime() - chatData.dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
    const averageMessagesPerDay = Math.round(chatData.totalMessages / daysActive);
    
    return (
      <div className="space-y-8">
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Analytics Overview</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Chat data was too large for detailed analytics. Here are the enhanced basic statistics:
          </p>
        </div>

        {/* Debug Section */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-4">🔍 Debug Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Total Messages:</strong> {chatData.totalMessages}
            </div>
            <div>
              <strong>Messages Array Length:</strong> {chatData.messages.length}
            </div>
            <div>
              <strong>Participants:</strong> {chatData.participants.length}
            </div>
            <div>
              <strong>Date Range:</strong> {chatData.dateRange.start.toLocaleDateString()} - {chatData.dateRange.end.toLocaleDateString()}
            </div>
          </div>
          <button 
            onClick={async () => {
              console.log('=== DEBUG FALLBACK DATA ===');
              console.log('chatData:', chatData);
              const storageData = await chatStorage.getChatData();
              console.log('IndexedDB storage data:', storageData);
            }}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Debug Data
          </button>
        </div>

        {/* Enhanced Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{chatData.totalMessages.toLocaleString()}</div>
            <div className="text-gray-600 dark:text-gray-400">Total Messages</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{chatData.participants.length}</div>
            <div className="text-gray-600 dark:text-gray-400">Participants</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{daysActive}</div>
            <div className="text-gray-600 dark:text-gray-400">Days Active</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">{averageMessagesPerDay}</div>
            <div className="text-gray-600 dark:text-gray-400">Avg/Day</div>
          </div>
        </div>

        {/* Enhanced Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Chat Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Chat Duration</span>
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">{daysActive} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Date Range</span>
                <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {chatData.dateRange.start.toLocaleDateString()} - {chatData.dateRange.end.toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Average Messages/Day</span>
                <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">{averageMessagesPerDay}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total Participants</span>
                <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">{chatData.participants.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Participant Information</h3>
            <div className="space-y-4">
              {chatData.participants.map((participant, index) => (
                <div key={participant} className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{participant}</span>
                  <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">#{index + 1}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="text-sm text-blue-600 dark:text-blue-400">
                <strong>Note:</strong> Detailed analytics require full message data. For comprehensive insights, try uploading a smaller chat file or use the main chat view for searching and filtering.
              </div>
            </div>
          </div>
        </div>

        {/* Activity Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Activity Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {Math.round(chatData.totalMessages / daysActive)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Messages per Day</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                {Math.round((chatData.totalMessages / daysActive) / 24)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Messages per Hour</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {Math.round(chatData.totalMessages / chatData.participants.length)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Messages per Participant</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a href="/" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
            Back to Chat
          </a>
        </div>
      </div>
    );
  }

  if (!overviewStats) {
    return (
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Analytics Overview</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Calculating overview statistics...
          </p>
        </div>
      </div>
    );
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Analytics Overview</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Comprehensive insights into your chat activity and patterns
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{overviewStats.totalMessages.toLocaleString()}</div>
          <div className="text-gray-600 dark:text-gray-400">Total Messages</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{overviewStats.totalParticipants}</div>
          <div className="text-gray-600 dark:text-gray-400">Participants</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{overviewStats.daysActive}</div>
          <div className="text-gray-600 dark:text-gray-400">Days Active</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">{overviewStats.averageMessagesPerDay}</div>
          <div className="text-gray-600 dark:text-gray-400">Avg/Day</div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
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

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Activity Peaks</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Peak Hour</span>
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">{overviewStats.mostActiveHour}:00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Peak Day</span>
              <span className="text-lg font-semibold text-green-600 dark:text-green-400">{dayNames[overviewStats.mostActiveDay]}</span>
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

      {/* Activity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Hourly Activity</h3>
          <div className="space-y-4">
            <div className="flex space-x-1">
              {overviewStats.hourlyActivity.map((count, hour) => (
                <div key={hour} className="flex-1 text-center">
                  <div
                    className="bg-blue-500 rounded-t"
                    style={{
                      height: `${Math.max(20, (count / Math.max(...overviewStats.hourlyActivity)) * 150)}px`,
                      backgroundColor: count > 0 
                        ? `hsl(${200 + (count / Math.max(...overviewStats.hourlyActivity)) * 60}, 70%, 60%)`
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
              {overviewStats.dailyActivity.map((count, day) => (
                <div key={day} className="flex-1 text-center">
                  <div
                    className="bg-green-500 rounded-t"
                    style={{
                      height: `${Math.max(20, (count / Math.max(...overviewStats.dailyActivity)) * 150)}px`,
                      backgroundColor: count > 0 
                        ? `hsl(${120 + (count / Math.max(...overviewStats.dailyActivity)) * 60}, 70%, 60%)`
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

      {/* Participant Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Participant Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chatData.participants.map((participant, index) => {
            // Calculate stats for this participant
            const participantMessages = chatData.messages.filter(msg => msg.sender === participant);
            const messageCount = participantMessages.length;
            const totalCharacters = participantMessages.reduce((sum, msg) => sum + msg.content.length, 0);
            const averageLength = messageCount > 0 ? Math.round(totalCharacters / messageCount) : 0;
            const sharePercentage = Math.round((messageCount / overviewStats.totalMessages) * 100);
            
            return (
              <div key={participant} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
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

      {/* Full Analytics Dashboard */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Detailed Analytics</h3>
        <AnalyticsDashboard messages={filteredMessages} participants={chatData.participants} />
      </div>
    </div>
  );
} 