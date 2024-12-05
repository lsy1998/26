import { Rect } from 'react-konva';
import { PaperGrid } from '../grid/PaperGrid';
import { PAPER_DIMENSIONS, PAPER_STYLES } from '../constants/paper';

export const Paper = () => {
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
    </>
  );
}; 