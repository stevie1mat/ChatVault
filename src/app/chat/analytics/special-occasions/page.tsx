'use client';
import { useState, useEffect, useMemo } from 'react';
import { ParsedChatData, SearchFilters as SearchFiltersType, ChatMessage } from '@/types/chat';
import { filterMessages } from '@/utils/chatParser';
import { chatStorage } from '@/utils/storage';

interface SpecialOccasionsData {
  wishes: { count: number; messages: string[] };
  congratulations: { count: number; messages: string[] };
  festivals: { count: number; messages: string[] };
  specialDays: { count: number; messages: string[] };
  birthdays: { count: number; messages: string[] };
}

export default function SpecialOccasionsPage() {
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

  const specialOccasions = useMemo((): SpecialOccasionsData => {
    if (filteredMessages.length === 0) {
      return {
        wishes: { count: 0, messages: [] },
        congratulations: { count: 0, messages: [] },
        festivals: { count: 0, messages: [] },
        specialDays: { count: 0, messages: [] },
        birthdays: { count: 0, messages: [] },
      };
    }

    // Special Occasions Analysis
    const wishesKeywords = ['wish', 'hope', 'want', 'would like', 'dream', 'aspire', 'desire', 'wishing', 'hoping'];
    const congratulationsKeywords = ['congrat', 'well done', 'great job', 'amazing', 'excellent', 'outstanding', 'brilliant', 'fantastic', 'awesome', 'incredible', 'wonderful', 'superb'];
    const festivalsKeywords = ['happy', 'merry', 'celebration', 'festival', 'holiday', 'christmas', 'easter', 'diwali', 'ramadan', 'hanukkah', 'thanksgiving', 'new year', 'valentine', 'halloween'];
    const specialDaysKeywords = ['anniversary', 'graduation', 'promotion', 'achievement', 'milestone', 'success', 'accomplishment', 'award', 'recognition', 'honor'];
    const birthdayKeywords = ['birthday', 'bday', 'born', 'cake', '🎂', '🎉', '🎈', '🎁', 'happy birthday', 'many happy returns', 'birth day', 'turning', 'years old'];

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
      wishes: { count: wishes.length, messages: wishes },
      congratulations: { count: congratulations.length, messages: congratulations },
      festivals: { count: festivals.length, messages: festivals },
      specialDays: { count: specialDays.length, messages: specialDays },
      birthdays: { count: birthdays.length, messages: birthdays },
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Special Occasions</h2>
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Special Occasions</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Chat data was too large for special occasions analysis. Please use a smaller chat file.
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
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Special Occasions</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Discover special moments and celebrations in your chat
        </p>
      </div>

      {/* Special Occasions Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Detected Special Occasions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div 
            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleCategoryClick('Wishes', specialOccasions.wishes.messages)}
          >
            <div className="text-2xl mb-2">🎋</div>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {specialOccasions.wishes.count}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Wishes</div>
          </div>

          <div 
            className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800/30 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleCategoryClick('Congratulations', specialOccasions.congratulations.messages)}
          >
            <div className="text-2xl mb-2">🎉</div>
            <div className="text-xl font-bold text-green-600 dark:text-green-400">
              {specialOccasions.congratulations.count}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Congratulations</div>
          </div>

          <div 
            className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800/30 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleCategoryClick('Festivals', specialOccasions.festivals.messages)}
          >
            <div className="text-2xl mb-2">🎊</div>
            <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {specialOccasions.festivals.count}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Festivals</div>
          </div>

          <div 
            className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4 border border-orange-100 dark:border-orange-800/30 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleCategoryClick('Special Days', specialOccasions.specialDays.messages)}
          >
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
              {specialOccasions.specialDays.count}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Special Days</div>
          </div>

          <div 
            className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl p-4 border border-pink-100 dark:border-pink-800/30 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleCategoryClick('Birthdays', specialOccasions.birthdays.messages)}
          >
            <div className="text-2xl mb-2">🎂</div>
            <div className="text-xl font-bold text-pink-600 dark:text-pink-400">
              {specialOccasions.birthdays.count}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Birthdays</div>
          </div>
        </div>
      </div>

      {/* Detection Keywords */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Detection Keywords</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">🎋 Wishes</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                wish, hope, want, would like, dream, aspire, desire, wishing, hoping
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">🎉 Congratulations</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                congrat, well done, great job, amazing, excellent, outstanding, brilliant, fantastic, awesome, incredible, wonderful, superb
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">🎊 Festivals</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                happy, merry, celebration, festival, holiday, christmas, easter, diwali, ramadan, hanukkah, thanksgiving, new year, valentine, halloween
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">🎯 Special Days</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                anniversary, graduation, promotion, achievement, milestone, success, accomplishment, award, recognition, honor
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-pink-600 dark:text-pink-400 mb-2">🎂 Birthdays</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                birthday, bday, born, cake, 🎂, 🎉, 🎈, 🎁, happy birthday, many happy returns, birth day, turning, years old
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Special Occasions Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedCategory} Messages ({selectedMessages.length})
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
              {selectedMessages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">😔</div>
                  <p className="text-gray-600 dark:text-gray-400">No {selectedCategory.toLowerCase()} messages found in this chat.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedMessages.map((message, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-gray-900 dark:text-white">{message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 