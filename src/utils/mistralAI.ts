// Mistral AI API utility for intelligent chat search
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const MISTRAL_API_KEY = process.env.NEXT_PUBLIC_MISTRAL_API_KEY;

// Debug: Log API key status
console.log('🔑 Mistral API Key Status:', MISTRAL_API_KEY ? 'Configured' : 'Missing');
console.log('🔑 API Key Format:', MISTRAL_API_KEY ? (MISTRAL_API_KEY.startsWith('mist-') ? 'Valid format' : 'Invalid format - should start with mist-') : 'Missing');

export interface MistralSearchResult {
  messageId: string;
  relevanceScore: number;
  reason: string;
}

export interface MistralAIResponse {
  answer: string;
  relevantMessages: MistralSearchResult[];
}

export async function searchWithMistralAI(
  query: string, 
  messages: any[], 
  maxResults: number = 20
): Promise<MistralAIResponse> {
  if (!MISTRAL_API_KEY) {
    throw new Error('Mistral AI API key not configured');
  }

  // Let the AI decide what it needs - always provide full context
  let selectedMessages = messages;
  console.log('🔍 Providing full chat history to AI');
  
  // Prepare messages for the AI (simplified format with date info)
  let messageTexts = selectedMessages.map((msg, index) => {
    const date = msg.timestamp.toLocaleDateString();
    const time = msg.timestamp.toLocaleTimeString();
    return `[${msg.id}] ${msg.sender} (${date} ${time}): ${msg.content}`;
  }).join('\n');
  
  // If the prompt is too long, truncate it intelligently
  const maxPromptLength = 30000; // Leave room for response
  if (messageTexts.length > maxPromptLength) {
    console.log('📝 Prompt too long, truncating intelligently...');
    
    // If the prompt is too long, truncate intelligently but keep important parts
    if (true) {
      const messages = selectedMessages;
      const earlyMessages = messages.slice(0, 50); // First 50 messages
      const recentMessages = messages.slice(-50); // Last 50 messages
      
      const earlyText = earlyMessages.map((msg, index) => {
        const date = msg.timestamp.toLocaleDateString();
        const time = msg.timestamp.toLocaleTimeString();
        return `[${msg.id}] ${msg.sender} (${date} ${time}): ${msg.content}`;
      }).join('\n');
      
      const recentText = recentMessages.map((msg, index) => {
        const date = msg.timestamp.toLocaleDateString();
        const time = msg.timestamp.toLocaleTimeString();
        return `[${msg.id}] ${msg.sender} (${date} ${time}): ${msg.content}`;
      }).join('\n');
      
      messageTexts = `[EARLY MESSAGES]\n${earlyText}\n\n[RECENT MESSAGES]\n${recentText}`;
    } else {
      // For non-temporal queries, just use recent messages
      messageTexts = selectedMessages.slice(-50).map((msg, index) => {
        const date = msg.timestamp.toLocaleDateString();
        const time = msg.timestamp.toLocaleTimeString();
        return `[${msg.id}] ${msg.sender} (${date} ${time}): ${msg.content}`;
      }).join('\n');
    }
  }

  const prompt = `Analyze this WhatsApp chat and answer the user's question: "${query}"

IMPORTANT: Provide a direct, conversational answer like you're chatting with the user. Don't just list messages.

Examples:
- "who said i love you first" → Answer: "Baccha said 'I love you' first on [date] at [time]"
- "who messaged first" → Answer: "Baccha sent the first message on [date] at [time]"
- "when did we discuss dinner" → Answer: "You discussed dinner on [date] at [time]"

Chat messages (in chronological order):
${messageTexts}

Provide a direct answer to the user's question. If you find relevant information, give a conversational response. If no relevant information is found, say "I couldn't find any information about that in the chat."

Return your answer as a JSON object with this format:
{
  "answer": "Your direct answer to the user's question",
  "relevantMessages": [
    {"messageId": "id", "relevanceScore": 0.95, "reason": "why this message supports the answer"}
  ]
}`;

  try {
    console.log('🔍 Calling Mistral AI API...');
    console.log('📝 Prompt length:', prompt.length, 'characters');
    console.log('🔑 API Key:', MISTRAL_API_KEY ? 'Present' : 'Missing');
    
    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mistral API error response:', errorText);
      throw new Error(`Mistral AI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Mistral API response:', data);
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from Mistral AI');
    }

    // Parse the JSON response from the AI
    try {
      // Try to extract JSON from the response (AI might wrap JSON in text or markdown)
      let jsonResponse = aiResponse;
      
      // Remove markdown code blocks if present
      if (aiResponse.includes('```json')) {
        jsonResponse = aiResponse.replace(/```json\n?/, '').replace(/```\n?/, '');
      } else if (aiResponse.includes('```')) {
        jsonResponse = aiResponse.replace(/```\n?/, '').replace(/```\n?/, '');
      }
      
      // Look for JSON array in the response
      const jsonMatch = jsonResponse.match(/\[.*\]/);
      if (jsonMatch) {
        jsonResponse = jsonMatch[0];
      }
      
      const results = JSON.parse(jsonResponse);
      console.log('Parsed AI results:', results);
      
      // If AI returned empty array or no answer, use fallback
      if (Array.isArray(results) && results.length === 0) {
        console.log('AI found no relevant messages, using fallback search');
        const fallbackResults = fallbackSearch(query, messages);
        return {
          answer: "I couldn't find any specific information about that in the chat.",
          relevantMessages: fallbackResults
        };
      }
      
      // If results is an array (old format), convert to new format
      if (Array.isArray(results)) {
        return {
          answer: "Here are the relevant messages I found:",
          relevantMessages: results
        };
      }
      
      // New format with answer and relevantMessages
      return results;
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      console.log('Falling back to local search due to parsing error');
      const fallbackResults = fallbackSearch(query, messages);
      return {
        answer: "I couldn't parse the AI response properly, but here are some relevant messages:",
        relevantMessages: fallbackResults
      };
    }

  } catch (error) {
    console.error('Mistral AI API error:', error);
    throw error;
  }
}

