import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideNavigationProps {
  slides: any[];
  currentSlideIndex: number;
  onSlideChange: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const SlideNavigation: React.FC<SlideNavigationProps> = ({
  slides,
  currentSlideIndex,
  onSlideChange,
  onPrevious,
  onNext
}) => {
  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onPrevious}
          disabled={currentSlideIndex === 0}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        
        <span className="text-sm text-gray-600">
          {slides.length > 0 ? `${currentSlideIndex + 1} of ${slides.length}` : 'No slides'}
        </span>
        
        <button
          onClick={onNext}
          disabled={currentSlideIndex >= slides.length - 1}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
      
      {slides.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => onSlideChange(index)}
              className={`flex-shrink-0 w-20 h-15 bg-gray-100 border-2 rounded-md hover:bg-gray-200 transition-colors ${
                index === currentSlideIndex ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xs text-gray-600">
                  {index + 1}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SlideNavigation;
