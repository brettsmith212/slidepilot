export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'command' | 'error' | 'system';
  metadata?: {
    isTyping?: boolean;
    slideReference?: string;
    commandType?: string;
    error?: string;
  };
}

export interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  isConnected: boolean;
  lastActivity: Date | null;
}

export interface ChatCommand {
  command: string;
  description: string;
  examples: string[];
  category: 'editing' | 'navigation' | 'formatting' | 'analysis';
}

export interface ChatResponse {
  message: string;
  action?: 'navigate' | 'edit' | 'create' | 'format';
  slideIndex?: number;
  elementId?: string;
  changes?: any;
}

export interface TypingIndicator {
  isVisible: boolean;
  duration: number;
}

// Available chat commands for the AI assistant
export const CHAT_COMMANDS: ChatCommand[] = [
  {
    command: 'edit slide',
    description: 'Edit content on the current slide',
    examples: [
      'Edit the title of this slide',
      'Change the bullet points on slide 2',
      'Update the text in the main content area'
    ],
    category: 'editing'
  },
  {
    command: 'navigate',
    description: 'Navigate to a specific slide',
    examples: [
      'Go to slide 3',
      'Show me the next slide',
      'Take me to the last slide'
    ],
    category: 'navigation'
  },
  {
    command: 'format',
    description: 'Format text or elements on slides',
    examples: [
      'Make the title bold',
      'Change font size to 24px',
      'Center align the text'
    ],
    category: 'formatting'
  },
  {
    command: 'analyze',
    description: 'Analyze presentation content and structure',
    examples: [
      'Analyze this presentation',
      'What can be improved?',
      'Check for consistency'
    ],
    category: 'analysis'
  }
];
