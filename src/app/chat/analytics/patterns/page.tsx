'use client';

import { useState, useEffect } from 'react';
import { chatStorage } from '@/utils/storage';
import { analyzePatternsWithMistral } from '@/utils/mistralAI';

interface PatternData {
  conversationInitiators: Array<{
    name: string;
    initiationCount: number;
    percentage: number;
    averageTime: string;
    preferredTimes: string[];
  }>;
  conversationFlow: Array<{
    pattern: string;
    description: string;
    frequency: number;
    participants: string[];
    examples: string[];
  }>;
  communicationStyles: Array<{
    name: string;
    style: string;
    characteristics: string[];
    messageLength: string;
    responseTime: string;
    emojiUsage: string;
  }>;
  interactionPatterns: Array<{
    pattern: string;
    description: string;
    strength: number;
    participants: string[];
    timeOfDay: string;
  }>;
  conversationDynamics: {
    mostEngaged: string;
    leastEngaged: string;
    conversationStarters: string[];
    conversationEnders: string[];
    peakInteractionTimes: string[];
  };
}

export default function ConversationPatternsPage() {
  const [chatData, setChatData] = useState<any>(null);
  const [patternData, setPatternData] = useState<PatternData | null>(null);
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

  const handleAnalyzePatterns = async () => {
    if (!chatData) return;

    setIsLoading(true);
    setError(null);

    try {
      const analysis = await analyzePatternsWithMistral(chatData.messages);
      setPatternData(analysis);
    } catch (err) {
      console.error('Pattern analysis error:', err);
      setError('Failed to analyze patterns. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!chatData) {
    return (
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Conversation Patterns</h2>
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
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Conversation Patterns</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Discover who initiates conversations and analyze communication patterns
        </p>
        
        {!patternData && (
          <button
            onClick={handleAnalyzePatterns}
            disabled={isLoading}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Analyzing Patterns...' : 'Analyze Patterns'}
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Analyzing conversation patterns...</p>
        </div>
      )}

      {patternData && (
        <div className="space-y-8">
          {/* Conversation Initiators */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Conversation Initiators</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {patternData.conversationInitiators.map((initiator, index) => (
                <div key={initiator.name} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900 dark:text-white">{initiator.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">#{index + 1}</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Initiations:</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">{initiator.initiationCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Percentage:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">{initiator.percentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Avg Time:</span>
                      <span className="font-medium text-purple-600 dark:text-purple-400">{initiator.averageTime}</span>
                    </div>
                  </div>
                  
                  {initiator.preferredTimes.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Preferred Times:</div>
                      <div className="flex flex-wrap gap-1">
                        {initiator.preferredTimes.map((time, timeIndex) => (
                          <span key={timeIndex} className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-full">
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Conversation Flow */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Conversation Flow Patterns</h3>
            <div className="space-y-4">
              {patternData.conversationFlow.map((flow, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">#{index + 1}</span>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{flow.pattern}</h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">({flow.frequency} times)</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{flow.description}</p>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Participants:</span>
                        {flow.participants.map((participant, participantIndex) => (
                          <span key={participantIndex} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                            {participant}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {flow.examples.length > 0 && (
                    <div>
                      <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Examples</h5>
                      <div className="space-y-1">
                        {flow.examples.slice(0, 2).map((example, exampleIndex) => (
                          <div key={exampleIndex} className="text-xs text-gray-600 dark:text-gray-400 italic">
                            "{example.length > 60 ? example.substring(0, 60) + '...' : example}"
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Communication Styles */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Communication Styles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patternData.communicationStyles.map((style, index) => (
                <div key={style.name} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900 dark:text-white">{style.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">#{index + 1}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">Style</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{style.style}</p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-1">Characteristics</h5>
                      <div className="space-y-1">
                        {style.characteristics.map((characteristic, charIndex) => (
                          <div key={charIndex} className="text-xs text-gray-600 dark:text-gray-400">• {characteristic}</div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Message Length:</span>
                        <span className="font-medium text-purple-600 dark:text-purple-400">{style.messageLength}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Response Time:</span>
                        <span className="font-medium text-orange-600 dark:text-orange-400">{style.responseTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Emoji Usage:</span>
                        <span className="font-medium text-pink-600 dark:text-pink-400">{style.emojiUsage}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interaction Patterns */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Interaction Patterns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patternData.interactionPatterns.map((pattern, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{pattern.pattern}</h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">#{index + 1}</span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{pattern.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Strength:</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">{pattern.strength}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Time of Day:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">{pattern.timeOfDay}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Participants:</div>
                    <div className="flex flex-wrap gap-1">
                      {pattern.participants.map((participant, participantIndex) => (
                        <span key={participantIndex} className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-full">
                          {participant}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversation Dynamics */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Conversation Dynamics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {patternData.conversationDynamics.mostEngaged}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Most Engaged</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                  {patternData.conversationDynamics.leastEngaged}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Least Engaged</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {patternData.conversationDynamics.peakInteractionTimes.length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Peak Times</div>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <h5 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Conversation Starters</h5>
                <div className="flex flex-wrap gap-2">
                  {patternData.conversationDynamics.conversationStarters.map((starter, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                      {starter}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-2">Conversation Enders</h5>
                <div className="flex flex-wrap gap-2">
                  {patternData.conversationDynamics.conversationEnders.map((ender, index) => (
                    <span key={index} className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-full">
                      {ender}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-2">Peak Interaction Times</h5>
                <div className="flex flex-wrap gap-2">
                  {patternData.conversationDynamics.peakInteractionTimes.map((time, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Re-analyze button */}
          <div className="text-center">
            <button
              onClick={handleAnalyzePatterns}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Re-analyzing...' : 'Re-analyze Patterns'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 