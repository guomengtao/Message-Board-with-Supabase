import React from 'react';
import { MessageSquareMore, Trash2 } from 'lucide-react';
import type { Message } from '../types';

interface MessageItemProps {
  message: Message;
  onReply: (messageId: number) => void;
  onDelete: (messageId: number) => void;
  isAdmin: boolean;
  isReply?: boolean;
}

export function MessageItem({ message, onReply, onDelete, isAdmin, isReply = false }: MessageItemProps) {
  return (
    <div className={`bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 ${
      isReply ? 'ml-8 border-l-4 border-indigo-100' : ''
    }`}>
      <p className="text-gray-800">{message.content}</p>
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-500">
          {new Date(message.created_at).toLocaleString()}
        </p>
        <div className="flex gap-2">
          {!isReply && (
            <button
              onClick={() => onReply(message.id)}
              className="text-indigo-600 hover:text-indigo-800 p-1 rounded transition-colors duration-200"
            >
              <MessageSquareMore className="w-4 h-4" />
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => onDelete(message.id)}
              className="text-red-600 hover:text-red-800 p-1 rounded transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}