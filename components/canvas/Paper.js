import { Rect, Group, Line, Circle } from 'react-konva';
import { PaperGrid } from './PaperGrid';
import { PAPER_DIMENSIONS, PAPER_STYLES } from '../constants';

const CenterMark = () => {
  const size = 20;
  const gridSize = PAPER_STYLES.GRID.SMALL.SIZE;
  const centerX = Math.round(PAPER_DIMENSIONS.WIDTH / (2 * gridSize)) * gridSize;
  const centerY = Math.round(PAPER_DIMENSIONS.HEIGHT / (2 * gridSize)) * gridSize;

  return (
    <Group>
      <Line
        points={[centerX - size, centerY, centerX + size, centerY]}
        stroke="#999"
        strokeWidth={1}
        dash={[4, 4]}
      />
      <Line
        points={[centerX, centerY - size, centerX, centerY + size]}
        stroke="#999"
        strokeWidth={1}
        dash={[4, 4]}
      />
      <Circle
        x={centerX}
        y={centerY}
        radius={2}
        fill="#999"
      />
    </Group>
  );
};

export const Paper = ({ showCenterMark = true }) => {
  return (
    <>
      <Rect
        x={0}
        y={0}
        width={PAPER_DIMENSIONS.WIDTH}
        height={PAPER_DIMENSIONS.HEIGHT}
        fill={PAPER_STYLES.FILL}
        shadowColor={PAPER_STYLES.SHADOW.COLOR}
        shadowBlur={PAPER_STYLES.SHADOW.BLUR}
        shadowOffset={PAPER_STYLES.SHADOW.OFFSET}
        perfectDrawEnabled={false}
      />
      <PaperGrid />
      {showCenterMark && <CenterMark />}
    </>
  );
}; 