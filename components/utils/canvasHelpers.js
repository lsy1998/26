import { PAPER_DIMENSIONS } from '../constants';

export const isPointInPaper = (point, paperWidth = PAPER_DIMENSIONS.WIDTH, paperHeight = PAPER_DIMENSIONS.HEIGHT) => {
  return point.x >= 0 && 
         point.x <= paperWidth && 
         point.y >= 0 && 
         point.y <= paperHeight;
};

export const isLineInViewport = (line, position, scale, stageWidth, stageHeight) => {
  // 计算视口边界
  const viewport = {
    x: -position.x / scale,
    y: -position.y / scale,
    width: stageWidth / scale,
    height: stageHeight / scale
  };

  // 计算线条的边界框
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  for (let i = 0; i < line.points.length; i += 2) {
    minX = Math.min(minX, line.points[i]);
    maxX = Math.max(maxX, line.points[i]);
    minY = Math.min(minY, line.points[i + 1]);
    maxY = Math.max(maxY, line.points[i + 1]);
  }

  // 检查边界框是否与视口相交
  return !(maxX < viewport.x || 
           minX > viewport.x + viewport.width ||
           maxY < viewport.y || 
           minY > viewport.y + viewport.height);
};

export const getRelativePointerPosition = (stage, position, scale) => {
  const pos = stage.getPointerPosition();
  if (!pos) return null;
  
  return {
    x: (pos.x - position.x) / scale,
    y: (pos.y - position.y) / scale
  };
};

// 添加一个辅助函数来计算点到线段的距离
export const pointToLineDistance = (x, y, x1, y1, x2, y2) => {
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  let param = -1;

  if (len_sq !== 0) {
    param = dot / len_sq;
  }

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;

  return Math.sqrt(dx * dx + dy * dy);
}; 