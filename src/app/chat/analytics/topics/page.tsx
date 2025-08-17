'use client';

import { useState, useEffect } from 'react';
import { chatStorage } from '@/utils/storage';
import { analyzeTopicsWithMistral } from '@/utils/mistralAI';

interface TopicData {
  mainTopics: Array<{
    topic: string;
    frequency: number;
    keywords: string[];
    description: string;
    participantInterest: Array<{
      name: string;
      interest: number;
      messageCount: number;
    }>;
  }>;
  conversationThemes: Array<{
    theme: string;
    description: string;
    timePeriod: string;
    keyMessages: string[];
    participants: string[];
  }>;
  topicEvolution: Array<{
    period: string;
    dominantTopics: string[];
    newTopics: string[];
    fadingTopics: string[];
  }>;
  participantTopicPreferences: Array<{
    name: string;
    favoriteTopics: string[];
    leastFavoriteTopics: string[];
    topicDiversity: number;
  }>;
}

export default function TopicModelingPage() {
  const [chatData, setChatData] = useState<any>(null);
  const [topicData, setTopicData] = useState<TopicData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChatData = async () => {
      try {
        const data = await chatStorage.getChatData();
        if (data) {
          setChatData(data);
        }
      } catch (err) {
        console.error('Error loading chat data:', err);
        setError('Failed to load chat data');
      }
    };

    loadChatData();
  }, []);

  const handleAnalyzeTopics = async () => {
    if (!chatData) return;

    setIsLoading(true);
    setError(null);

    try {
      const analysis = await analyzeTopicsWithMistral(chatData.messages);
      setTopicData(analysis);
    } catch (err) {
      console.error('Topic analysis error:', err);
      setError('Failed to analyze topics. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!chatData) {
    return (
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Topic Modeling</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No chat data available. Please upload a chat file first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Topic Modeling</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Discover recurring themes and conversation patterns in your chat
        </p>
        
        {!topicData && (
          <button
            onClick={handleAnalyzeTopics}
            disabled={isLoading}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Analyzing Topics...' : 'Analyze Topics'}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Analyzing conversation topics...</p>
        </div>
      )}

      {topicData && (
        <div className="space-y-8">
          {/* Main Topics */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Main Conversation Topics</h3>
            <div className="space-y-6">
              {topicData.mainTopics.map((topic, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">#{index + 1}</span>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{topic.topic}</h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">({topic.frequency} mentions)</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{topic.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {topic.keywords.map((keyword, keywordIndex) => (
                          <span key={keywordIndex} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Participant Interest */}
                  <div className="mt-4">
                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Participant Interest</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {topic.participantInterest.map((participant, participantIndex) => (
                        <div key={participantIndex} className="bg-white dark:bg-gray-600 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{participant.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{participant.messageCount} msgs</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-500 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${participant.interest}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{participant.interest}% interest</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversation Themes */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Conversation Themes</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {topicData.conversationThemes.map((theme, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{theme.theme}</h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{theme.timePeriod}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{theme.description}</p>
                  
                  {theme.keyMessages.length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Key Messages</h5>
                      <div className="space-y-1">
                        {theme.keyMessages.slice(0, 3).map((message, messageIndex) => (
                          <div key={messageIndex} className="text-xs text-gray-600 dark:text-gray-400 italic">
                            &ldquo;{message.length > 50 ? message.substring(0, 50) + '...' : message}&rdquo;
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Participants:</span>
                    {theme.participants.map((participant, participantIndex) => (
                      <span key={participantIndex} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                        {participant}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Topic Evolution */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Topic Evolution Over Time</h3>
            <div className="space-y-4">
              {topicData.topicEvolution.map((evolution, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900 dark:text-white">{evolution.period}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h5 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">Dominant Topics</h5>
                      <div className="space-y-1">
                        {evolution.dominantTopics.map((topic, topicIndex) => (
                          <div key={topicIndex} className="text-xs text-gray-600 dark:text-gray-400">• {topic}</div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">New Topics</h5>
                      <div className="space-y-1">
                        {evolution.newTopics.map((topic, topicIndex) => (
                          <div key={topicIndex} className="text-xs text-gray-600 dark:text-gray-400">• {topic}</div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-2">Fading Topics</h5>
                      <div className="space-y-1">
                        {evolution.fadingTopics.map((topic, topicIndex) => (
                          <div key={topicIndex} className="text-xs text-gray-600 dark:text-gray-400">• {topic}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Participant Topic Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Participant Topic Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topicData.participantTopicPreferences.map((participant, index) => (
                <div key={participant.name} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900 dark:text-white">{participant.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">#{index + 1}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-1">Favorite Topics</h5>
                      <div className="space-y-1">
                        {participant.favoriteTopics.map((topic, topicIndex) => (
                          <div key={topicIndex} className="text-xs text-gray-600 dark:text-gray-400">• {topic}</div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1">Least Favorite</h5>
                      <div className="space-y-1">
                        {participant.leastFavoriteTopics.map((topic, topicIndex) => (
                          <div key={topicIndex} className="text-xs text-gray-600 dark:text-gray-400">• {topic}</div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Topic Diversity:</span>
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">{participant.topicDiversity.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Re-analyze button */}
          <div className="text-center">
            <button
              onClick={handleAnalyzeTopics}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Re-analyzing...' : 'Re-analyze Topics'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 