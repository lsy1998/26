import { Text as KonvaText } from 'react-konva';
import TransformableElement from '../TransformableElement';
import { useRef, useEffect } from 'react';

const FONT_FAMILY = {
  DEFAULT: 'CustomFont',
  FALLBACK: 'Arial, sans-serif'
};

export const Text = ({
  text,
  position,
  fontSize = 24,
  color = '#000000',
  rotation = 0,
  scale = { x: 1, y: 1 },
  isSelected,
  onSelect,
  onDragMove,
  onMouseEnter,
  onMouseLeave,
}) => {
  const textRef = useRef(null);

  useEffect(() => {
    const font = new FontFace('CustomFont', 'url(/fonts/bluefish.ttf)');
    font.load().then(() => {
      document.fonts.add(font);
      if (textRef.current) {
        textRef.current.getLayer()?.batchDraw();
      }
    }).catch(err => {
      console.error('Failed to load font:', err);
    });
  }, []);

  useEffect(() => {
    if (textRef.current) {
      const node = textRef.current;
      node.offsetX(node.width() / 2);
      node.offsetY(node.height() / 2);
    }
  }, [text, fontSize]);

  return (
    <TransformableElement
      position={position}
      rotation={rotation}
      scale={scale}
      isSelected={isSelected}
      onSelect={onSelect}
      onDragMove={onDragMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      minScale={0.2}
      maxScale={5}
    >
      <KonvaText
        ref={textRef}
        text={text}
        fontSize={fontSize}
        fill={color}
        fontFamily={FONT_FAMILY.DEFAULT}
        align="center"
        verticalAlign="middle"
        perfectDrawEnabled={false}
        shadowColor="rgba(0,0,0,0.2)"
        shadowBlur={2}
        shadowOffset={{ x: 1, y: 1 }}
        shadowOpacity={0.5}
      />
    </TransformableElement>
  );
}; 