'use client';

import { useState, useEffect } from 'react';
import { chatStorage } from '@/utils/storage';
import { analyzeSentimentWithMistral } from '@/utils/mistralAI';

interface SentimentData {
  overallSentiment: string;
  sentimentScore: number;
  emotionalTone: string;
  participantSentiments: Array<{
    name: string;
    sentiment: string;
    score: number;
    dominantEmotion: string;
    messageCount: number;
  }>;
  conversationPhases: Array<{
    period: string;
    sentiment: string;
    score: number;
    keyEvents: string[];
  }>;
  emotionalHighlights: Array<{
    message: string;
    sender: string;
    sentiment: string;
    score: number;
    timestamp: string;
  }>;
}

export default function SentimentAnalysisPage() {
  const [chatData, setChatData] = useState<any>(null);
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
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

  const handleAnalyzeSentiment = async () => {
    if (!chatData) return;

    setIsLoading(true);
    setError(null);

    try {
      const analysis = await analyzeSentimentWithMistral(chatData.messages);
      setSentimentData(analysis);
    } catch (err) {
      console.error('Sentiment analysis error:', err);
      setError('Failed to analyze sentiment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!chatData) {
    return (
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Sentiment Analysis</h2>
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
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Sentiment Analysis</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Analyze the emotional tone and sentiment patterns in your conversations
        </p>
        
        {!sentimentData && (
          <button
            onClick={handleAnalyzeSentiment}
            disabled={isLoading}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Analyzing Sentiment...' : 'Analyze Sentiment'}
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Analyzing conversation sentiment...</p>
        </div>
      )}

      {sentimentData && (
        <div className="space-y-8">
          {/* Overall Sentiment */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Overall Conversation Sentiment</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {sentimentData.overallSentiment}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Overall Tone</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {sentimentData.sentimentScore.toFixed(1)}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Sentiment Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {sentimentData.emotionalTone}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Emotional Tone</div>
              </div>
            </div>
          </div>

          {/* Participant Sentiments */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Participant Sentiment Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sentimentData.participantSentiments.map((participant, index) => (
                <div key={participant.name} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900 dark:text-white">{participant.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">#{index + 1}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Sentiment:</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">{participant.sentiment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Score:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">{participant.score.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Dominant Emotion:</span>
                      <span className="font-medium text-purple-600 dark:text-purple-400">{participant.dominantEmotion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Messages:</span>
                      <span className="font-medium text-orange-600 dark:text-orange-400">{participant.messageCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversation Phases */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Conversation Phases</h3>
            <div className="space-y-4">
              {sentimentData.conversationPhases.map((phase, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900 dark:text-white">{phase.period}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{phase.sentiment}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">({phase.score.toFixed(1)})</span>
                    </div>
                  </div>
                  {phase.keyEvents.length > 0 && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Key Events:</strong> {phase.keyEvents.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Emotional Highlights */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Emotional Highlights</h3>
            <div className="space-y-4">
              {sentimentData.emotionalHighlights.map((highlight, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">{highlight.sender}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{highlight.timestamp}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 italic">&ldquo;{highlight.message}&rdquo;</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400">{highlight.sentiment}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">({highlight.score.toFixed(1)})</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Re-analyze button */}
          <div className="text-center">
            <button
              onClick={handleAnalyzeSentiment}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Re-analyzing...' : 'Re-analyze Sentiment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 