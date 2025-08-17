'use client';

import { useState, useEffect } from 'react';
import { chatStorage } from '@/utils/storage';
import { analyzeResponseTimesWithMistral } from '@/utils/mistralAI';

interface ResponseTimeData {
  overallStats: {
    averageResponseTime: number;
    fastestResponse: number;
    slowestResponse: number;
    totalResponses: number;
  };
  participantResponseTimes: Array<{
    name: string;
    averageResponseTime: number;
    fastestResponse: number;
    slowestResponse: number;
    totalResponses: number;
    responseTimeDistribution: {
      immediate: number; // 0-1 minute
      quick: number; // 1-5 minutes
      normal: number; // 5-30 minutes
      slow: number; // 30+ minutes
    };
    preferredResponseTimes: string[];
    responsePatterns: string[];
  }>;
  responseTimeTrends: Array<{
    period: string;
    averageResponseTime: number;
    fastestResponder: string;
    slowestResponder: string;
    trend: string; // "improving", "declining", "stable"
  }>;
  conversationPairs: Array<{
    initiator: string;
    responder: string;
    averageResponseTime: number;
    responseCount: number;
    relationship: string; // "very responsive", "moderate", "slow"
  }>;
  responseTimeInsights: Array<{
    insight: string;
    description: string;
    participants: string[];
    examples: string[];
  }>;
}

export default function ResponseTimeAnalysisPage() {
  const [chatData, setChatData] = useState<any>(null);
  const [responseTimeData, setResponseTimeData] = useState<ResponseTimeData | null>(null);
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

  const handleAnalyzeResponseTimes = async () => {
    if (!chatData) return;

    setIsLoading(true);
    setError(null);

    try {
      const analysis = await analyzeResponseTimesWithMistral(chatData.messages);
      setResponseTimeData(analysis);
    } catch (err) {
      console.error('Response time analysis error:', err);
      setError('Failed to analyze response times. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!chatData) {
    return (
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Response Time Analysis</h2>
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
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Response Time Analysis</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Analyze who responds fastest and understand response patterns
        </p>
        
        {!responseTimeData && (
          <button
            onClick={handleAnalyzeResponseTimes}
            disabled={isLoading}
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Analyzing Response Times...' : 'Analyze Response Times'}
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Analyzing response times...</p>
        </div>
      )}

      {responseTimeData && (
        <div className="space-y-8">
          {/* Overall Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Overall Response Time Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {responseTimeData.overallStats.averageResponseTime.toFixed(1)}m
                </div>
                <div className="text-gray-600 dark:text-gray-400">Average Response</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {responseTimeData.overallStats.fastestResponse.toFixed(1)}m
                </div>
                <div className="text-gray-600 dark:text-gray-400">Fastest Response</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                  {responseTimeData.overallStats.slowestResponse.toFixed(1)}m
                </div>
                <div className="text-gray-600 dark:text-gray-400">Slowest Response</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {responseTimeData.overallStats.totalResponses}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Total Responses</div>
              </div>
            </div>
          </div>

          {/* Participant Response Times */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Participant Response Times</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {responseTimeData.participantResponseTimes.map((participant, index) => (
                <div key={participant.name} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900 dark:text-white">{participant.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">#{index + 1}</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Avg Response:</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">{participant.averageResponseTime.toFixed(1)}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Fastest:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">{participant.fastestResponse.toFixed(1)}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Slowest:</span>
                      <span className="font-medium text-red-600 dark:text-red-400">{participant.slowestResponse.toFixed(1)}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Responses:</span>
                      <span className="font-medium text-purple-600 dark:text-purple-400">{participant.totalResponses}</span>
                    </div>
                  </div>
                  
                  {/* Response Time Distribution */}
                  <div className="mt-3">
                    <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Response Distribution</h5>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Immediate (≤1m):</span>
                        <span className="font-medium text-green-600 dark:text-green-400">{participant.responseTimeDistribution.immediate}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Quick (1-5m):</span>
                        <span className="font-medium text-blue-600 dark:text-blue-400">{participant.responseTimeDistribution.quick}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Normal (5-30m):</span>
                        <span className="font-medium text-orange-600 dark:text-orange-400">{participant.responseTimeDistribution.normal}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Slow (30m+):</span>
                        <span className="font-medium text-red-600 dark:text-red-400">{participant.responseTimeDistribution.slow}</span>
                      </div>
                    </div>
                  </div>
                  
                  {participant.preferredResponseTimes.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Preferred Times:</div>
                      <div className="flex flex-wrap gap-1">
                        {participant.preferredResponseTimes.map((time, timeIndex) => (
                          <span key={timeIndex} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full">
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

          {/* Response Time Trends */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Response Time Trends</h3>
            <div className="space-y-4">
              {responseTimeData.responseTimeTrends.map((trend, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900 dark:text-white">{trend.period}</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      trend.trend === 'improving' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                      trend.trend === 'declining' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}>
                      {trend.trend}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Avg Response:</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">{trend.averageResponseTime.toFixed(1)}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Fastest:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">{trend.fastestResponder}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Slowest:</span>
                      <span className="font-medium text-red-600 dark:text-red-400">{trend.slowestResponder}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversation Pairs */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Conversation Pair Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {responseTimeData.conversationPairs.map((pair, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-center flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{pair.initiator}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">→</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{pair.responder}</div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">#{index + 1}</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Avg Response:</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">{pair.averageResponseTime.toFixed(1)}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Responses:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">{pair.responseCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Relationship:</span>
                      <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                        pair.relationship === 'very responsive' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                        pair.relationship === 'moderate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {pair.relationship}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Response Time Insights */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Response Time Insights</h3>
            <div className="space-y-4">
              {responseTimeData.responseTimeInsights.map((insight, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">#{index + 1}</span>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{insight.insight}</h4>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{insight.description}</p>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Participants:</span>
                        {insight.participants.map((participant, participantIndex) => (
                          <span key={participantIndex} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                            {participant}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {insight.examples.length > 0 && (
                    <div>
                      <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Examples</h5>
                      <div className="space-y-1">
                        {insight.examples.slice(0, 2).map((example, exampleIndex) => (
                          <div key={exampleIndex} className="text-xs text-gray-600 dark:text-gray-400 italic">
                            &ldquo;{example.length > 60 ? example.substring(0, 60) + '...' : example}&rdquo;
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Re-analyze button */}
          <div className="text-center">
            <button
              onClick={handleAnalyzeResponseTimes}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Re-analyzing...' : 'Re-analyze Response Times'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 