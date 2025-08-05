'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ParsedChatData } from '@/types/chat';
import { chatStorage } from '@/utils/storage';
import FileUpload from '@/components/FileUpload';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const router = useRouter();
  const [showHowToDialog, setShowHowToDialog] = useState(false);

  const handleChatParsed = useCallback(async (data: ParsedChatData) => {
    console.log('handleChatParsed called with data:', data);
    console.log('Messages count:', data.messages.length);
    
    // Store chat data using the new storage system
    console.log('Storing chat data...');
    try {
      const dataToStore = {
        ...data,
        messages: data.messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString()
        })),
        dateRange: {
          start: data.dateRange.start.toISOString(),
          end: data.dateRange.end.toISOString()
        }
      };
      
      console.log('Data to store - Messages:', dataToStore.messages.length);
      await chatStorage.storeChatData(dataToStore);
      console.log('Chat data stored successfully');
      
      // Verify storage worked
      const storedData = await chatStorage.getChatData();
      console.log('Verification - Stored messages:', storedData?.messages?.length || 0);
      
      // Redirect to chat page after successful upload
      router.push('/chat');
      
    } catch (error) {
      console.error('Error storing chat data:', error);
      alert('Failed to store chat data. Please try again or use a smaller chat file.');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">ChatVault</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowHowToDialog(true)}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              >
                How to?
              </button>
              <a
                href="https://github.com/stevie1mat/ChatVault"
            target="_blank"
            rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                title="View on GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* How to Dialog */}
      {showHowToDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                How to Export from WhatsApp
              </h3>
              <button
                onClick={() => setShowHowToDialog(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
      </div>

            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <div className="flex items-start space-x-4">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                <p>Open the chat you want to export in WhatsApp</p>
              </div>
              <div className="flex items-start space-x-4">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                <p>Tap the chat name at the top → More options → Export chat</p>
              </div>
              <div className="flex items-start space-x-4">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                <p>Choose "Without Media" to get a .txt file</p>
              </div>
              <div className="flex items-start space-x-4">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                <p>Upload the file here and start exploring!</p>
              </div>
      </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowHowToDialog(false)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-20">
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Search Your ChatVault
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Upload your WhatsApp chat export and explore your conversations with powerful search, filtering, and analysis tools.
              </p>
            </div>
          </div>
          <div className="max-w-2xl mx-auto">
            <FileUpload onChatParsed={handleChatParsed} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl border border-blue-100 dark:border-blue-800/30">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Smart Search
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Find any message instantly with real-time keyword search and advanced filtering options.
              </p>
            </div>

            <div className="text-center space-y-4 p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl border border-purple-100 dark:border-purple-800/30">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Chat Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Analyze your chat patterns with date ranges, time filters, and participant insights.
              </p>
            </div>

            <div className="text-center space-y-4 p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl border border-green-100 dark:border-green-800/30">
              <div className="text-4xl mb-4">📤</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Export & Share
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Export filtered conversations in multiple formats for backup or analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
