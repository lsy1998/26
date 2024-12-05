import { memo } from 'react';
import { PinnedImage } from '../images/PinnedImage';

export const PinnedImages = memo(({ 
  images, 
  selectedId,
  onSelect,
  onDelete,
  onDragMove,
  onMouseEnter,
  onMouseLeave,
}) => {
  return images.map((image) => (
    <PinnedImage
      key={image.id}
      {...image}
      isSelected={selectedId === image.id}
      onSelect={(e) => {
        e.cancelBubble = true;
        onSelect(image.id);
      }}
      onDelete={() => onDelete(image.id)}
      onDragMove={(e) => onDragMove(image.id, e)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  ));
}); 