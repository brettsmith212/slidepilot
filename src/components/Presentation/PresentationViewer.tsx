import React, { useState } from 'react';
import SlideNavigation from './SlideNavigation';
import ViewerControls from './ViewerControls';
import FileOpenButton from './FileOpenButton';
import SlideRenderer from './SlideRenderer';
import { FileInfo } from '../../services/fileService';
import { Slide } from '../../types/presentation';

interface PresentationViewerProps {
  slides?: Slide[];
  currentSlideIndex?: number;
  onSlideChange?: (index: number) => void;
  onFileLoaded?: (fileInfo: FileInfo) => void;
  onError?: (error: string) => void;
}

const PresentationViewer: React.FC<PresentationViewerProps> = ({
  slides = [],
  currentSlideIndex = 0,
  onSlideChange = () => {},
  onFileLoaded = () => {},
  onError = () => {}
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
        onFileLoaded={onFileLoaded}
        onError={onError}
      />
      
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        {currentSlide ? (
          <div 
            className="shadow-lg rounded-lg overflow-hidden"
            style={{
              transform: `scale(${fitToWidth ? 1 : zoomLevel / 100})`,
              transformOrigin: 'center center'
            }}
          >
            <SlideRenderer 
              slide={currentSlide}
              width={800}
              height={600}
            />
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg border border-gray-200 aspect-[4/3] max-w-full max-h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg mb-4">No presentation loaded</p>
              <p className="text-sm mb-6">Open a PowerPoint file to get started</p>
              <FileOpenButton onFileLoaded={onFileLoaded} onError={onError} />
            </div>
          </div>
        )}
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
