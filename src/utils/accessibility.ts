// Screen reader announcements
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Focus management
export function trapFocus(container: HTMLElement) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };
  
  container.addEventListener('keydown', handleTabKey);
  
  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
}

// Generate unique IDs for ARIA relationships
let idCounter = 0;
export function generateUniqueId(prefix: string = 'element'): string {
  return `${prefix}-${++idCounter}`;
}

// ARIA label helpers
export function getSlideAriaLabel(slideIndex: number, totalSlides: number, slideTitle?: string): string {
  const baseLabel = `Slide ${slideIndex + 1} of ${totalSlides}`;
  return slideTitle ? `${baseLabel}: ${slideTitle}` : baseLabel;
}

export function getChatMessageAriaLabel(
  sender: 'user' | 'ai', 
  timestamp: Date, 
  content: string
): string {
  const time = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const senderLabel = sender === 'user' ? 'You' : 'AI Assistant';
  return `${senderLabel} at ${time}: ${content}`;
}

// Keyboard navigation helpers
export function isNavigationKey(key: string): boolean {
  return [
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
    'Home', 'End', 'PageUp', 'PageDown',
    'Tab', 'Enter', 'Escape'
  ].includes(key);
}

export function getNavigationInstructions(): string {
  return `Use arrow keys or Page Up/Down to navigate slides. 
    Press Tab to move between interface elements. 
    Press F1 or Shift+? for keyboard shortcuts help.`;
}

// Color contrast helpers (for future theme support)
export function getContrastRatio(foreground: string, background: string): number {
  // Simplified contrast calculation - in a real app, use a proper color library
  const getLuminance = (color: string): number => {
    // This is a simplified version - use a proper color library for production
    if (color === '#ffffff' || color === 'white') return 1;
    if (color === '#000000' || color === 'black') return 0;
    return 0.5; // Default middle luminance
  };
  
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

export function meetsWCAGContrast(foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): boolean {
  const ratio = getContrastRatio(foreground, background);
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
}

// Focus management for dynamic content
export class FocusManager {
  private previousFocus: HTMLElement | null = null;
  
  saveFocus(): void {
    this.previousFocus = document.activeElement as HTMLElement;
  }
  
  restoreFocus(): void {
    if (this.previousFocus && this.previousFocus.focus) {
      this.previousFocus.focus();
    }
  }
  
  setFocusToFirst(container: HTMLElement): void {
    const focusableElement = container.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;
    
    if (focusableElement) {
      focusableElement.focus();
    }
  }
}

// Reduced motion detection
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// High contrast detection
export function prefersHighContrast(): boolean {
  return window.matchMedia('(prefers-contrast: high)').matches;
}

// ARIA live region helpers
export class LiveRegionManager {
  private politeRegion: HTMLElement;
  private assertiveRegion: HTMLElement;
  
  constructor() {
    this.politeRegion = this.createLiveRegion('polite');
    this.assertiveRegion = this.createLiveRegion('assertive');
  }
  
  private createLiveRegion(priority: 'polite' | 'assertive'): HTMLElement {
    const region = document.createElement('div');
    region.setAttribute('aria-live', priority);
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    region.id = `live-region-${priority}`;
    document.body.appendChild(region);
    return region;
  }
  
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const region = priority === 'polite' ? this.politeRegion : this.assertiveRegion;
    region.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      region.textContent = '';
    }, 1000);
  }
  
  cleanup(): void {
    if (this.politeRegion.parentNode) {
      this.politeRegion.parentNode.removeChild(this.politeRegion);
    }
    if (this.assertiveRegion.parentNode) {
      this.assertiveRegion.parentNode.removeChild(this.assertiveRegion);
    }
  }
}

// Keyboard shortcut help modal content
export function getKeyboardShortcutsHelp(): Array<{category: string, shortcuts: Array<{keys: string, description: string}>}> {
  return [
    {
      category: 'Slide Navigation',
      shortcuts: [
        { keys: '← →', description: 'Previous/Next slide' },
        { keys: 'Page Up/Down', description: 'Previous/Next slide' },
        { keys: 'Home', description: 'First slide' },
        { keys: 'End', description: 'Last slide' }
      ]
    },
    {
      category: 'View Controls',
      shortcuts: [
        { keys: 'Ctrl + =', description: 'Zoom in' },
        { keys: 'Ctrl + -', description: 'Zoom out' },
        { keys: 'Ctrl + 0', description: 'Fit to width' }
      ]
    },
    {
      category: 'File Operations',
      shortcuts: [
        { keys: 'Ctrl + O', description: 'Open presentation' }
      ]
    },
    {
      category: 'Interface',
      shortcuts: [
        { keys: 'Ctrl + B', description: 'Toggle sidebar' },
        { keys: 'Ctrl + /', description: 'Focus chat input' },
        { keys: 'F1 or Shift + ?', description: 'Show this help' }
      ]
    }
  ];
}
