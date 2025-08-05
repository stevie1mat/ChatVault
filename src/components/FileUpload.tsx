'use client';

import { useState, useCallback, useRef } from 'react';
import { parseWhatsAppChat } from '@/utils/chatParser';
import { ParsedChatData } from '@/types/chat';

interface FileUploadProps {
  onChatParsed: (data: ParsedChatData) => void;
}

export default function FileUpload({ onChatParsed }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.txt')) {
      setError('Please upload a .txt file');
      return;
    }

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setError('File is too large. Please use a file smaller than 50MB.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`📁 Processing file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      
      const content = await file.text();
      console.log(`📝 File content length: ${content.length} characters`);
      
      const parsedData = parseWhatsAppChat(content);
      
      if (parsedData.messages.length === 0) {
        setError('No valid WhatsApp messages found in the file');
        return;
      }

      console.log(`✅ Parsed ${parsedData.messages.length} messages successfully`);
      onChatParsed(parsedData);
    } catch (err) {
      console.error('File parsing error:', err);
      if (err instanceof Error && err.message.includes('memory')) {
        setError('File is too large for processing. Please try a smaller file.');
      } else {
        setError('Error reading file. Please try again.');
      }
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

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  return (
    <div className="w-full">
      <div
        ref={dropRef}
        className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-105 shadow-lg'
            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-6">
          <div className="text-6xl mb-4">📱</div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Upload ChatVault
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Drag and drop your WhatsApp chat export file here, or click to browse
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Choose File
            </button>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Supports .txt files
            </div>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {isLoading && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span>Processing large file, please wait...</span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Large files may take a moment to process and store
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <span className="text-lg">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
} 