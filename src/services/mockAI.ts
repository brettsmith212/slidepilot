import { ChatResponse, ChatMessage } from '../types/chat';

export interface MockAIResponse {
  message: string;
  action?: 'navigate' | 'edit' | 'create' | 'format' | 'analyze';
  slideIndex?: number;
  elementId?: string;
  changes?: any;
  delay?: number;
}

export class MockAIService {
  private static responses: Record<string, MockAIResponse[]> = {
    // Navigation commands
    navigate: [
      {
        message: "I'll take you to slide 3 now.",
        action: 'navigate',
        slideIndex: 2,
        delay: 1500
      },
      {
        message: "Moving to the next slide for you.",
        action: 'navigate',
        slideIndex: 1,
        delay: 1200
      },
      {
        message: "Here's the first slide of your presentation.",
        action: 'navigate',
        slideIndex: 0,
        delay: 1000
      }
    ],

    // Editing commands
    edit: [
      {
        message: "I've updated the slide title for you. The change will be applied to the current slide.",
        action: 'edit',
        elementId: 'title',
        changes: { content: 'Updated Title' },
        delay: 2000
      },
      {
        message: "I've modified the text content as requested. You should see the changes reflected on the slide.",
        action: 'edit',
        elementId: 'content',
        delay: 2500
      },
      {
        message: "The bullet points have been updated according to your request.",
        action: 'edit',
        elementId: 'content',
        delay: 1800
      }
    ],

    // Formatting commands
    format: [
      {
        message: "I've increased the font size to make the text more readable.",
        action: 'format',
        changes: { fontSize: 24 },
        delay: 1500
      },
      {
        message: "The text is now bold and should stand out better.",
        action: 'format',
        changes: { fontWeight: 'bold' },
        delay: 1400
      },
      {
        message: "I've centered the text alignment for better visual impact.",
        action: 'format',
        changes: { textAlign: 'center' },
        delay: 1600
      }
    ],

    // Analysis commands
    analyze: [
      {
        message: "Based on my analysis, your presentation has good structure. Here are some suggestions:\n\n• Consider adding more visual elements to slides 2-3\n• The content flow is logical and easy to follow\n• Slide titles are clear and informative\n• You might want to add a conclusion slide",
        action: 'analyze',
        delay: 3000
      },
      {
        message: "Your presentation looks well-organized! I notice:\n\n• Consistent formatting across slides\n• Good use of bullet points for readability\n• Clear slide progression\n• Consider adding images or charts for visual appeal",
        action: 'analyze',
        delay: 2800
      }
    ],

    // Default responses
    default: [
      {
        message: "I understand you'd like help with your presentation. I can assist with:\n\n• Editing slide content\n• Navigating between slides\n• Formatting text and elements\n• Analyzing your presentation\n\nWhat would you like me to help you with?",
        delay: 2000
      },
      {
        message: "I'm here to help you improve your presentation! Try asking me to:\n\n• \"Edit the title of this slide\"\n• \"Go to slide 2\"\n• \"Make the text larger\"\n• \"Analyze this presentation\"",
        delay: 1800
      },
      {
        message: "I can help you with various presentation tasks. Could you be more specific about what you'd like me to do? For example, do you want to edit content, navigate slides, or format elements?",
        delay: 2200
      }
    ],

    // Error responses
    error: [
      {
        message: "I'm not sure how to help with that request. Could you try asking me to edit content, navigate slides, format text, or analyze your presentation?",
        delay: 1500
      },
      {
        message: "I didn't quite understand that. I can help with editing slides, navigation, formatting, and analysis. What would you like me to do?",
        delay: 1600
      }
    ],

    // Greeting responses
    greeting: [
      {
        message: "Hello! I'm your AI presentation assistant. I'm ready to help you edit, navigate, and improve your slides. What would you like to work on?",
        delay: 1200
      },
      {
        message: "Hi there! I can help you with your presentation. Feel free to ask me to edit content, change formatting, or analyze your slides.",
        delay: 1400
      }
    ]
  };

