import { useCallback } from 'react';

export const useEraser = (scale) => {
  const eraseLines = useCallback((lines, eraserX, eraserY, eraserSize) => {
    const effectiveEraserSize = eraserSize / scale;
    const eraserSizeSquared = effectiveEraserSize * effectiveEraserSize;

    // 使用 Web Worker 处理擦除计算
    if (window.Worker) {
      return new Promise((resolve) => {
        const worker = new Worker('/workers/eraser-worker.js');
        worker.postMessage({
          lines,
          eraserX,
          eraserY,
          eraserSizeSquared
        });
        
        worker.onmessage = (e) => {
          resolve(e.data);
          worker.terminate();
        };
      });
    } else {
      // 降级处理：直接在主线程中处理
      return Promise.resolve(lines.filter(line => {
        for (let i = 0; i < line.points.length; i += 2) {
          const dx = line.points[i] - eraserX;
          const dy = line.points[i + 1] - eraserY;
          const distanceSquared = dx * dx + dy * dy;
          
          if (distanceSquared <= eraserSizeSquared) {
            return false;
          }
        }
        return true;
      }));
    }
  }, [scale]);

  return { eraseLines };
}; 