'use client';

import { useState } from 'react';
import { ChatMessage } from '@/types/chat';
import { searchWithMistralAI, fallbackSearch, MistralSearchResult, MistralAIResponse } from '@/utils/mistralAI';

interface AISearchProps {
  messages: ChatMessage[];
  onSearchResults: (results: ChatMessage[], reasons?: {[key: string]: string}, answer?: string) => void;
  onClearSearch: () => void;
}

export default function AISearch({ messages, onSearchResults, onClearSearch }: AISearchProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ChatMessage[]>([]);
  const [searchReasons, setSearchReasons] = useState<{[key: string]: string}>({});
  const [aiAnswer, setAiAnswer] = useState<string>('');
  const [apiError, setApiError] = useState<string | null>(null);

  const performAISearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setApiError(null);
    
    try {
      // Try to use Mistral AI API first
      const aiResponse = await searchWithMistralAI(query, messages);
      
      // Map AI results back to actual messages
      const messageMap = new Map(messages.map(msg => [msg.id, msg]));
      const foundMessages: ChatMessage[] = [];
      const reasons: {[key: string]: string} = {};
      
      aiResponse.relevantMessages.forEach(result => {
        const message = messageMap.get(result.messageId);
        if (message) {
          foundMessages.push(message);
          reasons[message.id] = result.reason;
        }
      });
      
      setSearchResults(foundMessages);
      setSearchReasons(reasons);
      setAiAnswer(aiResponse.answer);
      onSearchResults(foundMessages, reasons, aiResponse.answer);
      
    } catch (error) {
      console.error('Mistral AI search error:', error);
      
              // Fallback to local search if API fails
        try {
          const fallbackResults = fallbackSearch(query, messages);
          const messageMap = new Map(messages.map(msg => [msg.id, msg]));
          const foundMessages: ChatMessage[] = [];
          const reasons: {[key: string]: string} = {};
          
          fallbackResults.forEach(result => {
            const message = messageMap.get(result.messageId);
            if (message) {
              foundMessages.push(message);
              reasons[message.id] = result.reason;
            }
          });
          
          setSearchResults(foundMessages);
          setSearchReasons(reasons);
          setAiAnswer("I couldn't find specific information, but here are some relevant messages:");
          onSearchResults(foundMessages, reasons, "I couldn't find specific information, but here are some relevant messages:");
          setApiError('Using fallback search (Mistral AI unavailable)');
        
      } catch (fallbackError) {
        console.error('Fallback search error:', fallbackError);
        setApiError('Search failed. Please try again.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performAISearch();
  };

  const handleClear = () => {
    setQuery('');
    setSearchResults([]);
    setSearchReasons({});
    setAiAnswer('');
    setApiError(null);
    onClearSearch();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask AI to find messages... (e.g., 'when did we plan the meeting?', 'find messages about dinner')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Searching...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>🤖</span>
                  <span>AI Search</span>
                </div>
              )}
            </button>
          </form>
        </div>
        
        {searchResults.length > 0 && (
          <button
            onClick={handleClear}
            className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      
      {apiError && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600 dark:text-yellow-400">⚠️</span>
            <span className="text-sm text-yellow-800 dark:text-yellow-200">{apiError}</span>
          </div>
        </div>
      )}
      
      {aiAnswer && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
          <div className="flex items-start space-x-3">
            <span className="text-green-600 dark:text-green-400 text-lg">🤖</span>
            <div className="flex-1">
              <div className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                AI Answer:
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                {aiAnswer}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {searchResults.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              🤖 AI found {searchResults.length} relevant messages
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400">
              Query: &ldquo;{query}&rdquo;
            </span>
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            Click on messages below to jump to them in the chat
          </div>
        </div>
      )}
    </div>
  );
} 