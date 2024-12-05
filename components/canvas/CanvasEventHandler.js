import { useCallback, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import { Paper } from './Paper';
import { DrawingLines } from './DrawingLines';

export const CanvasEventHandler = ({
  windowSize,
  scale,
  position,
  stageRef,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseEnter,
  onMouseLeave,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onWheel,
  onContextMenu,
  isDragging,
  isErasing,
  children,
}) => {
  const containerStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
    WebkitTouchCallout: 'none',
  };

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  return (
    <div style={containerStyle} onContextMenu={(e) => e.preventDefault()}>
      <Stage
        width={windowSize.width}
        height={windowSize.height}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onWheel={onWheel}
        ref={stageRef}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        style={{ 
          cursor: isDragging ? 'grabbing' : (isErasing ? 'none' : 'default'),
          touchAction: 'none',
        }}
        onContextMenu={onContextMenu}
      >
        <Layer>
          <Paper />
          {children}
        </Layer>
      </Stage>
    </div>
  );
}; 