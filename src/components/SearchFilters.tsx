'use client';

import { useState, useEffect } from 'react';
import type { SearchFilters } from '@/types/chat';

interface SearchFiltersProps {
  participants: string[];
  dateRange: { start: Date; end: Date };
  onFiltersChange: (filters: SearchFilters) => void;
}

export default function SearchFilters({ participants, dateRange, onFiltersChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
    startDate: null,
    endDate: null,
    timeRange: null,
    sender: null
  });

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      keyword: '',
      startDate: null,
      endDate: null,
      timeRange: null,
      sender: null
    });
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const hasActiveFilters = filters.keyword || filters.startDate || filters.endDate || filters.timeRange || filters.sender;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Keyword Search */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900 dark:text-white">
          Search Messages
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by keyword..."
            value={filters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
          />
          {filters.keyword && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <span className="text-blue-500 text-lg">🔍</span>
            </div>
          )}
        </div>
      </div>

      {/* Date Range */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900 dark:text-white">
          Date Range
        </label>
        <div>
          <input
            type="date"
            min={formatDate(dateRange.start)}
            max={formatDate(dateRange.end)}
            value={filters.startDate ? formatDate(filters.startDate) : ''}
            onChange={(e) => handleFilterChange('startDate', e.target.value ? new Date(e.target.value) : null)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
        </div>
      </div>

      {/* Time Range */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
          Time
        </label>
        <div>
          <input
            type="time"
            value={filters.timeRange?.start || ''}
            onChange={(e) => handleFilterChange('timeRange', {
              start: e.target.value,
              end: e.target.value
            })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
        </div>
      </div>
    </div>
  );
} 