import React from 'react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import FileOpenButton from './FileOpenButton';
import { FileInfo } from '../../services/fileService';

interface ViewerControlsProps {
  zoomLevel: number;
  fitToWidth: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToWidth: () => void;
  slideNumber: number;
  totalSlides: number;
  onFileLoaded?: (fileInfo: FileInfo) => void;
  onError?: (error: string) => void;
}

const ViewerControls: React.FC<ViewerControlsProps> = ({
  zoomLevel,
  fitToWidth,
  onZoomIn,
  onZoomOut,
  onFitToWidth,
  slideNumber,
  totalSlides,
  onFileLoaded = () => {},
  onError = () => {}
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-2 sm:px-4 py-2 sm:py-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 sm:gap-4 order-1">
          <div className="hidden sm:block">
            <FileOpenButton onFileLoaded={onFileLoaded} onError={onError} />
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={onZoomOut}
              className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              title="Zoom Out"
              aria-label="Zoom out"
            >
              <ZoomOut size={14} className="sm:w-4 sm:h-4" />
            </button>
            
            <span className="text-xs sm:text-sm text-gray-600 min-w-[40px] sm:min-w-[60px] text-center font-medium">
              {fitToWidth ? 'Fit' : `${zoomLevel}%`}
            </span>
            
            <button
              onClick={onZoomIn}
              className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              title="Zoom In"
              aria-label="Zoom in"
            >
              <ZoomIn size={14} className="sm:w-4 sm:h-4" />
            </button>
            
            <button
              onClick={onFitToWidth}
              className={`p-1.5 sm:p-2 rounded-md transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                fitToWidth
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
              title="Fit to Width"
              aria-label="Fit slide to width"
            >
              <Maximize size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
        
        <div className="text-xs sm:text-sm text-gray-600 font-medium order-2 sm:order-3">
          {totalSlides > 0 ? `Slide ${slideNumber} of ${totalSlides}` : 'No presentation loaded'}
        </div>
        
        {/* Mobile file open button */}
        <div className="sm:hidden order-3 w-full">
          <FileOpenButton onFileLoaded={onFileLoaded} onError={onError} />
        </div>
      </div>
    </div>
  );
};

export default ViewerControls;
