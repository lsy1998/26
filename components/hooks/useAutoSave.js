import { useEffect, useRef } from 'react';
import { saveCanvasData } from '../services/storage';
import { logger } from '../../utils/logger';

export const useAutoSave = (canvasData, interval = 60000) => {
  const lastSaveRef = useRef(Date.now());
  const timeoutRef = useRef(null);

  useEffect(() => {
    const autoSave = () => {
      const now = Date.now();
      if (now - lastSaveRef.current >= interval) {
        try {
          saveCanvasData(canvasData);
          lastSaveRef.current = now;
          logger.info('Auto-saved canvas data');
        } catch (error) {
          logger.error('Failed to auto-save canvas data:', error);
        }
      }
      timeoutRef.current = setTimeout(autoSave, interval);
    };

    timeoutRef.current = setTimeout(autoSave, interval);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [canvasData, interval]);
}; 