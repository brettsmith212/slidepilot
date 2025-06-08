import React from 'react';
import { ChatMessage } from '../../types/chat';
import { Bot, User, AlertCircle, Info } from 'lucide-react';

interface MessageProps {
  message: ChatMessage;
  className?: string;
}

const Message: React.FC<MessageProps> = ({ message, className = '' }) => {
  const isUser = message.sender === 'user';
  const isSystem = message.type === 'system';
  const isError = message.type === 'error';

  const getIcon = () => {
    if (isError) return <AlertCircle size={16} className="text-red-500" />;
    if (isSystem) return <Info size={16} className="text-blue-500" />;
    if (isUser) return <User size={16} className="text-gray-600" />;
    return <Bot size={16} className="text-blue-600" />;
  };

  const getBackgroundColor = () => {
    if (isError) return 'bg-red-50 border-red-200';
    if (isSystem) return 'bg-blue-50 border-blue-200';
    if (isUser) return 'bg-gray-100 border-gray-200';
    return 'bg-white border-gray-200';
  };

  const getTextColor = () => {
    if (isError) return 'text-red-800';
    if (isSystem) return 'text-blue-800';
    return 'text-gray-800';
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex gap-3 ${className}`}>
      <div className="flex-shrink-0 mt-1">
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className={`inline-block max-w-full p-3 rounded-lg border ${getBackgroundColor()}`}>
          <div className={`text-sm whitespace-pre-wrap ${getTextColor()}`}>
            {message.content}
          </div>
          
          {message.metadata?.slideReference && (
            <div className="mt-2 text-xs text-gray-500">
              Referenced: {message.metadata.slideReference}
            </div>
          )}
        </div>
        
        <div className="mt-1 text-xs text-gray-500">
          {formatTime(message.timestamp)}
          {message.metadata?.commandType && (
            <span className="ml-2 px-2 py-0.5 bg-gray-200 rounded text-xs">
              {message.metadata.commandType}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
