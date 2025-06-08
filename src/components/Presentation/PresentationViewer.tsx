import React, { useState } from 'react';
import SlideNavigation from './SlideNavigation';
import ViewerControls from './ViewerControls';

interface PresentationViewerProps {
  slides?: any[];
  currentSlideIndex?: number;
  onSlideChange?: (index: number) => void;
}

const PresentationViewer: React.FC<PresentationViewerProps> = ({
  slides = [],
  currentSlideIndex = 0,
  onSlideChange = () => {}
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [fitToWidth, setFitToWidth] = useState(true);

  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      onSlideChange(currentSlideIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      onSlideChange(currentSlideIndex + 1);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
    setFitToWidth(false);
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 25));
    setFitToWidth(false);
  };

  const handleFitToWidth = () => {
    setFitToWidth(true);
    setZoomLevel(100);
  };

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <ViewerControls
        zoomLevel={zoomLevel}
        fitToWidth={fitToWidth}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitToWidth={handleFitToWidth}
        slideNumber={currentSlideIndex + 1}
        totalSlides={slides.length}
      />
      
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div 
          className="bg-white shadow-lg rounded-lg border border-gray-200 aspect-[4/3] max-w-full max-h-full"
          style={{
            transform: `scale(${fitToWidth ? 1 : zoomLevel / 100})`,
            transformOrigin: 'center center'
          }}
        >
          {currentSlide ? (
            <div className="w-full h-full flex items-center justify-center p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {currentSlide.title || `Slide ${currentSlideIndex + 1}`}
                </h2>
                <p className="text-gray-600">
                  {currentSlide.content || 'Slide content will be rendered here'}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="text-lg mb-2">No presentation loaded</p>
                <p className="text-sm">Open a PowerPoint file to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <SlideNavigation
        slides={slides}
        currentSlideIndex={currentSlideIndex}
        onSlideChange={onSlideChange}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
};

export default PresentationViewer;
