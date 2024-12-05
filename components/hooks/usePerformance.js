import { useState, useEffect, useRef } from 'react';

export const usePerformance = (stageRef) => {
  const [lineCache, setLineCache] = useState(new Map());
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const [lowPerformanceMode, setLowPerformanceMode] = useState(false);

  useEffect(() => {
    const checkPerformance = () => {
      frameCountRef.current++;
      const currentTime = performance.now();
      
      if (currentTime - lastTimeRef.current >= 1000) {
        const fps = frameCountRef.current * 1000 / (currentTime - lastTimeRef.current);
        
        // 如果 FPS 低于阈值，启用低性能模式
        if (fps < 30 && !lowPerformanceMode) {
          setLowPerformanceMode(true);
          // 减少渲染质量
          setLineCache(new Map());
          stageRef.current?.batchDraw();
        }
        
        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;
      }
      
      requestAnimationFrame(checkPerformance);
    };

    const animationFrame = requestAnimationFrame(checkPerformance);
    return () => cancelAnimationFrame(animationFrame);
  }, [lowPerformanceMode, stageRef]);

  return {
    lineCache,
    setLineCache,
    lowPerformanceMode,
  };
}; 