import { ChatMessage, ParsedChatData } from '@/types/chat';

// WhatsApp chat export format regex - updated to handle multiple formats
const MESSAGE_REGEX = /\[?(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2})\s*[AP]?M?\]?\s*-\s*(.+?):\s+(.+)/;
const MESSAGE_REGEX_ALT = /(\d{1,2}\/\d{1,2}\/\d{2,4}),\s+(\d{1,2}:\d{2}\s*[AP]M)\s+(.+?):\s+(.+)/;

export function parseWhatsAppChat(content: string): ParsedChatData {
  const lines = content.split('\n').filter(line => line.trim());
  const messages: ChatMessage[] = [];
  const participants = new Set<string>();
  
  let earliestDate = new Date();
  let latestDate = new Date(0);

  lines.forEach((line, index) => {
    // Skip system messages and media messages
    if (line.includes('Messages and calls are end-to-end encrypted') ||
        line.includes('This message was deleted') ||
        line.includes('<Media omitted>') ||
        line.includes('null')) {
      return;
    }

    // Try both regex patterns
    let match = line.match(MESSAGE_REGEX);
    if (!match) {
      match = line.match(MESSAGE_REGEX_ALT);
    }
    
    if (match) {
      const [, dateStr, timeStr, sender, content] = match;
      
      // Parse date and time
      const [day, month, year] = dateStr.split('/').map(Number);
      const [hours, minutes] = timeStr.split(':').map(Number);
      
      // Handle different time formats
      let hour = hours;
      if (timeStr.includes('PM') && hours !== 12) hour += 12;
      if (timeStr.includes('AM') && hours === 12) hour = 0;
      
      // Handle year format (YY vs YYYY)
      const fullYear = year < 100 ? 2000 + year : year;
      
      const timestamp = new Date(fullYear, month - 1, day, hour, minutes);
      
      // Determine if it's the user's own message (you can customize this logic)
      const isOwnMessage = sender.toLowerCase().includes('you') || 
                          sender.toLowerCase().includes('me') ||
                          sender.toLowerCase().includes('your name') ||
                          sender.toLowerCase().includes('steven mathew'); // Add your name here
      
      const message: ChatMessage = {
        id: `msg-${index}`,
        timestamp,
        sender: sender.trim(),
        content: content.trim(),
        isOwnMessage
      };
      
      messages.push(message);
      participants.add(sender.trim());
      
      // Track date range
      if (timestamp < earliestDate) earliestDate = timestamp;
      if (timestamp > latestDate) latestDate = timestamp;
    }
  });

  return {
    messages: messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
    participants: Array.from(participants),
    totalMessages: messages.length,
    dateRange: {
      start: earliestDate,
      end: latestDate
    }
  };
}

export function filterMessages(
  messages: ChatMessage[],
  filters: {
    keyword?: string;
    startDate?: Date | null;
    endDate?: Date | null;
    timeRange?: { start: string; end: string } | null;
    sender?: string | null;
  }
): ChatMessage[] {
  return messages.filter(message => {
    // Keyword filter
    if (filters.keyword && !message.content.toLowerCase().includes(filters.keyword.toLowerCase())) {
      return false;
    }
    
    // Date range filter
    if (filters.startDate && message.timestamp < filters.startDate) {
      return false;
    }
    
    if (filters.endDate && message.timestamp > filters.endDate) {
      return false;
    }
    
    // Time range filter
    if (filters.timeRange) {
      const messageHour = message.timestamp.getHours();
      const startHour = parseInt(filters.timeRange.start.split(':')[0]);
      const endHour = parseInt(filters.timeRange.end.split(':')[0]);
      
      if (messageHour < startHour || messageHour > endHour) {
        return false;
      }
    }
    
    // Sender filter
    if (filters.sender && message.sender !== filters.sender) {
      return false;
    }
    
    return true;
  });
}

export function exportChatToTxt(messages: ChatMessage[]): string {
  return messages
    .map(msg => {
      const dateStr = msg.timestamp.toLocaleDateString();
      const timeStr = msg.timestamp.toLocaleTimeString();
      return `[${dateStr}, ${timeStr}] ${msg.sender}: ${msg.content}`;
    })
    .join('\n');
}

export function exportChatToJson(messages: ChatMessage[]): string {
  return JSON.stringify(messages, null, 2);
} 