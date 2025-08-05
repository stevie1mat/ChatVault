'use client';

import { useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const [showHowToDialog, setShowHowToDialog] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf4f2' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-900">WhatsApp Chat Analyzer</h1>
              <nav className="hidden md:flex items-center space-x-6">
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Solutions</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Products</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Resources</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowHowToDialog(true)}
                className="text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                How to?
              </button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50">
                Try Analyzer
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                Sign in
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-4rem)] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          
          {/* Left Section - Marketing Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-gray-500 text-sm font-medium">WhatsApp Chat Analyzer</p>
              <h1 className="text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-tight">
                Search Your WhatsApp Chats
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Upload your WhatsApp chat export and explore your conversations with powerful search, filtering, and analytics tools.
              </p>
            </div>
            
                        <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium">
                Get Started
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Try Analyzer
              </button>
            </div>
            
            <div className="flex flex-col space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Smart Search & Filtering</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Advanced Analytics Dashboard</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Date & Time Range Filtering</span>
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
                    <h3 className="font-bold text-gray-900 text-lg">WhatsApp Chat</h3>
                    <p className="text-xs text-gray-500">Active now</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>3 participants</span>
                </div>
              </div>

              {/* Search Filters */}
              <div className="flex items-center space-x-3 mb-6 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="flex-1 relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="w-full pl-10 pr-4 py-2 text-sm border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                  />
                </div>
              </div>

              {/* Participant Filter Pills */}
              <div className="flex items-center space-x-2 mb-6">
                <button className="px-4 py-2 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md">All</button>
                <button className="px-4 py-2 rounded-full text-xs font-medium bg-white text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50">John</button>
                <button className="px-4 py-2 rounded-full text-xs font-medium bg-white text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50">Sarah</button>
                <button className="px-4 py-2 rounded-full text-xs font-medium bg-white text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50">Mike</button>
              </div>

              {/* Chat Messages */}
              <div className="space-y-4 mb-6 max-h-52 overflow-y-auto">
                <div className="flex items-start space-x-3 group">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold shadow-md">J</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-gray-900">John</span>
                      <span className="text-xs text-gray-400">10:43 am</span>
                    </div>
                    <div className="bg-blue-50 rounded-2xl rounded-tl-md p-3 max-w-xs">
                      <p className="text-gray-800 text-sm">Hey everyone! How's the project going? 🚀</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 group">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold shadow-md">S</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-gray-900">Sarah</span>
                      <span className="text-xs text-gray-400">10:45 am</span>
                    </div>
                    <div className="bg-green-50 rounded-2xl rounded-tl-md p-3 max-w-xs">
                      <p className="text-gray-800 text-sm">Great progress! I've completed the design phase ✨</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 group">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold shadow-md">M</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-gray-900">Mike</span>
                      <span className="text-xs text-gray-400">10:48 am</span>
                    </div>
                    <div className="bg-purple-50 rounded-2xl rounded-tl-md p-3 max-w-xs">
                      <p className="text-gray-800 text-sm">Perfect! Let's schedule a review meeting 📅</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="flex items-center space-x-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">From</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">To</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Overlapping Analytics Widgets */}
            {/* Messages Count Widget */}
            <div className="absolute -top-8 -left-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-2xl p-6 z-20 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">1,247</div>
                <div className="text-xs opacity-90">Total Messages</div>
                <div className="w-8 h-1 bg-blue-300 rounded-full mx-auto mt-2"></div>
              </div>
            </div>

            {/* Participants Widget */}
            <div className="absolute -top-8 -right-8 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-2xl p-6 z-20 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">3</div>
                <div className="text-xs opacity-90">Participants</div>
                <div className="w-8 h-1 bg-green-300 rounded-full mx-auto mt-2"></div>
              </div>
            </div>

            {/* Activity Chart Widget */}
            <div className="absolute -bottom-8 -left-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-2xl p-6 z-20 text-white">
              <div className="text-center">
                <div className="text-lg font-bold mb-3">Activity</div>
                <div className="flex items-end space-x-1 h-16 mb-2">
                  <div className="w-3 bg-purple-300 rounded-t h-6"></div>
                  <div className="w-3 bg-purple-300 rounded-t h-8"></div>
                  <div className="w-3 bg-purple-300 rounded-t h-10"></div>
                  <div className="w-3 bg-purple-300 rounded-t h-14"></div>
                  <div className="w-3 bg-purple-300 rounded-t h-16"></div>
                  <div className="w-3 bg-purple-300 rounded-t h-12"></div>
                  <div className="w-3 bg-purple-300 rounded-t h-8"></div>
                </div>
                <div className="text-xs opacity-90">This Week</div>
              </div>
            </div>

            {/* Search Results Widget */}
            <div className="absolute -bottom-8 -right-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-2xl p-6 z-20 text-white">
              <div className="text-center">
                <div className="text-lg font-bold mb-2">Search</div>
                <div className="text-xs opacity-90 mb-1">23 results found</div>
                <div className="text-xs bg-orange-400 px-2 py-1 rounded-full">"meeting"</div>
              </div>
            </div>

            {/* Analytics Button */}
            <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-full p-4 shadow-2xl z-20 hover:scale-110 transition-transform duration-200">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-4 left-4 bg-white rounded-full shadow-lg p-2 z-30">
              <div className="flex space-x-1">
                <span className="text-sm">🔥</span>
                <span className="text-sm">💚</span>
                <span className="text-sm">✨</span>
                <span className="text-sm">😊</span>
              </div>
            </div>

            <div className="absolute -top-4 right-4 w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl shadow-lg z-20"></div>
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
