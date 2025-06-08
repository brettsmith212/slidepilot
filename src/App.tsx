import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import MainLayout from "./components/Layout/MainLayout";
import PresentationViewer from "./components/Presentation/PresentationViewer";
import { FileInfo } from "./services/fileService";
import { Slide, Presentation } from "./types/presentation";
import { SlideParser } from "./utils/slideParser";

function App() {
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loadedFile, setLoadedFile] = useState<FileInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock data for testing
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

  const currentSlides = presentation?.slides || createMockSlides();

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
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Assistant</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
      
      {loadedFile && presentation && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">
            <strong>Loaded:</strong> {loadedFile.name}
          </p>
          <p className="text-green-700 text-xs mt-1">
            {presentation.slides.length} slides parsed
          </p>
        </div>
      )}
      
      <p className="text-gray-600 text-sm">
        Chat interface will be implemented in the next steps
      </p>
    </div>
  );

  return (
    <MainLayout sidebar={sidebarContent}>
      {mainContent}
    </MainLayout>
  );
}

export default App;
