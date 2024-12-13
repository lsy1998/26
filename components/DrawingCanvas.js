import { useRef, useCallback, useState, useEffect } from 'react';
import { CanvasEventHandler, DrawingLines, PinnedImages, Pins } from './canvas';
import { Texts } from './text/Texts';
import { Toolbar } from './toolbar/Toolbar';
import { CustomCursor } from './cursor/CustomCursor';
import { ContextMenu } from './menu/ContextMenu';
import { UrlInputDialog } from './dialogs/UrlInputDialog';
import { TextInputDialog } from './dialogs/TextInputDialog';
import { isLineInViewport } from './utils/canvasHelpers';
import {
  useCanvas,
  useZoom,
  useSelection,
  usePerformance,
  useContextMenu,
  useShortcuts,
  useWindowSize,
  useCanvasEvents,
} from './hooks';
import { Paper } from './canvas/Paper';
import { PAPER_DIMENSIONS } from './constants';

const DrawingCanvas = () => {
  const stageRef = useRef(null);
  const loadFileInputRef = useRef(null);
  const imageFileInputRef = useRef(null);
  
  const canvas = useCanvas();
  const zoom = useZoom(stageRef);
  const selection = useSelection();
  const performance = usePerformance(stageRef);
  const contextMenu = useContextMenu();
  const windowSize = useWindowSize();
  const [touchStartTime, setTouchStartTime] = useState(0);
  const LONG_PRESS_DURATION = 500; // 长按触发时间（毫秒）

  const events = useCanvasEvents({
    setIsDrawing: canvas.setIsDrawing,
    addLine: canvas.addLine,
    updateLastLine: canvas.updateLastLine,
    isErasing: canvas.isErasing,
    eraseLines: canvas.eraseLines,
    setLines: canvas.setLines,
    position: zoom.position,
    scale: zoom.scale,
    isOverImage: selection.isOverImage,
    isOverPin: selection.isOverPin,
    isOverText: selection.isOverText,
    isDrawing: canvas.isDrawing,
  });

  // 触摸状态管理
  const [touchState, setTouchState] = useState({
    lastDistance: 0,
    isDragging: false,
    lastCenter: null,
    startTime: 0,
  });

  const getDistance = (touch1, touch2) => {
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const getCenter = (touch1, touch2) => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  };

  const handleTouchStart = (e) => {
    const touches = e.evt.touches;
    
    if (touches.length === 1) {
      // 单指触摸 - 开始画画或准备拖动
      setTouchState(prev => ({
        ...prev,
        startTime: Date.now(),
        isDragging: false,
      }));
      events.handleTouchStart(e);
    } else if (touches.length === 2) {
      // 双指触摸 - 准备缩放
      e.evt.preventDefault();
      const distance = getDistance(touches[0], touches[1]);
      const center = getCenter(touches[0], touches[1]);
      
      setTouchState(prev => ({
        ...prev,
        lastDistance: distance,
        lastCenter: center,
        isDragging: true,
      }));
    }
  };

  const handleTouchMove = (e) => {
    const touches = e.evt.touches;
    
    if (touches.length === 1 && !touchState.isDragging) {
      // 单指移动 - 画画
      events.handleTouchMove(e);
    } else if (touches.length === 2) {
      // 双指移动 - 处理缩放和平移
      e.evt.preventDefault();
      const distance = getDistance(touches[0], touches[1]);
      const center = getCenter(touches[0], touches[1]);
      
      if (touchState.lastDistance > 0) {
        // 处理缩放
        const scale = distance / touchState.lastDistance;
        const newScale = zoom.scale * scale;
        // 计算舞台坐标中的缩放中心点
        const stage = stageRef.current.getStage();
        const pointer = stage.getPointerPosition();
        const mousePointTo = {
          x: (pointer.x - zoom.position.x) / zoom.scale,
          y: (pointer.y - zoom.position.y) / zoom.scale,
        };
        
        if (newScale >= 0.1 && newScale <= 5) {
          // 更新位置以保持鼠标位置不变
          const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
          };
          zoom.setScale(newScale);
          zoom.setPosition(newPos);
        }
      }
      
      setTouchState(prev => ({
        ...prev,
        lastDistance: distance,
        lastCenter: center,
      }));
    }
  };

  const handleTouchEnd = (e) => {
    const touchDuration = Date.now() - touchState.startTime;
    
    if (!touchState.isDragging && touchDuration < LONG_PRESS_DURATION) {
      events.handleTouchEnd(e);
    }
    
    setTouchState({
      lastDistance: 0,
      isDragging: false,
      lastCenter: null,
      startTime: 0,
    });
  };

  const checkLineInViewport = useCallback((line) => {
    return isLineInViewport(
      line,
      zoom.position,
      zoom.scale,
      windowSize.width,
      windowSize.height
    );
  }, [zoom.position, zoom.scale, windowSize]);

  const toolbarProps = {
    isToolbarExpanded: canvas.isToolbarExpanded,
    setIsToolbarExpanded: canvas.setIsToolbarExpanded,
    currentBrush: canvas.currentBrush,
    setCurrentBrush: canvas.setCurrentBrush,
    isErasing: canvas.isErasing,
    toggleEraser: canvas.toggleEraser,
    brushColor: canvas.brushColor,
    setBrushColor: canvas.setBrushColor,
    brushRadius: canvas.brushRadius,
    setBrushRadius: canvas.setBrushRadius,
    eraserRadius: canvas.eraserRadius,
    setEraserRadius: canvas.setEraserRadius,
    handleReset: () => {
      zoom.resetZoom();
      const centerPos = zoom.calculateCenterPosition(windowSize.width, windowSize.height);
      zoom.setPosition(centerPos);
    },
    saveCanvasData: canvas.saveCanvasData,
    loadFileInputRef: loadFileInputRef,
    onExport: () => canvas.exportVisibleArea(stageRef, zoom),
    hasSelectedElement: selection.hasSelectedElement,
    handleDeleteSelected: () => selection.handleDeleteSelected(
      canvas.setImages,
      canvas.setPins,
      canvas.setTexts
    ),
    uploadToServer: canvas.uploadToServer,
  };

  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [urlDialog, setUrlDialog] = useState({ open: false, position: null });
  const [textDialog, setTextDialog] = useState({ open: false, position: null });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useShortcuts({
    onToggleToolbar: () => canvas.setIsToolbarExpanded(prev => !prev),
    onToggleEraser: canvas.toggleEraser,
    onClearCanvas: canvas.clearCanvas,
    onResetView: zoom.resetZoom,
    onToggleGrid: canvas.toggleGrid,
    brushes: canvas.BRUSH_TYPES,
    setBrush: canvas.setCurrentBrush,
  });

  const handleAddImage = useCallback((type) => {
    if (type === 'local') {
      imageFileInputRef.current?.click();
    } else {
      // 打开URL输入对话框
      setUrlDialog({ 
        open: true, 
        position: contextMenu.contextMenu?.stagePos || { x: 0, y: 0 }
      });
    }
  }, [contextMenu.contextMenu]);
  
  const handleAddPin = useCallback((pos) => {
    canvas.setPins(prev => [...prev, {
      id: Date.now(),
      position: pos,
      color: canvas.brushColor,
      rotation: -90,
      scale: 1.5,
    }]);
  }, [canvas.brushColor, canvas.setPins]);
  
  const handleAddText = useCallback((pos) => {
    setTextDialog({ 
      open: true, 
      position: pos || { x: 0, y: 0 }
    });
  }, []);
  
  const handlePaste = useCallback(async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        if (item.types.includes('image/png') || item.types.includes('image/jpeg')) {
          const blob = await item.getType(item.types[0]);
          const url = URL.createObjectURL(blob);
          canvas.setImages(prev => [...prev, {
            id: Date.now(),
            url,
            position: contextMenu.contextMenu?.stagePos || { x: 0, y: 0 },
            rotation: 0,
            scale: 1,
          }]);
          break;
        }
      }
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  }, [contextMenu.contextMenu, canvas.setImages]);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        console.error('Invalid file type');
        return;
      }
      
      const url = URL.createObjectURL(file);
      canvas.setImages(prev => [...prev, {
        id: Date.now(),
        url,
        position: {
          x: urlDialog.position?.x ?? window.innerWidth / 4,
          y: urlDialog.position?.y ?? window.innerHeight / 4
        },
        rotation: 0,
        scale: 1,
      }]);
      e.target.value = ''; // 重置文件输入
    }
  }, [canvas.setImages, urlDialog.position]);

  const handleUrlSubmit = useCallback((url) => {
    // 验证URL
    try {
      new URL(url);
    } catch (e) {
      console.error('Invalid URL');
      return;
    }
    
    canvas.setImages(prev => [...prev, {
      id: Date.now(),
      url,
      position: {
        x: urlDialog.position?.x ?? window.innerWidth / 4,
        y: urlDialog.position?.y ?? window.innerHeight / 4
      },
      rotation: 0,
      scale: 1,
    }]);
    setUrlDialog({ open: false, position: null });
  }, [canvas.setImages, urlDialog.position]);

  const handleTextSubmit = useCallback(({ text, fontSize, color }) => {
    canvas.setTexts(prev => [...prev, {
      id: Date.now(),
      text,
      position: textDialog.position || { x: 0, y: 0 },
      fontSize,
      color,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    }]);
    setTextDialog({ open: false, position: null });
  }, [canvas.setTexts, textDialog.position]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' || (e.key === 'Backspace' && !e.target.closest('input, textarea'))) {
        selection.handleDeleteSelected(
          canvas.setImages,
          canvas.setPins,
          canvas.setTexts
        );
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selection, canvas.setImages, canvas.setPins, canvas.setTexts]);

  useEffect(() => {
    const centerCanvas = () => {
      if (windowSize.width && windowSize.height) {
        const centerPos = zoom.calculateCenterPosition(windowSize.width, windowSize.height);
        zoom.setPosition(centerPos);
      }
    };
    
    centerCanvas();
    window.addEventListener('resize', centerCanvas);
    return () => window.removeEventListener('resize', centerCanvas);
  }, [windowSize.width, windowSize.height, zoom.setPosition, zoom.calculateCenterPosition]);

  return (
    <>
      {canvas.isErasing && (
        <CustomCursor 
          position={cursorPosition} 
          radius={canvas.eraserRadius} 
        />
      )}
      
      <CanvasEventHandler
        windowSize={windowSize}
        scale={zoom.scale}
        position={zoom.position}
        stageRef={stageRef}
        onMouseDown={(e) => {
          if (e.evt.button === 1 || e.evt.buttons === 4 || e.evt.spaceKey) {
            zoom.handleDragStart(e);
          } else {
            events.handleMouseDown(e);
          }
        }}
        onMouseMove={(e) => {
          if (zoom.isDragging) {
            zoom.handleDragMove(e);
          } else {
            events.handleMouseMove(e);
          }
        }}
        onMouseUp={(e) => {
          if (zoom.isDragging) {
            zoom.handleDragEnd(e);
          } else {
            events.handleMouseUp(e);
          }
        }}
        onMouseEnter={events.handleMouseEnter}
        onMouseLeave={events.handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={zoom.handleWheel}
        onContextMenu={(e) => contextMenu.handleContextMenu(e, zoom.position, zoom.scale)}
        isDragging={zoom.isDragging}
        isErasing={canvas.isErasing}
        style={{
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <Paper showCenterMark={true} />
        <DrawingLines 
          lines={canvas.lines}
          lineCache={performance.lineCache}
          isLineInViewport={checkLineInViewport}
        />
        <PinnedImages
          images={canvas.images}
          selectedId={selection.selectedImageId}
          onSelect={selection.setSelectedImageId}
          onDelete={(id) => canvas.setImages(prev => prev.filter(img => img.id !== id))}
          onDragMove={(id, e) => {
            const pos = e.target.position();
            const rotation = e.target.rotation();
            const scaleX = e.target.scaleX();
            const scaleY = e.target.scaleY();
            canvas.setImages(prev => prev.map(img => 
              img.id === id ? {
                ...img,
                position: pos,
                rotation,
                scale: { x: scaleX, y: scaleY }
              } : img
            ));
          }}
          onMouseEnter={() => selection.setIsOverImage(true)}
          onMouseLeave={() => selection.setIsOverImage(false)}
        />
        <Pins
          pins={canvas.pins}
          selectedId={selection.selectedPinId}
          onSelect={selection.setSelectedPinId}
          onDelete={(id) => canvas.setPins(prev => prev.filter(pin => pin.id !== id))}
          onDragMove={(id, e) => {
            const pos = e.target.position();
            canvas.setPins(prev => prev.map(pin => 
              pin.id === id ? { ...pin, position: pos } : pin
            ));
          }}
          onMouseEnter={() => selection.setIsOverPin(true)}
          onMouseLeave={() => selection.setIsOverPin(false)}
        />
        <Texts
          texts={canvas.texts}
          selectedId={selection.selectedTextId}
          onSelect={selection.setSelectedTextId}
          onDelete={(id) => canvas.setTexts(prev => prev.filter(text => text.id !== id))}
          onDragMove={(id, e) => {
            const pos = e.target.position();
            const rotation = e.target.rotation();
            const scaleX = e.target.scaleX();
            const scaleY = e.target.scaleY();
            canvas.setTexts(prev => prev.map(text => 
              text.id === id ? {
                ...text,
                position: pos,
                rotation,
                scale: { x: scaleX, y: scaleY }
              } : text
            ));
          }}
          onMouseEnter={() => selection.setIsOverText(true)}
          onMouseLeave={() => selection.setIsOverText(false)}
        />
      </CanvasEventHandler>

      <Toolbar {...toolbarProps} />

      <ContextMenu
        contextMenu={contextMenu.contextMenu}
        onClose={() => contextMenu.setContextMenu(null)}
        onAddImage={handleAddImage}
        onAddPin={handleAddPin}
        onAddText={handleAddText}
        onPaste={handlePaste}
      />

      <input
        ref={loadFileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={canvas.handleFileLoad}
      />
      <input
        ref={imageFileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />

      <UrlInputDialog
        open={urlDialog.open}
        onClose={() => setUrlDialog({ open: false, position: null })}
        onSubmit={handleUrlSubmit}
      />
      
      <TextInputDialog
        open={textDialog.open}
        onClose={() => setTextDialog({ open: false, position: null })}
        onSubmit={handleTextSubmit}
      />
    </>
  );
};

export default DrawingCanvas; 