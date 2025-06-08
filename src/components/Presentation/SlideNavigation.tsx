import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Slide } from '../../types/presentation';

interface SlideNavigationProps {
  slides: Slide[];
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
    <div className="bg-white border-t border-gray-200 p-2 sm:p-4">
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <button
          onClick={onPrevious}
          disabled={currentSlideIndex === 0}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </button>
        
        <span className="text-xs sm:text-sm text-gray-600 font-medium">
          {slides.length > 0 ? `${currentSlideIndex + 1} of ${slides.length}` : 'No slides'}
        </span>
        
        <button
          onClick={onNext}
          disabled={currentSlideIndex >= slides.length - 1}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
        >
          <span className="hidden sm:inline">Next</span>
          <span className="sm:hidden">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
      
      {slides.length > 0 && (
        <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => onSlideChange(index)}
              className={`flex-shrink-0 w-16 h-12 sm:w-20 sm:h-15 bg-gray-100 border-2 rounded-md hover:bg-gray-200 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                index === currentSlideIndex ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              title={`Slide ${index + 1}${slide.title ? `: ${slide.title}` : ''}`}
            >
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xs text-gray-600 font-medium">
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
