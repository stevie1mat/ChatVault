'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SharedSidebarProps {
  chatData: any;
}

export default function SharedSidebar({ chatData }: SharedSidebarProps) {
  const pathname = usePathname();

  const chatItems = [
    { href: '/chat', label: 'Messages', icon: '💬' }
  ];

  const analyticsItems = [
    { href: '/chat/analytics', label: 'Overview', icon: '📊' },
    { href: '/chat/analytics/activity', label: 'Activity Patterns', icon: '📈' },
    { href: '/chat/analytics/participants', label: 'Participants', icon: '👥' },
    { href: '/chat/analytics/sentiment', label: 'Sentiment Analysis', icon: '😊' },
    { href: '/chat/analytics/topics', label: 'Topic Modeling', icon: '🗣️' },
    { href: '/chat/analytics/patterns', label: 'Conversation Patterns', icon: '🔄' },
    { href: '/chat/analytics/response-times', label: 'Response Times', icon: '⏱️' },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
      <div className="p-6">
        <div className="mb-6">
          <Link
            href="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <span className="text-lg">📤</span>
            <span>Upload</span>
          </Link>
        </div>
        
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Chat</h2>
        <nav className="space-y-2 mb-8">
          {chatItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Analytics</h2>
        <nav className="space-y-2">
          {analyticsItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
} 