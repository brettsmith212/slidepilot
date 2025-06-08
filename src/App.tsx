import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import MainLayout from "./components/Layout/MainLayout";
import PresentationViewer from "./components/Presentation/PresentationViewer";
import { FileInfo } from "./services/fileService";

function App() {
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loadedFile, setLoadedFile] = useState<FileInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock data for testing
  const mockSlides = [
    { title: "Welcome to SlidePilot", content: "Your AI-powered presentation editor" },
    { title: "Getting Started", content: "Load a PowerPoint file to begin editing" },
    { title: "AI Assistant", content: "Use the sidebar to interact with your AI assistant" }
  ];

  const handleSlideChange = (index: number) => {
    setCurrentSlideIndex(index);
  };

  const handleFileLoaded = (fileInfo: FileInfo) => {
    setLoadedFile(fileInfo);
    setError(null);
    
    // For now, create mock slides based on the loaded file
    const mockSlidesFromFile = [
      { title: `${fileInfo.name} - Slide 1`, content: "File loaded successfully! Slide content will be parsed in the next step." },
      { title: `${fileInfo.name} - Slide 2`, content: "This is a placeholder for the second slide." },
      { title: `${fileInfo.name} - Slide 3`, content: "LibreOffice integration will handle actual slide parsing." }
    ];
    
    setSlides(mockSlidesFromFile);
    setCurrentSlideIndex(0);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setLoadedFile(null);
  };

  const mainContent = (
    <PresentationViewer
      slides={slides.length > 0 ? slides : mockSlides}
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
      
      {loadedFile && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">
            <strong>Loaded:</strong> {loadedFile.name}
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
