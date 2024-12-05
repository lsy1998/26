import { useRef, useEffect } from 'react';
import { Text as KonvaText, Transformer } from 'react-konva';

export const TransformableText = ({ 
  text, 
  position,
  fontSize,
  color,
  isSelected,
  onSelect,
  onDelete,
  onDragMove,
  onMouseEnter,
  onMouseLeave,
  rotation = 0,
  scaleX = 1,
  scaleY = 1,
}) => {
  const textRef = useRef(null);
  const transformerRef = useRef(null);

  useEffect(() => {
    if (isSelected && transformerRef.current && textRef.current) {
      transformerRef.current.nodes([textRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleTransform = () => {
    const node = textRef.current;
    if (!node) return;

    onDragMove({
      target: node
    });
  };

  return (
    <>
      <KonvaText
        ref={textRef}
        text={text}
        x={position.x}
        y={position.y}
        fontSize={fontSize}
        fill={color}
        fontFamily="CustomFont, Arial"
        padding={5}
        align="center"
        draggable
        rotation={rotation}
        scaleX={scaleX}
        scaleY={scaleY}
        onClick={onSelect}
        onDragMove={onDragMove}
        onTransform={handleTransform}
        onTransformEnd={handleTransform}
        onMouseEnter={(e) => {
          e.target.getStage().container().style.cursor = 'pointer';
          onMouseEnter?.();
        }}
        onMouseLeave={(e) => {
          e.target.getStage().container().style.cursor = 'default';
          onMouseLeave?.();
        }}
        onContextMenu={(e) => {
          e.evt.preventDefault();
          onDelete();
        }}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={true}
          boundBoxFunc={(oldBox, newBox) => {
            const minScale = 0.2;
            const maxScale = 5;
            const scaleX = newBox.width / oldBox.width;
            const scaleY = newBox.height / oldBox.height;
            if (scaleX < minScale || scaleX > maxScale || 
                scaleY < minScale || scaleY > maxScale) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
}; 