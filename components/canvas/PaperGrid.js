import { Line } from 'react-konva';
import { PAPER_DIMENSIONS, PAPER_STYLES } from '../constants';

export const PaperGrid = () => {
  const { SMALL, LARGE } = PAPER_STYLES.GRID;

  const renderGridLines = () => {
    const lines = [];

    // 绘制小网格线
    for (let i = SMALL.SIZE; i < PAPER_DIMENSIONS.WIDTH; i += SMALL.SIZE) {
      lines.push(
        <Line
          key={`v${i}`}
          points={[i, 0, i, PAPER_DIMENSIONS.HEIGHT]}
          stroke={SMALL.COLOR}
          strokeWidth={SMALL.WIDTH}
          opacity={SMALL.OPACITY}
        />
      );
    }

    for (let i = SMALL.SIZE; i < PAPER_DIMENSIONS.HEIGHT; i += SMALL.SIZE) {
      lines.push(
        <Line
          key={`h${i}`}
          points={[0, i, PAPER_DIMENSIONS.WIDTH, i]}
          stroke={SMALL.COLOR}
          strokeWidth={SMALL.WIDTH}
          opacity={SMALL.OPACITY}
        />
      );
    }

    // 绘制大网格线
    for (let i = LARGE.SIZE; i < PAPER_DIMENSIONS.WIDTH; i += LARGE.SIZE) {
      lines.push(
        <Line
          key={`vMain${i}`}
          points={[i, 0, i, PAPER_DIMENSIONS.HEIGHT]}
          stroke={LARGE.COLOR}
          strokeWidth={LARGE.WIDTH}
          opacity={LARGE.OPACITY}
        />
      );
    }

    for (let i = LARGE.SIZE; i < PAPER_DIMENSIONS.HEIGHT; i += LARGE.SIZE) {
      lines.push(
        <Line
          key={`hMain${i}`}
          points={[0, i, PAPER_DIMENSIONS.WIDTH, i]}
          stroke={LARGE.COLOR}
          strokeWidth={LARGE.WIDTH}
          opacity={LARGE.OPACITY}
        />
      );
    }

    return lines;
  };

  return <>{renderGridLines()}</>;
}; 