  static async generateResponse(userMessage: string): Promise<MockAIResponse> {
    const message = userMessage.toLowerCase().trim();
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Determine response category based on keywords
    const category = this.categorizeMessage(message);
    const responses = this.responses[category] || this.responses.default;
    
    // Select a random response from the category
    const randomIndex = Math.floor(Math.random() * responses.length);
    const response = responses[randomIndex];

    // Add some randomness to delay
    const baseDelay = response.delay || 2000;
    const randomDelay = baseDelay + Math.random() * 1000;

    return {
      ...response,
      delay: randomDelay
    };
  }

  private static categorizeMessage(message: string): string {
    // Greeting patterns
    if (this.matchesPatterns(message, ['hello', 'hi', 'hey', 'greetings'])) {
      return 'greeting';
    }

    // Navigation patterns
    if (this.matchesPatterns(message, [
      'go to slide', 'navigate to', 'show slide', 'next slide', 'previous slide',
      'first slide', 'last slide', 'slide 1', 'slide 2', 'slide 3'
    ])) {
      return 'navigate';
    }

    // Editing patterns
    if (this.matchesPatterns(message, [
      'edit', 'change', 'update', 'modify', 'replace', 'add text',
      'edit title', 'change content', 'update text'
    ])) {
      return 'edit';
    }

    // Formatting patterns
    if (this.matchesPatterns(message, [
      'format', 'font size', 'make bold', 'center', 'align', 'color',
      'larger', 'smaller', 'bigger', 'bold', 'italic'
    ])) {
      return 'format';
    }

    // Analysis patterns
    if (this.matchesPatterns(message, [
      'analyze', 'review', 'check', 'improve', 'suggestions',
      'feedback', 'what do you think', 'how does it look'
    ])) {
      return 'analyze';
    }

    // Check for specific slide references
    if (message.includes('slide ') && /\d/.test(message)) {
      return 'navigate';
    }

    return 'default';
  }

  private static matchesPatterns(message: string, patterns: string[]): boolean {
    return patterns.some(pattern => message.includes(pattern));
  }

  // Get a contextual response based on current slide and presentation state
  static async getContextualResponse(
    userMessage: string,
    currentSlideIndex: number,
    totalSlides: number,
    hasPresentation: boolean
  ): Promise<MockAIResponse> {
    const baseResponse = await this.generateResponse(userMessage);
    
    // Add contextual information to navigation responses
    if (baseResponse.action === 'navigate') {
      if (baseResponse.slideIndex !== undefined) {
        if (baseResponse.slideIndex >= totalSlides) {
          return {
            message: `I can't navigate to slide ${baseResponse.slideIndex + 1} because your presentation only has ${totalSlides} slides. Would you like me to take you to the last slide instead?`,
            delay: baseResponse.delay
          };
        }
        
        if (baseResponse.slideIndex === currentSlideIndex) {
          return {
            message: `You're already on slide ${currentSlideIndex + 1}. Would you like to go to a different slide?`,
            delay: baseResponse.delay
          };
        }
      }
    }

    // Add presentation context to analysis responses
    if (baseResponse.action === 'analyze' && !hasPresentation) {
      return {
        message: "I'd be happy to analyze your presentation! However, it looks like you're viewing the default slides. Please load a PowerPoint file first, and then I can provide detailed analysis of your content.",
        delay: baseResponse.delay
      };
    }

    return baseResponse;
  }

  // Generate help text for available commands
  static getHelpText(): string {
    return `I can help you with various presentation tasks:

**Navigation:**
• "Go to slide 3" or "Show me slide 2"
• "Next slide" or "Previous slide"
• "Take me to the first slide"

**Editing:**
• "Edit the title of this slide"
• "Change the content on slide 2"
• "Update the bullet points"

**Formatting:**
• "Make the text larger"
• "Make the title bold"
• "Center align the text"

**Analysis:**
• "Analyze this presentation"
• "What can be improved?"
• "Give me feedback on the slides"

Just type naturally - I'll understand what you want to do!`;
  }
}
