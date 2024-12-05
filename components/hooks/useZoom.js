import { useState, useCallback } from 'react';
import { logger } from '../../utils/logger';
import { PAPER_DIMENSIONS } from '../constants';

export const useZoom = (stageRef, initialScale = 1, minScale = 0.1, maxScale = 5) => {
  const [scale, setScale] = useState(initialScale);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const calculateCenterPosition = useCallback((windowWidth, windowHeight) => {
    return {
      x: (windowWidth - PAPER_DIMENSIONS.WIDTH) / 2,
      y: (windowHeight - PAPER_DIMENSIONS.HEIGHT) / 2
    };
  }, []);

  const handleWheel = useCallback((e) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();
    const oldScale = scale;
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * 1.1 : oldScale / 1.1;
    const limitedScale = Math.min(Math.max(newScale, minScale), maxScale);

    setScale(limitedScale);
    setPosition({
      x: pointer.x - mousePointTo.x * limitedScale,
      y: pointer.y - mousePointTo.y * limitedScale,
    });

    logger.debug('Zoom:', { oldScale, newScale: limitedScale, pointer });
  }, [scale, position.x, position.y, minScale, maxScale]);

  const handleDragStart = useCallback((e) => {
    if (e.evt.button === 1 || e.evt.buttons === 4 || e.evt.spaceKey) {
      setIsDragging(true);
      const stage = e.target.getStage();
      stage.container().style.cursor = 'grabbing';
    }
  }, []);

  const handleDragEnd = useCallback((e) => {
    setIsDragging(false);
    const stage = e.target.getStage();
    stage.container().style.cursor = 'default';
  }, []);

  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;
    
    const stage = e.target.getStage();
    const { x, y } = stage.getPointerPosition();
    const { movementX, movementY } = e.evt;

    setPosition(prev => ({
      x: prev.x + movementX,
      y: prev.y + movementY
    }));
  }, [isDragging]);

  const resetZoom = useCallback(() => {
    setScale(initialScale);
    const stage = stageRef.current?.getStage();
    if (stage) {
      const centerPos = calculateCenterPosition(stage.width(), stage.height());
      setPosition(centerPos);
    }
    logger.debug('Zoom reset');
  }, [initialScale, calculateCenterPosition, stageRef]);

  return {
    scale,
    setScale,
    position,
    setPosition,
    isDragging,
    handleWheel,
    handleDragStart,
    handleDragEnd,
    handleDragMove,
    resetZoom,
    calculateCenterPosition,
  };
}; 