'use client';

import { useState, useEffect, useMemo } from 'react';
import { ParsedChatData, ChatMessage } from '@/types/chat';
import { chatStorage } from '@/utils/storage';

export default function ParticipantsPage() {
  const [chatData, setChatData] = useState<ParsedChatData | null>(null);

  // Get chat data from storage
  useEffect(() => {
    const loadChatData = async () => {
      try {
        const storedData = await chatStorage.getChatData();
        if (storedData) {
          // Convert date strings back to Date objects
          if (storedData.messages && storedData.messages.length > 0) {
            storedData.messages = storedData.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }));
            storedData.dateRange = {
              start: new Date(storedData.dateRange.start),
              end: new Date(storedData.dateRange.end)
            };
            setChatData(storedData);
          } else {
            setChatData({
              ...storedData,
              messages: [],
              dateRange: {
                start: new Date(storedData.dateRange.start),
                end: new Date(storedData.dateRange.end)
              }
            });
          }
        }
      } catch (error) {
        console.error('Error loading chat data:', error);
      }
    };

    loadChatData();
  }, []);

  const participantStats = useMemo(() => {
    if (!chatData || chatData.messages.length === 0) return [];

    const stats = new Map();
    
    // Initialize stats for each participant
    chatData.participants.forEach(participant => {
      stats.set(participant, {
        name: participant,
        messageCount: 0,
        totalCharacters: 0,
        averageMessageLength: 0,
        firstMessage: null,
        lastMessage: null,
        mostActiveHour: 0,
        mostActiveDay: 0,
        hourlyActivity: new Array(24).fill(0),
        dailyActivity: new Array(7).fill(0)
      });
    });

    // Calculate stats
    chatData.messages.forEach(message => {
      const participant = stats.get(message.sender);
      if (participant) {
        participant.messageCount++;
        participant.totalCharacters += message.content.length;
        
        const hour = message.timestamp.getHours();
        const day = message.timestamp.getDay();
        
        participant.hourlyActivity[hour]++;
        participant.dailyActivity[day]++;
        
        if (!participant.firstMessage || message.timestamp < participant.firstMessage) {
          participant.firstMessage = message.timestamp;
        }
        if (!participant.lastMessage || message.timestamp > participant.lastMessage) {
          participant.lastMessage = message.timestamp;
        }
      }
    });

    // Calculate averages and find most active times
    stats.forEach(participant => {
      participant.averageMessageLength = participant.messageCount > 0 
        ? Math.round(participant.totalCharacters / participant.messageCount) 
        : 0;
      
      participant.mostActiveHour = participant.hourlyActivity.indexOf(Math.max(...participant.hourlyActivity));
      participant.mostActiveDay = participant.dailyActivity.indexOf(Math.max(...participant.dailyActivity));
    });

    return Array.from(stats.values()).sort((a, b) => b.messageCount - a.messageCount);
  }, [chatData]);

  if (!chatData) {
    return (
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Participants Analytics</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No chat data available. Please upload a chat file on the main page to view analytics.
          </p>
        </div>
      </div>
    );
  }

  if (chatData.messages.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Participants Analytics</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Chat data was too large for detailed participant analytics.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{chatData.participants.length}</div>
            <div className="text-gray-600 dark:text-gray-400">Total Participants</div>
          </div>
        </div>
      </div>
    );
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Participants Analytics</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Detailed insights into participant activity and engagement
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Participant Cards */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Participant Statistics</h3>
          <div className="space-y-4">
            {participantStats.map((participant, index) => (
              <div key={participant.name} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{participant.name}</h4>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                    #{index + 1}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{participant.messageCount}</div>
                    <div className="text-gray-600 dark:text-gray-400">Messages</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{participant.averageMessageLength}</div>
                    <div className="text-gray-600 dark:text-gray-400">Avg Length</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">{participant.mostActiveHour}:00</div>
                    <div className="text-gray-600 dark:text-gray-400">Most Active Hour</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-orange-600 dark:text-orange-400">{dayNames[participant.mostActiveDay]}</div>
                    <div className="text-gray-600 dark:text-gray-400">Most Active Day</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Charts */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Activity Patterns</h3>
          
          {/* Hourly Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hourly Activity</h4>
            <div className="space-y-3">
              {participantStats.slice(0, 3).map((participant) => (
                <div key={participant.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{participant.name}</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {Math.max(...participant.hourlyActivity)} messages
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    {participant.hourlyActivity.map((count: number, hour: number) => (
                      <div
                        key={hour}
                        className="flex-1 bg-gray-200 dark:bg-gray-700 rounded"
                        style={{
                          height: '20px',
                          backgroundColor: count > 0 
                            ? `hsl(${200 + (count / Math.max(...participant.hourlyActivity)) * 60}, 70%, 60%)`
                            : 'transparent'
                        }}
                        title={`${hour}:00 - ${count} messages`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Activity</h4>
            <div className="space-y-3">
              {participantStats.slice(0, 3).map((participant) => (
                <div key={participant.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{participant.name}</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {Math.max(...participant.dailyActivity)} messages
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    {participant.dailyActivity.map((count: number, day: number) => (
                      <div
                        key={day}
                        className="flex-1 bg-gray-200 dark:bg-gray-700 rounded"
                        style={{
                          height: '20px',
                          backgroundColor: count > 0 
                            ? `hsl(${120 + (count / Math.max(...participant.dailyActivity)) * 60}, 70%, 60%)`
                            : 'transparent'
                        }}
                        title={`${dayNames[day]} - ${count} messages`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 