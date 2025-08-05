export interface ChatMessage {
  id: string;
  timestamp: Date;
  sender: string;
  content: string;
  isOwnMessage: boolean;
}

export interface ChatData {
  messages: ChatMessage[];
  participants: string[];
  startDate: Date;
  endDate: Date;
}

export interface SearchFilters {
  keyword: string;
  startDate: Date | null;
  endDate: Date | null;
  timeRange: {
    start: string;
    end: string;
  } | null;
  sender: string | null;
}

export interface ParsedChatData {
  messages: ChatMessage[];
  participants: string[];
  totalMessages: number;
  dateRange: {
    start: Date;
    end: Date;
  };
} 