# Mistral AI Integration Setup

## Overview
The chat application now includes AI-powered search using Mistral AI's API. This allows users to search through chat messages using natural language queries.

## Setup Instructions

### 1. Get a Mistral AI API Key
1. Visit [Mistral AI Console](https://console.mistral.ai/)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the API key (it starts with `mist-`)

### 2. Configure Environment Variables
Create a `.env.local` file in the project root with:

```env
# Mistral AI API Configuration
NEXT_PUBLIC_MISTRAL_API_KEY=your_mistral_api_key_here
```

Replace `your_mistral_api_key_here` with your actual Mistral AI API key.

### 3. Restart the Development Server
After adding the environment variable, restart your development server:

```bash
npm run dev
```

## Features

### 🤖 AI-Powered Search
- **Natural Language Queries**: Ask questions like "When did we plan the meeting?" or "Find messages about dinner"
- **Semantic Understanding**: The AI understands context, not just keywords
- **Smart Relevance**: Results are ranked by relevance to your query
- **Explanation**: Each result shows why it's relevant to your search

### 🔄 Fallback System
- If the Mistral AI API is unavailable, the system automatically falls back to local search
- Users get notified when fallback is being used
- No interruption to the search experience

### 💡 Search Examples
- "Show me messages from John about the project"
- "When did we discuss dinner plans?"
- "Find conversations about the meeting last week"
- "What did Sarah say about the deadline?"

## API Usage
The integration uses Mistral's `mistral-large-latest` model for optimal search results. The API is called only when users perform searches, keeping costs minimal.

## Troubleshooting

### API Key Issues
- Ensure your API key is correctly set in `.env.local`
- Verify the key has proper permissions
- Check that the key starts with `mist-`

### Network Issues
- The app will automatically fall back to local search if the API is unavailable
- Check your internet connection if API calls fail

### Rate Limiting
- Mistral AI has rate limits; if you hit them, the app will use fallback search
- Consider upgrading your Mistral plan for higher limits

## Cost Considerations
- Each search query costs approximately $0.01-0.05 depending on chat size
- The API is only called when users actively search
- Fallback search is free and works offline 