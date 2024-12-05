import { PushPin } from './PushPin';
import TransformableElement from '../TransformableElement';

export const StandalonePushPin = ({ 
  position,
  color,
  isSelected,
  onSelect,
  onDelete,
  onDragMove,
  onMouseEnter,
  onMouseLeave,
  rotation = -90,
  scale = 1.5,
}) => {
  return (
    <TransformableElement
      position={position}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      onDragMove={onDragMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      initialRotation={rotation}
      initialScale={scale}
      minScale={0.5}
      maxScale={3}
      baseSize={20}
    >
      <PushPin 
        x={0}
        y={0}
        color={color}
        rotation={0}
        scale={1}
      />
    </TransformableElement>
  );
}; 