// Fallback search function when API is not available
export function fallbackSearch(query: string, messages: any[]): MistralSearchResult[] {
  const searchTerms = query.toLowerCase().split(' ');
  const isTemporalQuery = query.toLowerCase().includes('first') || query.toLowerCase().includes('earliest');
  
  const scoredMessages = messages.map((message, index) => {
    const content = message.content.toLowerCase();
    const sender = message.sender.toLowerCase();
    
    let score = 0;
    let reason = '';
    
    // Check for "I love you" or similar expressions
    const loveExpressions = ['i love you', 'love you', 'i love u', 'love u'];
    const hasLoveExpression = loveExpressions.some(expr => content.includes(expr));
    
    // For temporal queries about love, prioritize actual love expressions
    if (isTemporalQuery && hasLoveExpression) {
      score += 15;
      reason = 'First love expression found';
    }
    
    // Exact phrase match
    if (content.includes(query.toLowerCase())) {
      score += 10;
      reason = 'Exact phrase match';
    }
    
    // Individual word matches
    const matchedTerms: string[] = [];
    searchTerms.forEach(term => {
      if (content.includes(term)) {
        score += 2;
        matchedTerms.push(term);
      }
      if (sender.includes(term)) {
        score += 1;
        matchedTerms.push(`sender:${term}`);
      }
    });
    
    if (matchedTerms.length > 0 && !reason) {
      reason = `Matched terms: ${matchedTerms.join(', ')}`;
    }
    
    // For temporal queries, prioritize chronological order (earlier messages get higher scores)
    if (isTemporalQuery) {
      const timeScore = (messages.length - index) / messages.length * 5; // Earlier messages get higher score
      score += timeScore;
    } else {
      // Time-based relevance (recent messages get slight boost for non-temporal queries)
      const daysAgo = (Date.now() - message.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      if (daysAgo < 30) score += 0.5;
    }
    
    return { 
      messageId: message.id, 
      score, 
      reason: reason || 'Partial match'
    };
  });
  
  return scoredMessages
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map(item => ({
      messageId: item.messageId,
      relevanceScore: item.score / 20, // Normalize to 0-1 range
      reason: item.reason
    }));
} 