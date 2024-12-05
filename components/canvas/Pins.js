import { memo } from 'react';
import { StandalonePushPin } from '../pins/StandalonePushPin';

export const Pins = memo(({
  pins,
  selectedId,
  onSelect,
  onDelete,
  onDragMove,
  onMouseEnter,
  onMouseLeave,
}) => {
  return pins.map((pin) => (
    <StandalonePushPin
      key={pin.id}
      {...pin}
      isSelected={selectedId === pin.id}
      onSelect={(e) => {
        e.cancelBubble = true;
        onSelect(pin.id);
      }}
      onDelete={() => onDelete(pin.id)}
      onDragMove={(e) => onDragMove(pin.id, e)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  ));
}); 