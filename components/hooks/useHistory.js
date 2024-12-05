import { useState, useCallback } from 'react';
import { logger } from '../../utils/logger';

const MAX_HISTORY = 50;

export const useHistory = (initialState) => {
  const [history, setHistory] = useState([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const pushState = useCallback((newState) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(newState);
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      }
      return newHistory;
    });
    setCurrentIndex(prev => Math.min(prev + 1, MAX_HISTORY - 1));
    logger.debug('History: pushed new state', { historyLength: history.length, currentIndex });
  }, [currentIndex, history.length]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      logger.debug('History: undo', { newIndex: currentIndex - 1 });
      return history[currentIndex - 1];
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      logger.debug('History: redo', { newIndex: currentIndex + 1 });
      return history[currentIndex + 1];
    }
    return null;
  }, [currentIndex, history]);

  return {
    currentState: history[currentIndex],
    pushState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1
  };
}; 