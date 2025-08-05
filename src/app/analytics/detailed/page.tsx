'use client';
import { useState, useEffect, useMemo } from 'react';
import { ParsedChatData, SearchFilters as SearchFiltersType, ChatMessage } from '@/types/chat';
import { filterMessages } from '@/utils/chatParser';
import { chatStorage } from '@/utils/storage';

interface DetailedAnalyticsData {
  responseTimeStats: {
    averageResponseTime: number;
    fastestResponse: number;
    slowestResponse: number;
    responseTimeDistribution: {
      immediate: number;
      quick: number;
      normal: number;
      slow: number;
    };
    participantResponseTimes: Array<{
      name: string;
      averageResponseTime: number;
      fastestResponse: number;
      slowestResponse: number;
      totalResponses: number;
      responseTimeDistribution: {
        immediate: number;
        quick: number;
        normal: number;
        slow: number;
      };
    }>;
  };
  specialOccasions: {
    wishes: { count: number; messages: string[] };
    congratulations: { count: number; messages: string[] };
    festivals: { count: number; messages: string[] };
    specialDays: { count: number; messages: string[] };
    birthdays: { count: number; messages: string[] };
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
        responseTimeStats: {
          averageResponseTime: 0,
          fastestResponse: 0,
          slowestResponse: 0,
          responseTimeDistribution: {
            immediate: 0,
            quick: 0,
            normal: 0,
            slow: 0,
          },
          participantResponseTimes: [],
        },
        specialOccasions: {
          wishes: { count: 0, messages: [] },
          congratulations: { count: 0, messages: [] },
          festivals: { count: 0, messages: [] },
          specialDays: { count: 0, messages: [] },
          birthdays: { count: 0, messages: [] },
        },
      };
    }

    // Response Time Analysis
    const responseTimes: number[] = [];
    const participantResponseTimes = new Map<string, number[]>();

    for (let i = 0; i < filteredMessages.length - 1; i++) {
      const currentMessage = filteredMessages[i];
      const nextMessage = filteredMessages[i + 1];
      
      if (currentMessage.sender !== nextMessage.sender) {
        const timeDiff = (nextMessage.timestamp.getTime() - currentMessage.timestamp.getTime()) / (1000 * 60);
        responseTimes.push(timeDiff);
        
        if (!participantResponseTimes.has(nextMessage.sender)) {
          participantResponseTimes.set(nextMessage.sender, []);
        }
        participantResponseTimes.get(nextMessage.sender)!.push(timeDiff);
      }
    }

    const averageResponseTime = responseTimes.length > 0 ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0;
    const fastestResponse = responseTimes.length > 0 ? Math.min(...responseTimes) : 0;
    const slowestResponse = responseTimes.length > 0 ? Math.max(...responseTimes) : 0;

    const responseTimeDistribution = {
      immediate: responseTimes.filter(t => t <= 1).length,
      quick: responseTimes.filter(t => t > 1 && t <= 5).length,
      normal: responseTimes.filter(t => t > 5 && t <= 30).length,
      slow: responseTimes.filter(t => t > 30).length,
    };

    const participantResponseStats = Array.from(participantResponseTimes.entries()).map(([name, times]) => {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const fastest = Math.min(...times);
      const slowest = Math.max(...times);
      
      const distribution = {
        immediate: times.filter(t => t <= 1).length,
        quick: times.filter(t => t > 1 && t <= 5).length,
        normal: times.filter(t => t > 5 && t <= 30).length,
        slow: times.filter(t => t > 30).length,
      };

      return {
        name,
        averageResponseTime: avg,
        fastestResponse: fastest,
        slowestResponse: slowest,
        totalResponses: times.length,
        responseTimeDistribution: distribution,
      };
    }).sort((a, b) => b.totalResponses - a.totalResponses);

    // Special Occasions Analysis
    const wishesKeywords = ['wish', 'hope', 'want', 'would like', 'dream', 'aspire', 'desire'];
    const congratulationsKeywords = ['congrat', 'well done', 'great job', 'amazing', 'excellent', 'outstanding', 'brilliant', 'fantastic'];
    const festivalsKeywords = ['happy', 'merry', 'celebration', 'festival', 'holiday', 'christmas', 'easter', 'diwali', 'ramadan', 'hanukkah', 'thanksgiving'];
    const specialDaysKeywords = ['anniversary', 'graduation', 'promotion', 'achievement', 'milestone', 'success', 'accomplishment'];
    const birthdayKeywords = ['birthday', 'bday', 'born', 'cake', '🎂', '🎉', '🎈', '🎁', 'happy birthday', 'many happy returns'];

    const wishes: string[] = [];
    const congratulations: string[] = [];
    const festivals: string[] = [];
    const specialDays: string[] = [];
    const birthdays: string[] = [];

    filteredMessages.forEach(message => {
      const content = message.content.toLowerCase();
      
      if (wishesKeywords.some(keyword => content.includes(keyword))) {
        wishes.push(message.content);
      }
      if (congratulationsKeywords.some(keyword => content.includes(keyword))) {
        congratulations.push(message.content);
      }
      if (festivalsKeywords.some(keyword => content.includes(keyword))) {
        festivals.push(message.content);
      }
      if (specialDaysKeywords.some(keyword => content.includes(keyword))) {
        specialDays.push(message.content);
      }
      if (birthdayKeywords.some(keyword => content.includes(keyword))) {
        birthdays.push(message.content);
      }
    });

    return {
      responseTimeStats: {
        averageResponseTime,
        fastestResponse,
        slowestResponse,
        responseTimeDistribution,
        participantResponseTimes: participantResponseStats,
      },
      specialOccasions: {
        wishes: { count: wishes.length, messages: wishes },
        congratulations: { count: congratulations.length, messages: congratulations },
        festivals: { count: festivals.length, messages: festivals },
        specialDays: { count: specialDays.length, messages: specialDays },
        birthdays: { count: birthdays.length, messages: birthdays },
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

      {/* Response Time Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Response Time Analysis</h3>
        
        {/* Overall Response Time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round(detailedAnalytics.responseTimeStats.averageResponseTime)}m
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Average Response</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800/30">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Math.round(detailedAnalytics.responseTimeStats.fastestResponse)}m
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Fastest Response</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4 border border-orange-100 dark:border-orange-800/30">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {Math.round(detailedAnalytics.responseTimeStats.slowestResponse)}m
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Slowest Response</div>
          </div>
        </div>

        {/* Response Time Distribution */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Response Time Distribution</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800/30">
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {detailedAnalytics.responseTimeStats.responseTimeDistribution.immediate}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Immediate (≤1m)</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800/30">
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {detailedAnalytics.responseTimeStats.responseTimeDistribution.quick}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Quick (1-5m)</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800/30">
              <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                {detailedAnalytics.responseTimeStats.responseTimeDistribution.normal}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Normal (5-30m)</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800/30">
              <div className="text-xl font-bold text-red-600 dark:text-red-400">
                {detailedAnalytics.responseTimeStats.responseTimeDistribution.slow}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Slow (&gt;30m)</div>
            </div>
          </div>
        </div>

        {/* Participant Response Times */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Participant Response Times</h4>
          <div className="space-y-4">
            {detailedAnalytics.responseTimeStats.participantResponseTimes.map((participant, index) => (
              <div key={participant.name} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
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
                        {participant.totalResponses} responses
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {Math.round(participant.averageResponseTime)}m avg
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {Math.round(participant.fastestResponse)}m fastest
                    </div>
                  </div>
                </div>
                
                {/* Participant Response Distribution */}
                <div className="grid grid-cols-4 gap-2 mt-3">
                  <div className="text-center">
                    <div className="text-sm font-medium text-green-600 dark:text-green-400">
                      {participant.responseTimeDistribution.immediate}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Immediate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {participant.responseTimeDistribution.quick}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Quick</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                      {participant.responseTimeDistribution.normal}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Normal</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-red-600 dark:text-red-400">
                      {participant.responseTimeDistribution.slow}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Slow</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Special Occasions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Special Occasions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div 
            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleCategoryClick('Wishes', detailedAnalytics.specialOccasions.wishes.messages)}
          >
            <div className="text-2xl mb-2">🎋</div>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {detailedAnalytics.specialOccasions.wishes.count}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Wishes</div>
          </div>

          <div 
            className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800/30 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleCategoryClick('Congratulations', detailedAnalytics.specialOccasions.congratulations.messages)}
          >
            <div className="text-2xl mb-2">🎉</div>
            <div className="text-xl font-bold text-green-600 dark:text-green-400">
              {detailedAnalytics.specialOccasions.congratulations.count}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Congratulations</div>
          </div>

          <div 
            className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800/30 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleCategoryClick('Festivals', detailedAnalytics.specialOccasions.festivals.messages)}
          >
            <div className="text-2xl mb-2">🎊</div>
            <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {detailedAnalytics.specialOccasions.festivals.count}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Festivals</div>
          </div>

          <div 
            className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4 border border-orange-100 dark:border-orange-800/30 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleCategoryClick('Special Days', detailedAnalytics.specialOccasions.specialDays.messages)}
          >
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
              {detailedAnalytics.specialOccasions.specialDays.count}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Special Days</div>
          </div>

          <div 
            className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl p-4 border border-pink-100 dark:border-pink-800/30 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleCategoryClick('Birthdays', detailedAnalytics.specialOccasions.birthdays.messages)}
          >
            <div className="text-2xl mb-2">🎂</div>
            <div className="text-xl font-bold text-pink-600 dark:text-pink-400">
              {detailedAnalytics.specialOccasions.birthdays.count}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Birthdays</div>
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