import { useEffect, useCallback } from 'react';

export const useKeyboard = ({
  onDelete,
  onUndo,
  onRedo,
  onSave,
  onEscape,
}) => {
  const handleKeyDown = useCallback((e) => {
    if (e.target.tagName === 'INPUT') return;

    if (e.key === 'Delete' || e.key === 'Backspace') {
      onDelete?.();
    } else if (e.key === 'z' && e.ctrlKey) {
      if (e.shiftKey) {
        onRedo?.();
      } else {
        onUndo?.();
      }
    } else if (e.key === 's' && e.ctrlKey) {
      e.preventDefault();
      onSave?.();
    } else if (e.key === 'Escape') {
      onEscape?.();
    }
  }, [onDelete, onUndo, onRedo, onSave, onEscape]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}; 