import { useEffect } from 'react';

interface KeyboardShortcuts {
  onSave?: () => void;
  onDownload?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  onTogglePreview?: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input field
      const target = e.target as HTMLElement;
      const isInputField = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.contentEditable === 'true';

      // Don't trigger shortcuts when typing in input fields
      if (isInputField && !e.ctrlKey && !e.metaKey) return;

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      if (isCtrlOrCmd) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            shortcuts.onSave?.();
            break;
          case 'd':
            e.preventDefault();
            shortcuts.onDownload?.();
            break;
          case '=':
          case '+':
            e.preventDefault();
            shortcuts.onZoomIn?.();
            break;
          case '-':
            e.preventDefault();
            shortcuts.onZoomOut?.();
            break;
          case '0':
            e.preventDefault();
            shortcuts.onResetZoom?.();
            break;
          case 'p':
            e.preventDefault();
            shortcuts.onTogglePreview?.();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};