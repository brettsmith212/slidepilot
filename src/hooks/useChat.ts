import { useState, useCallback, useRef } from 'react';
import { ChatMessage, ChatState } from '../types/chat';
import { MockAIService, MockAIResponse } from '../services/mockAI';

interface UseChatProps {
  onNavigateToSlide?: (slideIndex: number) => void;
  onEditSlide?: (slideIndex: number, elementId: string, changes: any) => void;
  onFormatSlide?: (slideIndex: number, elementId: string, changes: any) => void;
  currentSlideIndex?: number;
  totalSlides?: number;
  hasPresentation?: boolean;
}

export interface ChatActions {
  sendMessage: (content: string) => void;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  setTyping: (isTyping: boolean) => void;
}

export function useChat({
  onNavigateToSlide,
  onEditSlide,
  onFormatSlide,
  currentSlideIndex = 0,
  totalSlides = 0,
  hasPresentation = false
}: UseChatProps = {}) {
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
    isTyping: false,
    isConnected: true,
    lastActivity: new Date()
  });

  const timeoutRef = useRef<NodeJS.Timeout>();

  const addMessage = useCallback((message: ChatMessage) => {
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, message],
      lastActivity: new Date()
    }));
  }, []);

  const setTyping = useCallback((isTyping: boolean) => {
    setChatState(prev => ({ ...prev, isTyping }));
  }, []);

  const clearMessages = useCallback(() => {
    setChatState(prev => ({
      ...prev,
      messages: [],
      lastActivity: new Date()
    }));
  }, []);

  const executeAIAction = useCallback((response: MockAIResponse) => {
    switch (response.action) {
      case 'navigate':
        if (response.slideIndex !== undefined && onNavigateToSlide) {
          onNavigateToSlide(response.slideIndex);
        }
        break;
      
      case 'edit':
        if (onEditSlide && response.elementId) {
          onEditSlide(currentSlideIndex, response.elementId, response.changes || {});
        }
        break;
      
      case 'format':
        if (onFormatSlide && response.changes) {
          onFormatSlide(currentSlideIndex, 'current', response.changes);
        }
        break;
      
      case 'analyze':
        // Analysis is handled by the response message itself
        break;
      
      default:
        // No action needed for default responses
        break;
    }
  }, [currentSlideIndex, onNavigateToSlide, onEditSlide, onFormatSlide]);

  const sendMessage = useCallback(async (content: string) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    
    addMessage(userMessage);
    setTyping(true);

    try {
      // Get AI response
      const aiResponse = await MockAIService.getContextualResponse(
        content,
        currentSlideIndex,
        totalSlides,
        hasPresentation
      );

      // Simulate typing delay
      timeoutRef.current = setTimeout(() => {
        // Add AI response message
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          content: aiResponse.message,
          sender: 'ai',
          timestamp: new Date(),
          type: 'text',
          metadata: {
            commandType: aiResponse.action,
            slideReference: aiResponse.slideIndex !== undefined 
              ? `Slide ${aiResponse.slideIndex + 1}` 
              : undefined
          }
        };

        addMessage(aiMessage);
        setTyping(false);

        // Execute any associated actions
        executeAIAction(aiResponse);
      }, aiResponse.delay || 2000);

    } catch (error) {
      // Handle error
      setTimeout(() => {
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          content: 'Sorry, I encountered an error processing your request. Please try again.',
          sender: 'ai',
          timestamp: new Date(),
          type: 'error'
        };

        addMessage(errorMessage);
        setTyping(false);
      }, 1000);
    }
  }, [
    currentSlideIndex, 
    totalSlides, 
    hasPresentation, 
    addMessage, 
    setTyping, 
    executeAIAction
  ]);

  const addSystemMessage = useCallback((content: string) => {
    const systemMessage: ChatMessage = {
      id: `system-${Date.now()}`,
      content,
      sender: 'ai',
      timestamp: new Date(),
      type: 'system'
    };
    
    addMessage(systemMessage);
  }, [addMessage]);

  const actions: ChatActions = {
    sendMessage,
    addMessage,
    clearMessages,
    setTyping
  };

  return {
    chatState,
    actions,
    addSystemMessage
  };
}
