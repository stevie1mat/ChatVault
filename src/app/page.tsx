'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const router = useRouter();
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
                onClick={() => router.push('/upload')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Get Started
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
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 max-w-md mx-auto relative z-10">
              {/* Chat Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold text-gray-900">WhatsApp Chat</h3>
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  </svg>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>3 participants</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              {/* Search Filters */}
              <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button className="text-blue-600 hover:text-blue-700">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Participant Filter Pills */}
              <div className="flex items-center space-x-2 mb-4">
                <button className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">All</button>
                <button className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">John</button>
                <button className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Sarah</button>
                <button className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Mike</button>
              </div>

              {/* Chat Messages */}
              <div className="space-y-4 mb-4 max-h-48 overflow-y-auto">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-medium">J</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">John</span>
                      <span className="text-xs text-gray-500">10:43 am</span>
                    </div>
                    <p className="text-gray-700 text-sm">Hey everyone! How's the project going?</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-medium">S</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">Sarah</span>
                      <span className="text-xs text-gray-500">10:45 am</span>
                    </div>
                    <p className="text-gray-700 text-sm">Great progress! I've completed the design phase.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-medium">M</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">Mike</span>
                      <span className="text-xs text-gray-500">10:48 am</span>
                    </div>
                    <p className="text-gray-700 text-sm">Perfect! Let's schedule a review meeting.</p>
                  </div>
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <input
                  type="date"
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500">to</span>
                <input
                  type="date"
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Overlapping Analytics Widgets */}
            {/* Messages Count Widget */}
            <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-4 z-20">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1,247</div>
                <div className="text-xs text-gray-600">Total Messages</div>
              </div>
            </div>

            {/* Participants Widget */}
            <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 z-20">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">3</div>
                <div className="text-xs text-gray-600">Participants</div>
              </div>
            </div>

            {/* Activity Chart Widget */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 z-20">
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600 mb-2">Activity</div>
                <div className="flex items-end space-x-1 h-12">
                  <div className="w-2 bg-purple-200 rounded-t h-4"></div>
                  <div className="w-2 bg-purple-300 rounded-t h-6"></div>
                  <div className="w-2 bg-purple-400 rounded-t h-8"></div>
                  <div className="w-2 bg-purple-500 rounded-t h-10"></div>
                  <div className="w-2 bg-purple-600 rounded-t h-12"></div>
                  <div className="w-2 bg-purple-400 rounded-t h-8"></div>
                  <div className="w-2 bg-purple-300 rounded-t h-6"></div>
                </div>
                <div className="text-xs text-gray-600 mt-1">This Week</div>
              </div>
            </div>

            {/* Search Results Widget */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4 z-20">
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-600 mb-2">Search</div>
                <div className="text-xs text-gray-600">23 results found</div>
                <div className="text-xs text-blue-600 mt-1">"meeting"</div>
              </div>
            </div>

            {/* Analytics Button */}
            <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full p-3 shadow-lg z-20">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#fdf4f2' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for Chat Analysis
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover advanced tools to explore, search, and analyze your WhatsApp conversations with precision and ease.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Search</h3>
              <p className="text-gray-600 leading-relaxed">
                Find any message instantly with real-time keyword search, date filtering, and participant-based queries.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Analytics Dashboard</h3>
              <p className="text-gray-600 leading-relaxed">
                Get detailed insights into chat patterns, participant activity, and conversation trends with beautiful charts.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Advanced Filtering</h3>
              <p className="text-gray-600 leading-relaxed">
                Filter by date ranges, time periods, specific participants, and message content with precision.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#fdf4f2' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started with WhatsApp Chat Analyzer in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Export Your Chat</h3>
              <p className="text-gray-600">
                Export your WhatsApp chat without media from the WhatsApp app
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Upload & Process</h3>
              <p className="text-gray-600">
                Upload the exported file and let our system process your conversations
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Analyze & Explore</h3>
              <p className="text-gray-600">
                Search, filter, and analyze your chat data with powerful tools
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#fdf4f2' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of users who trust WhatsApp Chat Analyzer for their conversation insights
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  S
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Sarah Chen</h4>
                  <p className="text-sm text-gray-500">Product Manager</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                "This tool helped me analyze team communication patterns and improve our collaboration. The search features are incredibly powerful!"
              </p>
            </div>
            
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  M
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Mike Rodriguez</h4>
                  <p className="text-sm text-gray-500">Data Analyst</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                "The analytics dashboard provides amazing insights. I can track engagement patterns and identify key conversation trends easily."
              </p>
            </div>
            
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  A
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Alex Thompson</h4>
                  <p className="text-sm text-gray-500">Research Lead</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                "Perfect for research projects! The filtering capabilities help me find specific conversations quickly and efficiently."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#fdf4f2' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Ready to Analyze Your Chats?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Start exploring your WhatsApp conversations with powerful search, filtering, and analytics tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/upload')}
              className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg"
            >
              Get Started Now
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">WhatsApp Chat Analyzer</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Powerful tools to search, filter, and analyze your WhatsApp conversations with precision and ease.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 WhatsApp Chat Analyzer. All rights reserved.</p>
          </div>
        </div>
      </footer>

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
