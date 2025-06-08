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
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FileOpenButton onFileLoaded={onFileLoaded} onError={onError} />
          
          <div className="flex items-center gap-2">
            <button
              onClick={onZoomOut}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            
            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {fitToWidth ? 'Fit' : `${zoomLevel}%`}
            </span>
            
            <button
              onClick={onZoomIn}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
            
            <button
              onClick={onFitToWidth}
              className={`p-2 rounded-md transition-colors ${
                fitToWidth
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
              title="Fit to Width"
            >
              <Maximize size={16} />
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          {totalSlides > 0 ? `Slide ${slideNumber} of ${totalSlides}` : 'No presentation loaded'}
        </div>
      </div>
    </div>
  );
};

export default ViewerControls;
