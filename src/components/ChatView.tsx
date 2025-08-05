'use client';

import { useMemo } from 'react';
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
  const messageGroups = useMemo(() => {
    const groups: MessageGroup[] = [];
    let currentGroup: MessageGroup | null = null;

    messages.forEach((message) => {
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
  }, [messages]);

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
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
    </div>
  );
} 