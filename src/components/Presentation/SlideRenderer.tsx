import React from 'react';
import { Slide, SlideElement } from '../../types/presentation';

interface SlideRendererProps {
  slide: Slide;
  width?: number;
  height?: number;
  className?: string;
}

interface SlideElementRendererProps {
  element: SlideElement;
  containerWidth: number;
  containerHeight: number;
}

const SlideElementRenderer: React.FC<SlideElementRendererProps> = ({ 
  element, 
  containerWidth, 
  containerHeight 
}) => {
  const scaleX = containerWidth / 800; // Assuming standard slide width of 800
  const scaleY = containerHeight / 600; // Assuming standard slide height of 600
  
  const scaledStyle = {
    position: 'absolute' as const,
    left: `${(element.x * scaleX)}px`,
    top: `${(element.y * scaleY)}px`,
    width: `${(element.width * scaleX)}px`,
    height: `${(element.height * scaleY)}px`,
    fontSize: element.style?.fontSize ? `${element.style.fontSize * Math.min(scaleX, scaleY)}px` : undefined,
    fontFamily: element.style?.fontFamily,
    color: element.style?.color,
    backgroundColor: element.style?.backgroundColor,
    textAlign: element.style?.textAlign,
    fontWeight: element.style?.fontWeight,
    fontStyle: element.style?.fontStyle,
    display: 'flex',
    alignItems: element.type === 'text' ? 'flex-start' : 'center',
    justifyContent: element.style?.textAlign === 'center' ? 'center' : 
                   element.style?.textAlign === 'right' ? 'flex-end' : 'flex-start',
    padding: element.type === 'text' ? '8px' : '0',
    overflow: 'hidden',
    wordWrap: 'break-word' as const,
    whiteSpace: 'pre-wrap' as const
  };

  const renderElement = () => {
    switch (element.type) {
      case 'text':
        return (
          <div style={scaledStyle}>
            {element.content}
          </div>
        );
      
      case 'image':
        return (
          <div 
            style={{
              ...scaledStyle,
              border: '2px dashed #ccc',
              backgroundColor: '#f8f8f8',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: `${12 * Math.min(scaleX, scaleY)}px`,
              color: '#666'
            }}
          >
            {element.imageData ? (
              <img 
                src={element.imageData} 
                alt="Slide image"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <div className="text-center">
                <div>📷</div>
                <div>Image</div>
              </div>
            )}
          </div>
        );
      
      case 'shape':
        return (
          <div 
            style={{
              ...scaledStyle,
              border: '1px solid #333',
              backgroundColor: element.style?.backgroundColor || '#e0e0e0'
            }}
          />
        );
      
      case 'chart':
        return (
          <div 
            style={{
              ...scaledStyle,
              border: '2px dashed #333',
              backgroundColor: '#f0f0f0',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: `${12 * Math.min(scaleX, scaleY)}px`,
              color: '#666'
            }}
          >
            <div className="text-center">
              <div>📊</div>
              <div>Chart</div>
            </div>
          </div>
        );
      
      case 'table':
        return (
          <div 
            style={{
              ...scaledStyle,
              border: '1px solid #333',
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: `${12 * Math.min(scaleX, scaleY)}px`,
              color: '#666'
            }}
          >
            <div className="text-center">
              <div>📋</div>
              <div>Table</div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return renderElement();
};

const SlideRenderer: React.FC<SlideRendererProps> = ({ 
  slide, 
  width = 800, 
  height = 600, 
  className = '' 
}) => {
  return (
    <div 
      className={`relative border border-gray-200 bg-white ${className}`}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        backgroundColor: slide.backgroundColor || '#ffffff',
        backgroundImage: slide.backgroundImage ? `url(${slide.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {slide.elements.map((element) => (
        <SlideElementRenderer
          key={element.id}
          element={element}
          containerWidth={width}
          containerHeight={height}
        />
      ))}
      
      {/* Overlay for empty slides */}
      {slide.elements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-2">📄</div>
            <div>Empty Slide</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlideRenderer;
