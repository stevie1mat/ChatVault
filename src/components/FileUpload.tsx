'use client';

import { useState, useCallback } from 'react';
import { parseWhatsAppChat } from '@/utils/chatParser';
import { ParsedChatData } from '@/types/chat';

interface FileUploadProps {
  onChatParsed: (data: ParsedChatData) => void;
}

export default function FileUpload({ onChatParsed }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.txt')) {
      setError('Please upload a .txt file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const content = await file.text();
      const parsedData = parseWhatsAppChat(content);
      
      if (parsedData.messages.length === 0) {
        setError('No valid WhatsApp messages found in the file');
        return;
      }

      onChatParsed(parsedData);
    } catch (err) {
      setError('Error reading file. Please try again.');
      console.error('File parsing error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [onChatParsed]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className={`transition-transform duration-300 ${isDragOver ? 'scale-110' : ''}`}>
              <div className="text-6xl mb-4">📱</div>
            </div>
          </div>

          {/* Text content */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isDragOver ? 'Drop your file here!' : 'Upload WhatsApp Chat'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {isDragOver 
                ? 'Release to upload your chat file'
                : 'Drag and drop your WhatsApp chat export (.txt file) here, or click to browse'
              }
            </p>
            
            {/* File input */}
            <input
              type="file"
              accept=".txt"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
              disabled={isLoading}
            />
            
            {/* Upload button */}
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Processing...
                </>
              ) : (
                <>
                  <span className="mr-2">📁</span>
                  Choose File
                </>
              )}
            </label>
          </div>

          {/* File info */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Supports WhatsApp chat exports (.txt files)</p>
            <p>Your data stays private - no uploads to servers</p>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">⚠️</span>
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
} 