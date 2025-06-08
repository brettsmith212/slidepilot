import { useState, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import MainLayout from "./components/Layout/MainLayout";
import PresentationViewer from "./components/Presentation/PresentationViewer";
import ChatInterface, { ChatInterfaceRef } from "./components/Chat/ChatInterface";
import { FileInfo } from "./services/fileService";
import { Slide, Presentation } from "./types/presentation";
import { SlideParser } from "./utils/slideParser";
import { useChat } from "./hooks/useChat";

function App() {
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loadedFile, setLoadedFile] = useState<FileInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const chatInterfaceRef = useRef<ChatInterfaceRef>(null);

  // Mock data for testing - moved up before usage
  const createMockSlides = (): Slide[] => [
    {
      id: 'mock-1',
      title: "Welcome to SlidePilot",
      elements: [
        {
          id: 'elem-1',
          type: 'text',
          x: 50,
          y: 50,
          width: 700,
          height: 100,
          content: "Welcome to SlidePilot",
          style: { fontSize: 32, fontFamily: 'Arial', color: '#333', textAlign: 'center', fontWeight: 'bold' }
        },
        {
          id: 'elem-2',
          type: 'text',
          x: 50,
          y: 200,
          width: 700,
          height: 200,
          content: "Your AI-powered presentation editor\n\nClick 'Open Presentation' to load a PowerPoint file and see the slide parsing in action.",
          style: { fontSize: 18, fontFamily: 'Arial', color: '#666', textAlign: 'center' }
        }
      ],
      backgroundColor: '#ffffff'
    },
    {
      id: 'mock-2',
      title: "Getting Started",
      elements: [
        {
          id: 'elem-3',
          type: 'text',
          x: 50,
          y: 50,
          width: 700,
          height: 100,
          content: "Getting Started",
          style: { fontSize: 28, fontFamily: 'Arial', color: '#333', textAlign: 'center', fontWeight: 'bold' }
        },
        {
          id: 'elem-4',
          type: 'text',
          x: 50,
          y: 180,
          width: 700,
          height: 300,
          content: "Steps to use SlidePilot:\n\n• Load a PowerPoint file using the Open button\n• Navigate through slides using the controls\n• Chat with the AI assistant in the sidebar\n• Edit and enhance your presentation",
          style: { fontSize: 16, fontFamily: 'Arial', color: '#666', textAlign: 'left' }
        }
      ],
      backgroundColor: '#ffffff'
    },
    {
      id: 'mock-3',
      title: "AI Assistant",
      elements: [
        {
          id: 'elem-5',
          type: 'text',
          x: 50,
          y: 50,
          width: 700,
          height: 100,
          content: "AI Assistant",
          style: { fontSize: 28, fontFamily: 'Arial', color: '#333', textAlign: 'center', fontWeight: 'bold' }
        },
        {
          id: 'elem-6',
          type: 'text',
          x: 50,
          y: 180,
          width: 500,
          height: 250,
          content: "The AI assistant will help you:\n\n• Edit slide content\n• Improve presentation structure\n• Generate new slides\n• Format and style elements",
          style: { fontSize: 16, fontFamily: 'Arial', color: '#666', textAlign: 'left' }
        },
        {
          id: 'elem-7',
          type: 'image',
          x: 580,
          y: 200,
          width: 150,
          height: 150,
          content: 'AI Assistant Illustration'
        }
      ],
      backgroundColor: '#ffffff'
    }
  ];

  // Get current slides before using in chat hook
  const currentSlides = presentation?.slides || createMockSlides();

  const { chatState, actions, addSystemMessage } = useChat({
    onNavigateToSlide: (slideIndex: number) => {
      if (slideIndex >= 0 && slideIndex < currentSlides.length) {
        setCurrentSlideIndex(slideIndex);
        addSystemMessage(`Navigated to slide ${slideIndex + 1}`);
      }
    },
    onEditSlide: (slideIndex: number, elementId: string, changes: any) => {
      addSystemMessage(`Applied edit to ${elementId} on slide ${slideIndex + 1}`);
      // In a real implementation, this would update the slide data
    },
    onFormatSlide: (slideIndex: number, elementId: string, changes: any) => {
      addSystemMessage(`Applied formatting changes to slide ${slideIndex + 1}`);
      // In a real implementation, this would update the slide formatting
    },
    currentSlideIndex,
    totalSlides: currentSlides.length,
    hasPresentation: !!presentation
  });

  const handleSlideChange = (index: number) => {
    setCurrentSlideIndex(index);
  };

  const handleFileLoaded = async (fileInfo: FileInfo) => {
    setLoadedFile(fileInfo);
    setError(null);
    
    try {
      // Parse the PowerPoint file using SlideParser
      if (fileInfo.content) {
        const parsedPresentation = await SlideParser.parsePowerPointFile(
          fileInfo.content, 
          fileInfo.name
        );
        setPresentation(parsedPresentation);
        setCurrentSlideIndex(0);
      }
    } catch (parseError) {
      console.error('Failed to parse presentation:', parseError);
      setError('Failed to parse the presentation file');
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setLoadedFile(null);
  };

  const mainContent = (
    <PresentationViewer
      slides={currentSlides}
      currentSlideIndex={currentSlideIndex}
      onSlideChange={handleSlideChange}
      onFileLoaded={handleFileLoaded}
      onError={handleError}
    />
  );

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {(error || (loadedFile && presentation)) && (
        <div className="flex-shrink-0 p-4 border-b border-gray-200">
          {error && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          
          {loadedFile && presentation && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                <strong>Loaded:</strong> {loadedFile.name}
              </p>
              <p className="text-green-700 text-xs mt-1">
                {presentation.slides.length} slides parsed
              </p>
            </div>
          )}
        </div>
      )}
      
      <div className="flex-1 min-h-0">
        <div className="flex flex-col h-full bg-white">
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
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {chatState.messages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {message.sender === 'user' ? (
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs">U</span>
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white">AI</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`inline-block max-w-full p-3 rounded-lg border ${
                      message.type === 'error' ? 'bg-red-50 border-red-200' :
                      message.type === 'system' ? 'bg-blue-50 border-blue-200' :
                      message.sender === 'user' ? 'bg-gray-100 border-gray-200' :
                      'bg-white border-gray-200'
                    }`}>
                      <div className={`text-sm whitespace-pre-wrap ${
                        message.type === 'error' ? 'text-red-800' :
                        message.type === 'system' ? 'text-blue-800' :
                        'text-gray-800'
                      }`}>
                        {message.content}
                      </div>
                    </div>
                    
                    <div className="mt-1 text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                      {message.metadata?.commandType && (
                        <span className="ml-2 px-2 py-0.5 bg-gray-200 rounded text-xs">
                          {message.metadata.commandType}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {chatState.isTyping && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">AI</span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="inline-block p-3 rounded-lg border bg-white border-gray-200">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-600">AI is typing</span>
                        <div className="flex gap-1 ml-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const message = formData.get('message') as string;
              if (message.trim()) {
                actions.sendMessage(message.trim());
                (e.target as HTMLFormElement).reset();
              }
            }} className="flex gap-2">
              <input
                name="message"
                type="text"
                placeholder="Ask me to edit slides, navigate, or analyze your presentation..."
                disabled={!chatState.isConnected}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!chatState.isConnected}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </form>
            
            <div className="mt-2 text-xs text-gray-500">
              Try: "Edit the title", "Go to slide 2", "Make the text larger"
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout sidebar={sidebarContent}>
      {mainContent}
    </MainLayout>
  );
}

export default App;
