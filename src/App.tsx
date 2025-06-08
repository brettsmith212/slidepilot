import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import MainLayout from "./components/Layout/MainLayout";
import PresentationViewer from "./components/Presentation/PresentationViewer";

function App() {
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Mock data for testing
  const mockSlides = [
    { title: "Welcome to SlidePilot", content: "Your AI-powered presentation editor" },
    { title: "Getting Started", content: "Load a PowerPoint file to begin editing" },
    { title: "AI Assistant", content: "Use the sidebar to interact with your AI assistant" }
  ];

  const handleSlideChange = (index: number) => {
    setCurrentSlideIndex(index);
  };

  const mainContent = (
    <PresentationViewer
      slides={slides.length > 0 ? slides : mockSlides}
      currentSlideIndex={currentSlideIndex}
      onSlideChange={handleSlideChange}
    />
  );

  const sidebarContent = (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Assistant</h3>
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
