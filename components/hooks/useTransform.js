import { useState, useCallback } from 'react';

export const useTransform = (initialScale = 1) => {
  const [scale, setScale] = useState(initialScale);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleWheel = useCallback((e, stage) => {
    e.evt.preventDefault();

    const oldScale = scale;
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * 1.1 : oldScale / 1.1;
    const limitedScale = Math.min(Math.max(newScale, 0.1), 5);

    setScale(limitedScale);
    setPosition({
      x: pointer.x - mousePointTo.x * limitedScale,
      y: pointer.y - mousePointTo.y * limitedScale,
    });
  }, [scale]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;
    
    const { movementX, movementY } = e.evt;
    setPosition(prev => ({
      x: prev.x + movementX,
      y: prev.y + movementY
    }));
  }, [isDragging]);

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
  };
}; 