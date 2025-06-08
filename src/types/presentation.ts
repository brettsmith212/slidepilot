export interface SlideElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'chart' | 'table';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style?: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
    textAlign?: 'left' | 'center' | 'right';
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
  };
  imageData?: string; // base64 encoded image data
}

export interface Slide {
  id: string;
  title?: string;
  elements: SlideElement[];
  backgroundColor?: string;
  backgroundImage?: string;
  notes?: string;
}

export interface Presentation {
  id: string;
  title: string;
  slides: Slide[];
  metadata: {
    author?: string;
    createdAt?: Date;
    modifiedAt?: Date;
    version?: string;
  };
}

export interface SlidePosition {
  x: number;
  y: number;
}

export interface SlideSize {
  width: number;
  height: number;
}

export interface ViewportSettings {
  zoom: number;
  fitToWidth: boolean;
  centerSlide: boolean;
}

// Placeholder types for parsing different presentation formats
export interface PowerPointMetadata {
  format: 'ppt' | 'pptx';
  slideCount: number;
  hasImages: boolean;
  hasAnimations: boolean;
}

export interface ParsedSlideContent {
  title?: string;
  content: string;
  elements: SlideElement[];
  thumbnail?: string;
}
