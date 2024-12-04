import React, { useState, useRef, useEffect } from 'react';
import { Group, Transformer } from 'react-konva';

const TransformableElement = ({
  position,
  isSelected,
  onSelect,
  onDelete,
  onDragMove,
  onMouseEnter,
  onMouseLeave,
  children,
  initialRotation = 0,
  initialScale = 1,
  minScale = 0.5,
  maxScale = 3,
  baseSize = 20,
}) => {
  const elementRef = useRef(null);
  const transformerRef = useRef(null);
  const [rotation, setRotation] = useState(initialRotation);
  const [scale, setScale] = useState(initialScale);

  useEffect(() => {
    if (isSelected && transformerRef.current && elementRef.current) {
      transformerRef.current.nodes([elementRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleClick = (e) => {
    e.cancelBubble = true;
    onSelect?.(e);
  };

  const handleDragMove = (e) => {
    e.cancelBubble = true;
    onDragMove?.(e);
  };

  const handleTransform = (e) => {
    e.cancelBubble = true;
    const node = elementRef.current;
    if (!node) return;

    setRotation(node.rotation());
    setScale(node.scaleX());

    onDragMove?.({
      target: node
    });
  };

  const handleMouseEnter = (e) => {
    e.cancelBubble = true;
    e.target.getStage().container().style.cursor = 'pointer';
    onMouseEnter?.();
  };

  const handleMouseLeave = (e) => {
    e.cancelBubble = true;
    e.target.getStage().container().style.cursor = 'default';
    onMouseLeave?.();
  };

  return (
    <>
      <Group
        ref={elementRef}
        x={position.x}
        y={position.y}
        draggable
        rotation={rotation}
        scaleX={scale}
        scaleY={scale}
        onClick={handleClick}
        onDragMove={handleDragMove}
        onTransform={handleTransform}
        onTransformEnd={handleTransform}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </Group>
      {isSelected && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={true}
          boundBoxFunc={(oldBox, newBox) => {
            const scaleX = newBox.width / (baseSize * initialScale);
            if (scaleX < minScale || scaleX > maxScale) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default TransformableElement; 