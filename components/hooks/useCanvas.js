import { useState, useCallback, useEffect } from 'react';
import { BRUSH_TYPES } from '../brushes/BrushTypes';
import { pointToLineDistance } from '../utils/canvasHelpers';
import { logger } from '../../utils/logger';

export const useCanvas = () => {
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushRadius, setBrushRadius] = useState(5);
  const [currentBrush, setCurrentBrush] = useState(() => {
    const savedBrush = localStorage.getItem('currentBrush');
    return savedBrush || 'PENCIL';
  });
  const [isErasing, setIsErasing] = useState(false);
  const [eraserRadius, setEraserRadius] = useState(20);
  const [isToolbarExpanded, setIsToolbarExpanded] = useState(true);
  const [images, setImages] = useState([]);
  const [pins, setPins] = useState([]);
  const [texts, setTexts] = useState([]);

  useEffect(() => {
    localStorage.setItem('currentBrush', currentBrush);
  }, [currentBrush]);

  const addLine = useCallback((point) => {
    const newLine = {
      points: [point.x, point.y],
      color: brushColor,
      strokeWidth: BRUSH_TYPES[currentBrush].strokeWidth * brushRadius,
      opacity: BRUSH_TYPES[currentBrush].opacity,
      tension: BRUSH_TYPES[currentBrush].tension,
      lineCap: currentBrush === 'PENCIL' ? 'square' : 'round',
      lineJoin: currentBrush === 'PENCIL' ? 'miter' : 'round',
    };
    setLines(prevLines => [...prevLines, newLine]);
  }, [brushColor, currentBrush, brushRadius]);

  const updateLastLine = useCallback((point) => {
    setLines(prevLines => {
      const lastLine = prevLines[prevLines.length - 1];
      if (!lastLine) return prevLines;

      const newPoints = [...lastLine.points, point.x, point.y];
      return [
        ...prevLines.slice(0, -1),
        { ...lastLine, points: newPoints }
      ];
    });
  }, []);

  const toggleEraser = useCallback(() => {
    setIsErasing(prev => !prev);
  }, []);

  const clearCanvas = useCallback(() => {
    setLines([]);
    setImages([]);
    setPins([]);
    setTexts([]);
  }, []);

  const imageToBase64 = async (url) => {
    try {
      if (url.startsWith('data:image')) {
        return url;
      }
      
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Failed to convert image to base64:', error);
      return url;
    }
  };

  const saveCanvasData = useCallback(async () => {
    try {
      const processedImages = await Promise.all(
        images.map(async (img) => ({
          ...img,
          url: await imageToBase64(img.url),
          position: {
            x: img.position?.x || 0,
            y: img.position?.y || 0
          },
          rotation: img.rotation || 0,
          scale: typeof img.scale === 'number' 
            ? { x: img.scale, y: img.scale }
            : img.scale || { x: 1, y: 1 }
        }))
      );

      const data = {
        version: '1.0',
        timestamp: Date.now(),
        lines,
        images: processedImages,
        pins: pins.map(pin => ({
          ...pin,
          position: {
            x: pin.position?.x || 0,
            y: pin.position?.y || 0
          },
          rotation: pin.rotation || -90,
          scale: typeof pin.scale === 'number'
            ? { x: pin.scale, y: pin.scale }
            : pin.scale || { x: 1.5, y: 1.5 }
        })),
        texts: texts.map(text => ({
          ...text,
          position: {
            x: text.position?.x || 0,
            y: text.position?.y || 0
          },
          rotation: text.rotation || 0,
          scale: typeof text.scale === 'number'
            ? { x: text.scale, y: text.scale }
            : text.scale || { x: 1, y: 1 }
        })),
        settings: {
          brushColor,
          brushRadius,
          currentBrush,
          eraserRadius
        }
      };

      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `canvas-${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Failed to save canvas data:', error);
      return false;
    }
  }, [lines, images, pins, texts, brushColor, brushRadius, currentBrush, eraserRadius]);

  const loadCanvasData = useCallback(async (data) => {
    try {
      if (data.version) {
        setLines(data.lines || []);
        setImages(data.images || []);
        setPins(data.pins || []);
        setTexts(data.texts || []);
        if (data.settings) {
          setBrushColor(data.settings.brushColor || brushColor);
          setBrushRadius(data.settings.brushRadius || brushRadius);
          if (data.settings.currentBrush) {
            setCurrentBrush(data.settings.currentBrush);
          }
          setEraserRadius(data.settings.eraserRadius || eraserRadius);
        }
      }
    } catch (error) {
      console.error('Error loading canvas data:', error);
    }
  }, [brushColor, brushRadius, eraserRadius]);

  const handleFileLoad = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        loadCanvasData(data);
      } catch (error) {
        logger.error('Error loading file:', error);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [loadCanvasData]);

  const eraseLines = useCallback((pos) => {
    setLines(prevLines => {
      return prevLines.filter(line => {
        for (let i = 0; i < line.points.length - 2; i += 2) {
          const distance = pointToLineDistance(
            pos.x,
            pos.y,
            line.points[i],
            line.points[i + 1],
            line.points[i + 2],
            line.points[i + 3]
          );
          
          if (distance <= eraserRadius) {
            return false;
          }
        }
        return true;
      });
    });
  }, [eraserRadius]);

  const exportVisibleArea = useCallback((stageRef, zoom) => {
    try {
      if (!stageRef.current) return;
      
      const stage = stageRef.current.getStage();
      const stageSize = {
        width: stage.width(),
        height: stage.height(),
      };
 
      // 计算可视区域
      const visibleArea = {
        x: -zoom.position.x / zoom.scale,
        y: -zoom.position.y / zoom.scale,
        width: stageSize.width / zoom.scale,
        height: stageSize.height / zoom.scale,
      };
 
      // 创建临时画布用于导出
      const tempStage = stage.clone();
      tempStage.scale({ x: 1, y: 1 });
      tempStage.position({ x: 0, y: 0 });
      tempStage.size({
        width: visibleArea.width,
        height: visibleArea.height,
      });
 
      // 调整所有层的位置以匹配可视区域
      tempStage.children.forEach(layer => {
        layer.position({
          x: -visibleArea.x,
          y: -visibleArea.y,
        });
      });
 
      // 导出为图片
      const dataURL = tempStage.toDataURL({
        pixelRatio: 2, // 提高导出图片质量
        mimeType: 'image/png',
      });
 
      // 销毁临时画布
      tempStage.destroy();
 
      // 创建下载链接
      const link = document.createElement('a');
      link.download = `whiteboard-${Date.now()}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
 
      logger.debug('Exported visible area');
    } catch (error) {
      logger.error('Failed to export visible area:', error);
    }
  }, []);

  const uploadToServer = useCallback(() => {
    alert('上传到服务器');
  }, []);
  // 初始化加载
  useEffect(() => {
    const loadInitialCanvas = async () => {
      try {
        const response = await fetch('/initial-canvas.json');
        if (!response.ok) {
          throw new Error('Failed to load initial canvas');
        }
        const data = await response.json();
        await loadCanvasData(data);
        logger.debug('Loaded initial canvas');
      } catch (error) {
        logger.error('Failed to load initial canvas:', error);
      }
    };
    
    loadInitialCanvas();
  }, [loadCanvasData]);

  return {
    lines,
    setLines,
    isDrawing,
    setIsDrawing,
    brushColor,
    setBrushColor,
    brushRadius,
    setBrushRadius,
    currentBrush,
    setCurrentBrush,
    isErasing,
    eraserRadius,
    setEraserRadius,
    addLine,
    updateLastLine,
    toggleEraser,
    isToolbarExpanded,
    setIsToolbarExpanded,
    images,
    setImages,
    pins,
    setPins,
    texts,
    setTexts,
    clearCanvas,
    handleFileLoad,
    saveCanvasData,
    eraseLines,
    exportVisibleArea,
    loadCanvasData,
    uploadToServer,
  };
}; 