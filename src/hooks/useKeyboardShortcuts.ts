import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  description: string;
  action: () => void;
}

export interface KeyboardShortcutHandlers {
  onNextSlide: () => void;
  onPreviousSlide: () => void;
  onFirstSlide: () => void;
  onLastSlide: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToWidth: () => void;
  onOpenFile: () => void;
  onToggleSidebar: () => void;
  onFocusChat: () => void;
  onHelp: () => void;
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers, enabled: boolean = true) {
  const shortcuts: KeyboardShortcut[] = [
    // Slide Navigation
    {
      key: 'ArrowRight',
      description: 'Next slide',
      action: handlers.onNextSlide
    },
    {
      key: 'ArrowLeft',
      description: 'Previous slide',
      action: handlers.onPreviousSlide
    },
    {
      key: 'Home',
      description: 'First slide',
      action: handlers.onFirstSlide
    },
    {
      key: 'End',
      description: 'Last slide',
      action: handlers.onLastSlide
    },
    {
      key: 'PageDown',
      description: 'Next slide',
      action: handlers.onNextSlide
    },
    {
      key: 'PageUp',
      description: 'Previous slide',
      action: handlers.onPreviousSlide
    },
    
    // Zoom Controls
    {
      key: '=',
      ctrlKey: true,
      description: 'Zoom in',
      action: handlers.onZoomIn
    },
    {
      key: '-',
      ctrlKey: true,
      description: 'Zoom out',
      action: handlers.onZoomOut
    },
    {
      key: '0',
      ctrlKey: true,
      description: 'Fit to width',
      action: handlers.onFitToWidth
    },
    
    // File Operations
    {
      key: 'o',
      ctrlKey: true,
      description: 'Open file',
      action: handlers.onOpenFile
    },
    
    // Interface Controls
    {
      key: 'b',
      ctrlKey: true,
      description: 'Toggle sidebar',
      action: handlers.onToggleSidebar
    },
    {
      key: '/',
      ctrlKey: true,
      description: 'Focus chat input',
      action: handlers.onFocusChat
    },
    {
      key: 'F1',
      description: 'Show help',
      action: handlers.onHelp
    },
    {
      key: '?',
      shiftKey: true,
      description: 'Show help',
      action: handlers.onHelp
    }
  ];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    for (const shortcut of shortcuts) {
      const isMatch = 
        event.key === shortcut.key &&
        Boolean(event.ctrlKey) === Boolean(shortcut.ctrlKey) &&
        Boolean(event.shiftKey) === Boolean(shortcut.shiftKey) &&
        Boolean(event.altKey) === Boolean(shortcut.altKey) &&
        Boolean(event.metaKey) === Boolean(shortcut.metaKey);

      if (isMatch) {
        event.preventDefault();
        event.stopPropagation();
        shortcut.action();
        break;
      }
    }
  }, [enabled, shortcuts]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, enabled]);

  return {
    shortcuts,
    enabled
  };
}

export function getShortcutText(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  
  if (shortcut.ctrlKey) parts.push('Ctrl');
  if (shortcut.shiftKey) parts.push('Shift');
  if (shortcut.altKey) parts.push('Alt');
  if (shortcut.metaKey) parts.push('Cmd');
  
  parts.push(formatKey(shortcut.key));
  
  return parts.join(' + ');
}

function formatKey(key: string): string {
  const keyMap: Record<string, string> = {
    'ArrowUp': '↑',
    'ArrowDown': '↓',
    'ArrowLeft': '←',
    'ArrowRight': '→',
    'PageUp': 'Page Up',
    'PageDown': 'Page Down',
    'Home': 'Home',
    'End': 'End',
    'F1': 'F1',
    '=': '=',
    '-': '-',
    '0': '0',
    '/': '/',
    '?': '?'
  };
  
  return keyMap[key] || key.toUpperCase();
}
