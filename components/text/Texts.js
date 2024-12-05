import { memo } from 'react';
import { Text } from './Text';

export const Texts = memo(({
  texts,
  selectedId,
  onSelect,
  onDelete,
  onDragMove,
  onMouseEnter,
  onMouseLeave,
}) => {
  return texts.map((text) => (
    <Text
      key={text.id}
      {...text}
      isSelected={selectedId === text.id}
      onSelect={(e) => {
        e.cancelBubble = true;
        onSelect(text.id);
      }}
      onDelete={() => onDelete(text.id)}
      onDragMove={(e) => onDragMove(text.id, e)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  ));
}); 