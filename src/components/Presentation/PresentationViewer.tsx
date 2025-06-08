import React, { useState, useRef, useEffect } from 'react';
import SlideNavigation from './SlideNavigation';
import ViewerControls from './ViewerControls';
import FileOpenButton from './FileOpenButton';
import SlideRenderer from './SlideRenderer';
import { FileInfo } from '../../services/fileService';
import { Slide } from '../../types/presentation';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { announceToScreenReader, getSlideAriaLabel } from '../../utils/accessibility';

interface PresentationViewerProps {
  slides?: Slide[];
  currentSlideIndex?: number;
  onSlideChange?: (index: number) => void;
  onFileLoaded?: (fileInfo: FileInfo) => void;
  onError?: (error: string) => void;
  onToggleSidebar?: () => void;
  onFocusChat?: () => void;
}

const PresentationViewer: React.FC<PresentationViewerProps> = ({
  slides = [],
  currentSlideIndex = 0,
  onSlideChange = () => {},
  onFileLoaded = () => {},
  onError = () => {},
  onToggleSidebar = () => {},
  onFocusChat = () => {}
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [fitToWidth, setFitToWidth] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      const newIndex = currentSlideIndex - 1;
      onSlideChange(newIndex);
      announceToScreenReader(getSlideAriaLabel(newIndex, slides.length, slides[newIndex]?.title));
    }
  };

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      const newIndex = currentSlideIndex + 1;
      onSlideChange(newIndex);
      announceToScreenReader(getSlideAriaLabel(newIndex, slides.length, slides[newIndex]?.title));
    }
  };

  const handleGoToFirst = () => {
    if (currentSlideIndex !== 0) {
      onSlideChange(0);
      announceToScreenReader(getSlideAriaLabel(0, slides.length, slides[0]?.title));
    }
  };

  const handleGoToLast = () => {
    const lastIndex = slides.length - 1;
    if (currentSlideIndex !== lastIndex) {
      onSlideChange(lastIndex);
      announceToScreenReader(getSlideAriaLabel(lastIndex, slides.length, slides[lastIndex]?.title));
    }
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 25, 200);
    setZoomLevel(newZoom);
    setFitToWidth(false);
    announceToScreenReader(`Zoomed in to ${newZoom}%`);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 25, 25);
    setZoomLevel(newZoom);
    setFitToWidth(false);
    announceToScreenReader(`Zoomed out to ${newZoom}%`);
  };

  const handleFitToWidth = () => {
    setFitToWidth(true);
    setZoomLevel(100);
    announceToScreenReader('Fit slide to width');
  };

  const handleOpenFile = () => {
    // Trigger file input or call file service directly
    announceToScreenReader('Opening file dialog');
  };

  const handleShowHelp = () => {
    setShowHelp(true);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onNextSlide: handleNext,
    onPreviousSlide: handlePrevious,
    onFirstSlide: handleGoToFirst,
    onLastSlide: handleGoToLast,
    onZoomIn: handleZoomIn,
    onZoomOut: handleZoomOut,
    onFitToWidth: handleFitToWidth,
    onOpenFile: handleOpenFile,
    onToggleSidebar: onToggleSidebar,
    onFocusChat: onFocusChat,
    onHelp: handleShowHelp
  });

  // Announce slide changes
  useEffect(() => {
    if (slides.length > 0) {
      const currentSlide = slides[currentSlideIndex];
      const announcement = getSlideAriaLabel(currentSlideIndex, slides.length, currentSlide?.title);
      announceToScreenReader(announcement);
    }
  }, [currentSlideIndex, slides]);

  const currentSlide = slides[currentSlideIndex];

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-full bg-gray-50"
      role="main"
      aria-label="Presentation viewer"
    >
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
      
      <div 
        className="flex-1 flex items-center justify-center p-4 overflow-hidden"
        role="region"
        aria-label="Slide content"
        aria-live="polite"
        aria-atomic="true"
      >
        {currentSlide ? (
          <div 
            className="shadow-lg rounded-lg overflow-hidden"
            style={{
              transform: `scale(${fitToWidth ? 1 : zoomLevel / 100})`,
              transformOrigin: 'center center'
            }}
            role="img"
            aria-label={getSlideAriaLabel(currentSlideIndex, slides.length, currentSlide.title)}
            tabIndex={0}
          >
            <SlideRenderer 
              slide={currentSlide}
              width={800}
              height={600}
            />
          </div>
        ) : (
          <div 
            className="bg-white shadow-lg rounded-lg border border-gray-200 aspect-[4/3] max-w-full max-h-full flex items-center justify-center"
            role="region"
            aria-label="No presentation loaded"
          >
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

      {/* Keyboard Shortcuts Help Modal */}
      {showHelp && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-title"
          onClick={() => setShowHelp(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 id="help-title" className="text-xl font-bold text-gray-900">
                  Keyboard Shortcuts
                </h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close help dialog"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Slide Navigation</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span>← →</span><span>Previous/Next slide</span></div>
                    <div className="flex justify-between"><span>Page Up/Down</span><span>Previous/Next slide</span></div>
                    <div className="flex justify-between"><span>Home</span><span>First slide</span></div>
                    <div className="flex justify-between"><span>End</span><span>Last slide</span></div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">View Controls</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span>Ctrl + =</span><span>Zoom in</span></div>
                    <div className="flex justify-between"><span>Ctrl + -</span><span>Zoom out</span></div>
                    <div className="flex justify-between"><span>Ctrl + 0</span><span>Fit to width</span></div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">File Operations</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span>Ctrl + O</span><span>Open presentation</span></div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Interface</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span>Ctrl + B</span><span>Toggle sidebar</span></div>
                    <div className="flex justify-between"><span>Ctrl + /</span><span>Focus chat input</span></div>
                    <div className="flex justify-between"><span>F1 or Shift + ?</span><span>Show this help</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresentationViewer;
