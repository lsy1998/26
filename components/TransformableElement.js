import React, { useRef, useEffect } from 'react';
import { Group, Transformer } from 'react-konva';

const TransformableElement = ({
  position = { x: 0, y: 0 },
  rotation = 0,
  scale = { x: 1, y: 1 },
  isSelected,
  onSelect,
  onTransformEnd,
  onDragMove,
  onMouseEnter,
  onMouseLeave,
  children,
  minScale = 0.1,
  maxScale = 5,
}) => {
  const elementRef = useRef(null);
  const transformerRef = useRef(null);

  useEffect(() => {
    if (isSelected && transformerRef.current && elementRef.current) {
      transformerRef.current.nodes([elementRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleTransformEnd = (e) => {
    const node = elementRef.current;
    if (!node) return;

    onTransformEnd?.({
      position: node.position(),
      rotation: node.rotation(),
      scale: {
        x: node.scaleX(),
        y: node.scaleY()
      }
    });
  };

  return (
    <>
      <Group
        ref={elementRef}
        x={position.x}
        y={position.y}
        rotation={rotation}
        scaleX={typeof scale === 'number' ? scale : scale.x}
        scaleY={typeof scale === 'number' ? scale : scale.y}
        draggable
        onDragMove={onDragMove}
        onTransformEnd={handleTransformEnd}
        onMouseDown={(e) => {
          e.cancelBubble = true;
          onSelect?.(e);
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </Group>
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            const scaleX = newBox.width / oldBox.width;
            const scaleY = newBox.height / oldBox.height;
            if (
              scaleX < minScale || 
              scaleY < minScale || 
              scaleX > maxScale || 
              scaleY > maxScale
            ) {
              return oldBox;
            }
            return newBox;
          }}
          rotateEnabled={true}
          enabledAnchors={[
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right'
          ]}
          keepRatio={true}
        />
      )}
    </>
  );
};

export default TransformableElement; 