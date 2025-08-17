'use client';

import { ChatMessage } from '@/types/chat';

interface AISearchResultsProps {
  results: ChatMessage[];
  onJumpToMessage: (message: ChatMessage) => void;
  searchReasons?: {[key: string]: string};
}

export default function AISearchResults({ results, onJumpToMessage, searchReasons }: AISearchResultsProps) {
  if (results.length === 0) return null;

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          🤖 AI Search Results ({results.length})
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Click on any message to jump to it in the chat
        </p>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {results.map((message, index) => (
          <div
            key={`${message.timestamp.getTime()}-${index}`}
            onClick={() => onJumpToMessage(message)}
            className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {message.sender}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                  {message.content}
                </p>
                {searchReasons && searchReasons[message.id] && (
                  <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                    💡 {searchReasons[message.id]}
                  </div>
                )}
              </div>
              <div className="ml-3 text-xs text-gray-400 dark:text-gray-500">
                #{index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-b-xl">
        <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
          💡 Tip: Use natural language queries like &ldquo;when did we discuss the project?&rdquo; or &ldquo;find messages about dinner plans&rdquo;
        </div>
      </div>
    </div>
  );
} 