import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface MessageFormProps {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  isReply?: boolean;
}

export function MessageForm({ onSubmit, placeholder = "Type your message...", isReply = false }: MessageFormProps) {
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSending(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={isReply ? 'ml-8 mt-2' : 'mb-8'}>
      <div className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={isSending || !content.trim()}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
        >
          {isSending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send'
          )}
        </button>
      </div>
    </form>
  );
}