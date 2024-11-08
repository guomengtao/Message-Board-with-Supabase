import React, { useState, useEffect } from 'react';
import { MessageSquarePlus, Loader2, LogOut } from 'lucide-react';
import { supabase } from './lib/supabase';
import { MessageForm } from './components/MessageForm';
import { MessageItem } from './components/MessageItem';
import { AdminLogin } from './components/AdminLogin';
import type { Message } from './types';

const PROJECT_ID = 1001;

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  useEffect(() => {
    fetchMessages();
    // Set up real-time subscription
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, 
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('project_id', PROJECT_ID)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (content: string, parentId: number | null = null) => {
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{ 
          content, 
          parent_id: parentId,
          project_id: PROJECT_ID 
        }]);

      if (error) throw error;
      if (parentId) setReplyingTo(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDelete = async (messageId: number) => {
    if (!isAdmin) return;
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  if (!isAdmin) {
    return <AdminLogin onLogin={() => setIsAdmin(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <MessageSquarePlus className="w-6 h-6 text-indigo-600" />
              Message Board
            </h1>
            <button
              onClick={() => setIsAdmin(false)}
              className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          <MessageForm onSubmit={(content) => handleSubmit(content)} />

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            ) : messages.length > 0 ? (
              messages.map((message) => (
                !message.parent_id ? (
                  <div key={message.id}>
                    <MessageItem
                      message={message}
                      onReply={setReplyingTo}
                      onDelete={handleDelete}
                      isAdmin={isAdmin}
                    />
                    {replyingTo === message.id && (
                      <MessageForm
                        onSubmit={(content) => handleSubmit(content, message.id)}
                        placeholder="Type your reply..."
                        isReply
                      />
                    )}
                    {messages
                      .filter(reply => reply.parent_id === message.id)
                      .map(reply => (
                        <MessageItem
                          key={reply.id}
                          message={reply}
                          onReply={setReplyingTo}
                          onDelete={handleDelete}
                          isAdmin={isAdmin}
                          isReply
                        />
                      ))}
                  </div>
                ) : null
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No messages yet. Be the first to write something!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;