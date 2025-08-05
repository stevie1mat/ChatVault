'use client';

import { useMemo, useState, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import ChatMessage from './ChatMessage';

interface ChatViewProps {
  messages: ChatMessageType[];
}

interface MessageGroup {
  date: string;
  messages: ChatMessageType[];
}

export default function ChatView({ messages }: ChatViewProps) {
  const [displayedMessages, setDisplayedMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const MESSAGES_PER_BATCH = 100;

  // Process messages in batches for large datasets
  useEffect(() => {
    if (messages.length === 0) {
      setDisplayedMessages([]);
      setHasMore(false);
      return;
    }

    setIsLoading(true);
    
    // Use setTimeout to avoid blocking the UI
    const timer = setTimeout(() => {
      const initialBatch = messages.slice(0, MESSAGES_PER_BATCH);
      setDisplayedMessages(initialBatch);
      setHasMore(messages.length > MESSAGES_PER_BATCH);
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [messages]);

  const loadMoreMessages = () => {
    if (!hasMore || isLoading) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const currentLength = displayedMessages.length;
      const nextBatch = messages.slice(currentLength, currentLength + MESSAGES_PER_BATCH);
      setDisplayedMessages(prev => [...prev, ...nextBatch]);
      setHasMore(currentLength + MESSAGES_PER_BATCH < messages.length);
      setIsLoading(false);
    }, 0);
  };

  const messageGroups = useMemo(() => {
    const groups: MessageGroup[] = [];
    let currentGroup: MessageGroup | null = null;

    displayedMessages.forEach((message) => {
      const dateStr = message.timestamp.toLocaleDateString();
      
      if (!currentGroup || currentGroup.date !== dateStr) {
        currentGroup = {
          date: dateStr,
          messages: []
        };
        groups.push(currentGroup);
      }
      
      currentGroup.messages.push(message);
    });

    return groups;
  }, [displayedMessages]);

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-4">💬</div>
          <p>No messages to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {messageGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="space-y-2">
          {/* Date separator */}
          <div className="flex items-center justify-center">
            <div className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-600 dark:text-gray-400">
              {group.date}
            </div>
          </div>
          
          {/* Messages for this date */}
          <div className="space-y-1">
            {group.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        </div>
      ))}
      
      {/* Load more button */}
      {hasMore && (
        <div className="flex justify-center py-4">
          <button
            onClick={loadMoreMessages}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Loading...' : `Load More (${messages.length - displayedMessages.length} remaining)`}
          </button>
        </div>
      )}
      
      {/* Show total count */}
      {!hasMore && displayedMessages.length > 0 && (
        <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
          Showing all {displayedMessages.length} messages
        </div>
      )}
    </div>
  );
} 