'use client';

import { ChatMessage } from '@/types/chat';
import { exportChatToTxt, exportChatToJson } from '@/utils/chatParser';

interface ExportButtonsProps {
  messages: ChatMessage[];
  disabled?: boolean;
}

export default function ExportButtons({ messages, disabled = false }: ExportButtonsProps) {
  const handleExportTxt = () => {
    const content = exportChatToTxt(messages);
    downloadFile(content, 'whatsapp-chat.txt', 'text/plain');
  };

  const handleExportJson = () => {
    const content = exportChatToJson(messages);
    downloadFile(content, 'whatsapp-chat.json', 'application/json');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExportTxt}
        disabled={disabled || messages.length === 0}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        Export TXT
      </button>
      <button
        onClick={handleExportJson}
        disabled={disabled || messages.length === 0}
        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        Export JSON
      </button>
    </div>
  );
} 