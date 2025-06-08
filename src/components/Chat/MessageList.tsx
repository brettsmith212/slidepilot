import React from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import { ChatMessage } from '../../types/chat';

interface MessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  className?: string;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isTyping,
  className = ''
}) => {
  return (
    <div className={`flex-1 overflow-y-auto px-4 py-3 space-y-3 ${className}`}>
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      {isTyping && <TypingIndicator />}
    </div>
  );
};

export default MessageList;
