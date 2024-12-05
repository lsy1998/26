import { Line } from 'react-konva';
import { memo } from 'react';

export const DrawingLines = memo(({ lines, lineCache, isLineInViewport }) => {
  return lines.filter(isLineInViewport).map((line, i) => {
    const cacheKey = `${i}-${line.points.join(',')}-${line.color}-${line.strokeWidth}`;
    if (!lineCache.has(cacheKey)) {
      lineCache.set(cacheKey, (
        <Line
          key={i}
          points={line.points}
          stroke={line.color}
          strokeWidth={line.strokeWidth}
          opacity={line.opacity}
          tension={line.tension}
          lineCap="round"
          lineJoin="round"
          perfectDrawEnabled={false}
          listening={false}
          hitStrokeWidth={0}
        />
      ));
    }
    return lineCache.get(cacheKey);
  });
}); 