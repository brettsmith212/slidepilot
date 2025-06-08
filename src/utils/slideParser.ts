import { Slide, SlideElement, Presentation, PowerPointMetadata, ParsedSlideContent } from '../types/presentation';

export class SlideParser {
  /**
   * Parse PowerPoint file content (placeholder implementation)
   * In Milestone 2, this will integrate with LibreOffice headless
   */
  static async parsePowerPointFile(fileContent: Uint8Array, fileName: string): Promise<Presentation> {
    // This is a placeholder implementation that creates mock slides
    // In the real implementation, this would use LibreOffice to parse the file
    
    const metadata = this.extractMetadata(fileContent, fileName);
    const slides = this.createMockSlides(metadata.slideCount, fileName);
    
    return {
      id: this.generateId(),
      title: fileName.replace(/\.(ppt|pptx)$/i, ''),
      slides,
      metadata: {
        author: 'Unknown',
        createdAt: new Date(),
        modifiedAt: new Date(),
        version: '1.0'
      }
    };
  }

  /**
   * Extract basic metadata from PowerPoint file
   */
  private static extractMetadata(fileContent: Uint8Array, fileName: string): PowerPointMetadata {
    const format = fileName.toLowerCase().endsWith('.pptx') ? 'pptx' : 'ppt';
    
    // Mock implementation - in reality this would parse the file structure
    return {
      format,
      slideCount: Math.floor(Math.random() * 10) + 3, // 3-12 slides
      hasImages: Math.random() > 0.5,
      hasAnimations: Math.random() > 0.7
    };
  }

  /**
   * Create mock slides for testing (placeholder for LibreOffice integration)
   */
  private static createMockSlides(count: number, fileName: string): Slide[] {
    const slides: Slide[] = [];
    
    for (let i = 0; i < count; i++) {
      slides.push({
        id: this.generateId(),
        title: `Slide ${i + 1}`,
        elements: this.createMockSlideElements(i),
        backgroundColor: '#ffffff',
        notes: `Notes for slide ${i + 1}`
      });
    }
    
    return slides;
  }

  /**
   * Create mock slide elements
   */
  private static createMockSlideElements(slideIndex: number): SlideElement[] {
    const elements: SlideElement[] = [];
    
    // Title element
    elements.push({
      id: this.generateId(),
      type: 'text',
      x: 50,
      y: 50,
      width: 700,
      height: 80,
      content: `Slide ${slideIndex + 1} Title`,
      style: {
        fontSize: 32,
        fontFamily: 'Arial',
        color: '#333333',
        textAlign: 'center',
        fontWeight: 'bold'
      }
    });

    // Content element
    elements.push({
      id: this.generateId(),
      type: 'text',
      x: 50,
      y: 150,
      width: 700,
      height: 300,
      content: this.generateMockContent(slideIndex),
      style: {
        fontSize: 16,
        fontFamily: 'Arial',
        color: '#666666',
        textAlign: 'left'
      }
    });

    // Randomly add an image placeholder
    if (Math.random() > 0.6) {
      elements.push({
        id: this.generateId(),
        type: 'image',
        x: 550,
        y: 200,
        width: 200,
        height: 150,
        content: 'Image placeholder',
        style: {
          backgroundColor: '#f0f0f0'
        }
      });
    }

    return elements;
  }

  /**
   * Generate mock content for slides
   */
  private static generateMockContent(slideIndex: number): string {
    const contents = [
      'Welcome to this presentation! This slide demonstrates the basic text rendering capabilities of SlidePilot.',
      'This is the second slide with some bullet points:\n• Point one\n• Point two\n• Point three',
      'Here we have a slide with more detailed content. This text shows how longer paragraphs will be displayed in the slide viewer.',
      'Another slide with different content to show variety in the presentation structure.',
      'This slide could contain charts, graphs, or other visual elements in a real presentation.',
      'Final slide content showing the end of our sample presentation.'
    ];
    
    return contents[slideIndex % contents.length];
  }

  /**
   * Process slide for rendering
   */
  static processSlideForRendering(slide: Slide): ParsedSlideContent {
    return {
      title: slide.title,
      content: this.extractTextContent(slide),
      elements: slide.elements,
      thumbnail: this.generateThumbnail(slide)
    };
  }

  /**
   * Extract all text content from a slide
   */
  private static extractTextContent(slide: Slide): string {
    return slide.elements
      .filter(element => element.type === 'text' && element.content)
      .map(element => element.content)
      .join('\n\n');
  }

  /**
   * Generate thumbnail for slide (placeholder)
   */
  private static generateThumbnail(slide: Slide): string {
    // In real implementation, this would generate an actual thumbnail
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="160" height="120" xmlns="http://www.w3.org/2000/svg">
        <rect width="160" height="120" fill="${slide.backgroundColor || '#ffffff'}" stroke="#ccc"/>
        <text x="80" y="60" text-anchor="middle" font-size="12" fill="#333">
          ${slide.title || 'Slide'}
        </text>
      </svg>
    `)}`;
  }

  /**
   * Validate slide structure
   */
  static validateSlide(slide: Slide): boolean {
    return !!(slide.id && slide.elements && Array.isArray(slide.elements));
  }

  /**
   * Generate unique ID
   */
  private static generateId(): string {
    return `slide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
