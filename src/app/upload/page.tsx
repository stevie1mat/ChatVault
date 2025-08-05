'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ParsedChatData } from '@/types/chat';
import { chatStorage } from '@/utils/storage';
import FileUpload from '@/components/FileUpload';
import ThemeToggle from '@/components/ThemeToggle';

export default function UploadPage() {
  const router = useRouter();
  const [showHowToDialog, setShowHowToDialog] = useState(false);

  const handleChatParsed = async (data: ParsedChatData) => {
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
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf4f2' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-900">WhatsApp Chat Analyzer</h1>
              <nav className="hidden md:flex items-center space-x-6">
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowHowToDialog(true)}
                className="text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                How to?
              </button>
              <button 
                onClick={() => router.push('/chat')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                View Chat
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-4rem)] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          
          {/* Left Section - Upload Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-gray-500 text-sm font-medium">Upload Your Chat</p>
              <h1 className="text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-tight">
                Upload & Analyze
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Upload your WhatsApp chat export and let our powerful tools analyze your conversations with precision and ease.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium">
                Upload File
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Learn More
              </button>
            </div>
            
            <div className="flex flex-col space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Instant Processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Advanced Analytics</span>
              </div>
            </div>
            
            {/* File Upload Section */}
            <div className="mt-8 p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Chat File</h3>
                <p className="text-gray-600">Select your WhatsApp chat export (.txt file) to get started</p>
              </div>
              <FileUpload onChatParsed={handleChatParsed} />
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowHowToDialog(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  How to export from WhatsApp?
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - UI Demonstrations */}
          <div className="relative">
            {/* Main Chat Window */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-100 p-8 max-w-md mx-auto relative z-10 backdrop-blur-sm">
              {/* Chat Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Upload Status</h3>
                    <p className="text-xs text-gray-500">Processing...</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Ready</span>
                </div>
              </div>

              {/* Upload Progress */}
              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900">Processing File</span>
                    <span className="text-xs text-blue-600">75%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-2xl p-4">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-green-900">File Validated</span>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-2xl p-4">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-purple-900">Extracting Messages</span>
                  </div>
                </div>
              </div>

              {/* File Info */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">1,247</div>
                  <div className="text-xs text-gray-600">Messages Found</div>
                </div>
              </div>
            </div>

            {/* Overlapping Analytics Widgets */}
            {/* Processing Status */}
            <div className="absolute -top-8 -left-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-2xl p-6 z-20 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">Processing</div>
                <div className="text-xs opacity-90">File Upload</div>
                <div className="w-8 h-1 bg-blue-300 rounded-full mx-auto mt-2"></div>
              </div>
            </div>

            {/* File Size */}
            <div className="absolute -top-8 -right-8 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-2xl p-6 z-20 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">2.4 MB</div>
                <div className="text-xs opacity-90">File Size</div>
                <div className="w-8 h-1 bg-green-300 rounded-full mx-auto mt-2"></div>
              </div>
            </div>

            {/* Upload Progress */}
            <div className="absolute -bottom-8 -left-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-2xl p-6 z-20 text-white">
              <div className="text-center">
                <div className="text-lg font-bold mb-3">Progress</div>
                <div className="flex items-end space-x-1 h-16 mb-2">
                  <div className="w-3 bg-purple-300 rounded-t h-6"></div>
                  <div className="w-3 bg-purple-300 rounded-t h-8"></div>
                  <div className="w-3 bg-purple-300 rounded-t h-10"></div>
                  <div className="w-3 bg-purple-300 rounded-t h-14"></div>
                  <div className="w-3 bg-purple-300 rounded-t h-16"></div>
                  <div className="w-3 bg-purple-300 rounded-t h-12"></div>
                  <div className="w-3 bg-purple-300 rounded-t h-8"></div>
                </div>
                <div className="text-xs opacity-90">75% Complete</div>
              </div>
            </div>

            {/* Success Status */}
            <div className="absolute -bottom-8 -right-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-2xl p-6 z-20 text-white">
              <div className="text-center">
                <div className="text-lg font-bold mb-2">Status</div>
                <div className="text-xs opacity-90 mb-1">Ready for Analysis</div>
                <div className="text-xs bg-orange-400 px-2 py-1 rounded-full">Success</div>
              </div>
            </div>

            {/* Upload Button */}
            <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-full p-4 shadow-2xl z-20 hover:scale-110 transition-transform duration-200">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* How to Dialog */}
      {showHowToDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                How to Export from WhatsApp
              </h3>
              <button
                onClick={() => setShowHowToDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 text-gray-600">
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

            <div className="mt-6 pt-4 border-t border-gray-200">
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
    </div>
  );
} 