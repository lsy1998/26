import { useState, useEffect } from 'react';
import { Image, Group, Shadow } from 'react-konva';
import TransformableElement from '../TransformableElement';

export const PinnedImage = ({
  id,
  url,
  position,
  rotation = 0,
  scale = 1,
  isSelected,
  onSelect,
  onDragMove,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      setImage(img);
      setImageSize({
        width: img.width,
        height: img.height
      });
      setError(false);
    };

    img.onerror = () => {
      setError(true);
    };

    img.src = url;
  }, [url]);

  if (error || !image) return null;

  return (
    <TransformableElement
      position={position}
      rotation={rotation}
      scale={typeof scale === 'number' ? { x: scale, y: scale } : scale}
      isSelected={isSelected}
      onSelect={onSelect}
      onDragMove={onDragMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Group>
        <Image
          image={image}
          width={imageSize.width}
          height={imageSize.height}
          offsetX={imageSize.width / 2}
          offsetY={imageSize.height / 2}
          shadowColor="black"
          shadowBlur={30}
          shadowOffset={{ x: 0, y: 15 }}
          shadowOpacity={0.4}
          shadowForStrokeEnabled={false}
          perfectDrawEnabled={false}
          listening={true}
        />
      </Group>
    </TransformableElement>
  );
}; 