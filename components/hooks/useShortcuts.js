import { useEffect, useCallback } from 'react';
import { logger } from '../../utils/logger';

export const useShortcuts = ({
  onToggleToolbar,
  onToggleEraser,
  onClearCanvas,
  onResetView,
  onToggleGrid,
  brushes,
  setBrush,
}) => {
  const handleKeyDown = useCallback((e) => {
    if (e.target.tagName === 'INPUT') return;

    // 工具栏快捷键
    if (e.key === 'Tab') {
      e.preventDefault();
      onToggleToolbar?.();
    }
    // 橡皮擦快捷键
    else if (e.key === 'e') {
      onToggleEraser?.();
    }
    // 清空画布快捷键
    else if (e.key === 'c' && e.ctrlKey && e.shiftKey) {
      e.preventDefault();
      onClearCanvas?.();
    }
    // 重置视图快捷键
    else if (e.key === 'r' && e.ctrlKey) {
      e.preventDefault();
      onResetView?.();
    }
    // 切换网格快捷键
    else if (e.key === 'g' && e.ctrlKey) {
      e.preventDefault();
      onToggleGrid?.();
    }
    // 画笔切换快捷键
    else if (e.key >= '1' && e.key <= '9') {
      const index = parseInt(e.key) - 1;
      const brushTypes = Object.keys(brushes);
      if (index < brushTypes.length) {
        setBrush?.(brushTypes[index]);
      }
    }

    logger.debug('Shortcut pressed:', { key: e.key, ctrl: e.ctrlKey, shift: e.shiftKey });
  }, [onToggleToolbar, onToggleEraser, onClearCanvas, onResetView, onToggleGrid, brushes, setBrush]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}; 