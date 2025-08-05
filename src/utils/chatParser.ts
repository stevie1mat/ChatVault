import { ChatMessage, ParsedChatData } from '@/types/chat';

// WhatsApp chat export format regex - updated to handle multiple formats
const MESSAGE_REGEX = /\[?(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2})\s*[AP]?M?\]?\s*-\s*(.+?):\s+(.+)/;
const MESSAGE_REGEX_ALT = /(\d{1,2}\/\d{1,2}\/\d{2,4}),\s+(\d{1,2}:\d{2}\s*[AP]M)\s+(.+?):\s+(.+)/;
const MESSAGE_REGEX_NEW = /(\d{1,2}\/\d{1,2}\/\d{2,4}),\s+(\d{1,2}:\d{2}\s*[AP]M)\s*-\s*(.+?):\s+(.+)/;
const MESSAGE_REGEX_FLEXIBLE = /(\d{1,2}\/\d{1,2}\/\d{2,4}),\s+(\d{1,2}:\d{2}\s*[ap]m)\s*-\s*(.+?):\s+(.+)/;
const MESSAGE_REGEX_SPACE = /(\d{1,2}\/\d{1,2}\/\d{2,4}),\s+(\d{1,2}:\d{2}\s+[ap]m)\s*-\s*(.+?):\s+(.+)/;

export function parseWhatsAppChat(content: string): ParsedChatData {
  const lines = content.split('\n').filter(line => line.trim());
  const messages: ChatMessage[] = [];
  const participants = new Set<string>();
  
  let earliestDate = new Date();
  let latestDate = new Date(0);
  
  console.log('🔍 Parsing WhatsApp chat...');
  console.log('📝 Total lines:', lines.length);
  
  // Debug: Show first few lines to understand format
  console.log('📋 First 5 lines:');
  lines.slice(0, 5).forEach((line, i) => {
    console.log(`  ${i + 1}: "${line}"`);
  });

  lines.forEach((line, index) => {
    // Skip system messages and media messages
    if (line.includes('Messages and calls are end-to-end encrypted') ||
        line.includes('This message was deleted') ||
        line.includes('<Media omitted>') ||
        line.includes('null') ||
        line.includes('Your security code') ||
        line.includes('is a contact') ||
        line.includes('changed. Tap to learn more') ||
        line.includes('Learn more')) {
      return;
    }

    // Debug: Log the line being processed
    console.log(`🔍 Processing line ${index}: "${line}"`);

    // Try all regex patterns
    let match = line.match(MESSAGE_REGEX);
    if (!match) {
      match = line.match(MESSAGE_REGEX_ALT);
    }
    if (!match) {
      match = line.match(MESSAGE_REGEX_NEW);
    }
    if (!match) {
      match = line.match(MESSAGE_REGEX_FLEXIBLE);
    }
    if (!match) {
      match = line.match(MESSAGE_REGEX_SPACE);
    }
    
    if (!match) {
      console.log(`❌ No match found for line: "${line}"`);
    }
    
    if (match) {
      const [, dateStr, timeStr, sender, content] = match;
      
      // Parse date and time
      const [first, second, year] = dateStr.split('/').map(Number);
      
      // Handle time parsing with potential space before am/pm
      const timeParts = timeStr.split(':');
      const hours = parseInt(timeParts[0]);
      const minutesAndPeriod = timeParts[1];
      const minutes = parseInt(minutesAndPeriod.split(/\s+/)[0]); // Split by whitespace to handle "45 pm"
      
      // Validate parsed values
      if (isNaN(first) || isNaN(second) || isNaN(year) || isNaN(hours) || isNaN(minutes)) {
        console.warn(`⚠️ Invalid date/time values: ${dateStr} ${timeStr} (first: ${first}, second: ${second}, year: ${year}, hours: ${hours}, minutes: ${minutes}), skipping message`);
        return;
      }
      
      // Try different date formats (DD/MM/YYYY vs MM/DD/YYYY)
      let day, month;
      let timestamp;
      
      // Try DD/MM/YYYY format first
      day = first;
      month = second;
      let fullYear = year < 100 ? 2000 + year : year;
      
      // Handle different time formats
      let hour = hours;
      if (timeStr.includes('PM') && hours !== 12) hour += 12;
      if (timeStr.includes('AM') && hours === 12) hour = 0;
      
      timestamp = new Date(fullYear, month - 1, day, hour, minutes);
      
      // If that's invalid, try MM/DD/YYYY format
      if (isNaN(timestamp.getTime())) {
        console.log(`🔄 Trying MM/DD/YYYY format for: ${dateStr} ${timeStr}`);
        month = first;
        day = second;
        timestamp = new Date(fullYear, month - 1, day, hour, minutes);
      } else {
        console.log(`✅ Using DD/MM/YYYY format for: ${dateStr} ${timeStr}`);
      }
      
      // If still invalid, try adjusting the year (maybe it's a typo)
      if (isNaN(timestamp.getTime())) {
        console.log(`🔄 Trying with adjusted year for: ${dateStr} ${timeStr}`);
        // Try with 2023 instead of 2024 (common typo)
        fullYear = 2023;
        timestamp = new Date(fullYear, month - 1, day, hour, minutes);
      }
      
      // Validate the timestamp
      if (isNaN(timestamp.getTime())) {
        console.warn(`⚠️ Invalid date parsed: ${dateStr} ${timeStr}, skipping message`);
        return;
      }
      
      // Log the successfully parsed timestamp for debugging
      console.log(`✅ Successfully parsed: ${dateStr} ${timeStr} → ${timestamp.toISOString()}`);
      
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
      
      console.log(`✅ Parsed message: ${sender} - ${content.substring(0, 50)}...`);
    }
  });

  console.log(`📊 Parsing complete: ${messages.length} messages, ${participants.size} participants`);
  
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
  // Early return if no filters applied
  const hasFilters = filters.keyword || filters.startDate || filters.endDate || filters.timeRange || filters.sender;
  if (!hasFilters) {
    return messages;
  }

  // Pre-compile keyword for case-insensitive search
  const keywordLower = filters.keyword?.toLowerCase();
  
  return messages.filter(message => {
    // Keyword filter - early return if no match
    if (keywordLower && !message.content.toLowerCase().includes(keywordLower)) {
      return false;
    }
    
    // Date range filter - early return if out of range
    if (filters.startDate && message.timestamp < filters.startDate) {
      return false;
    }
    
    if (filters.endDate && message.timestamp > filters.endDate) {
      return false;
    }
    
    // Time range filter - early return if out of range
    if (filters.timeRange && filters.timeRange.start) {
      const messageHour = message.timestamp.getHours();
      const filterHour = parseInt(filters.timeRange.start.split(':')[0]);
      
      if (messageHour !== filterHour) {
        return false;
      }
    }
    
    // Sender filter - early return if no match
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