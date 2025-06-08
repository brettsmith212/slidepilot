import React from 'react';
import { Bot } from 'lucide-react';

interface TypingIndicatorProps {
  className?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ className = '' }) => {
  return (
    <div className={`flex gap-3 ${className}`}>
      <div className="flex-shrink-0 mt-1">
        <Bot size={16} className="text-blue-600" />
      </div>
      
      <div className="flex-1">
        <div className="inline-block p-3 rounded-lg border bg-white border-gray-200">
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-600">AI is typing</span>
            <div className="flex gap-1 ml-2">
              <div 
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <div 
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <div 
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
