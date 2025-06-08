import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { ChatMessage, ChatState } from '../../types/chat';

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
  className?: string;
}

export interface ChatInterfaceRef {
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
}

const ChatInterface = forwardRef<ChatInterfaceRef, ChatInterfaceProps>(({
  onSendMessage,
  isTyping = false,
  className = ''
}, ref) => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [
      {
        id: 'welcome-1',
        content: 'Hello! I\'m your AI presentation assistant. I can help you edit slides, improve content, and navigate your presentation.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'system'
      },
      {
        id: 'welcome-2',
        content: 'Try asking me to:\n• "Edit the title of this slide"\n• "Go to slide 3"\n• "Analyze this presentation"\n• "Make the text larger"',
        sender: 'ai',
        timestamp: new Date(),
        type: 'system'
      }
    ],
    isTyping,
    isConnected: true,
    lastActivity: new Date()
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  useEffect(() => {
    setChatState(prev => ({ ...prev, isTyping }));
  }, [isTyping]);

  const handleSendMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      lastActivity: new Date()
    }));

    onSendMessage(content);
  };

  const addMessage = (message: ChatMessage) => {
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, message],
      lastActivity: new Date()
    }));
  };

  const clearMessages = () => {
    setChatState(prev => ({
      ...prev,
      messages: [],
      lastActivity: new Date()
    }));
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    addMessage,
    clearMessages
  }));

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">AI Assistant</h3>
            <p className="text-xs text-gray-600">
              {chatState.isConnected ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <MessageList 
          messages={chatState.messages}
          isTyping={chatState.isTyping}
        />
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-shrink-0 border-t border-gray-200">
        <MessageInput 
          onSendMessage={handleSendMessage}
          disabled={!chatState.isConnected}
          placeholder="Ask me to edit slides, navigate, or analyze your presentation..."
        />
      </div>
    </div>
  );
});

ChatInterface.displayName = 'ChatInterface';

export default ChatInterface;
