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
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Search & Filters
            </h3>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

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
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-blue-500 text-sm">🔍</span>
              </div>
            )}
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-3">
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>
        </div>

        {/* Time Range */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            Time Filter
          </label>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Time
            </label>
            <input
              type="time"
              value={filters.timeRange?.start || ''}
              onChange={(e) => handleFilterChange('timeRange', {
                start: e.target.value,
                end: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>
        </div>

        {/* Active filters indicator */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {filters.keyword && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs">
                  Search: "{filters.keyword}"
                </span>
              )}
              {filters.startDate && (
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs">
                  From: {filters.startDate.toLocaleDateString()}
                </span>
              )}
              {filters.timeRange && filters.timeRange.start && (
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-xs">
                  Time: {filters.timeRange.start}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 