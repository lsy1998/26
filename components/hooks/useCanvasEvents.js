import { useCallback } from 'react';
import { isPointInPaper } from '../utils/canvasHelpers';
import { PAPER_DIMENSIONS } from '../constants';

export const useCanvasEvents = ({
  setIsDrawing,
  addLine,
  updateLastLine,
  isErasing,
  eraseLines,
  setLines,
  position,
  scale,
  isOverImage,
  isOverPin,
  isOverText,
  isDrawing,
}) => {
  const handleMouseDown = useCallback((e) => {
    // 如果不是左键点击，不处理绘制
    if (e.evt.button !== 0) return;

    // 如果点击在可交互元素上，不处理绘制
    if (isOverImage || isOverPin || isOverText) return;

    const stage = e.target.getStage();
    const pos = {
      x: (e.evt.clientX - position.x) / scale,
      y: (e.evt.clientY - position.y) / scale
    };
    
    if (!pos || !isPointInPaper(pos, PAPER_DIMENSIONS.WIDTH, PAPER_DIMENSIONS.HEIGHT)) return;

    setIsDrawing(true);

    if (!isErasing) {
      addLine(pos);
    }
  }, [setIsDrawing, addLine, isErasing, position, scale, isOverImage, isOverPin, isOverText]);

  const handleMouseMove = useCallback((e) => {
    if (!e.target.getStage()) return;

    const pos = {
      x: (e.evt.clientX - position.x) / scale,
      y: (e.evt.clientY - position.y) / scale
    };

    if (!pos || !isPointInPaper(pos, PAPER_DIMENSIONS.WIDTH, PAPER_DIMENSIONS.HEIGHT)) return;

    if (!isDrawing) return;

    if (isErasing) {
      eraseLines(pos);
    } else {
      updateLastLine(pos);
    }
  }, [position, scale, isErasing, eraseLines, updateLastLine, isPointInPaper, isDrawing]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, [setIsDrawing]);

  const handleMouseEnter = useCallback((e) => {
    if (isErasing) {
      document.body.style.cursor = 'none';
    }
  }, [isErasing]);

  const handleMouseLeave = useCallback(() => {
    setIsDrawing(false);
    document.body.style.cursor = 'default';
  }, [setIsDrawing]);

  // 触摸事件处理
  const handleTouchStart = useCallback((e) => {
    e.evt.preventDefault();
    handleMouseDown(e);
  }, [handleMouseDown]);

  const handleTouchMove = useCallback((e) => {
    e.evt.preventDefault();
    handleMouseMove(e);
  }, [handleMouseMove]);

  const handleTouchEnd = useCallback((e) => {
    e.evt.preventDefault();
    handleMouseUp();
  }, [handleMouseUp]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}; 