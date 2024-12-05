self.onmessage = (e) => {
  const { lines, eraserX, eraserY, eraserSizeSquared } = e.data;

  const newLines = lines.map(line => {
    // 检查线条的每个点是否在橡皮擦范围内
    let shouldKeepLine = true;
    for (let i = 0; i < line.points.length; i += 2) {
      const dx = line.points[i] - eraserX;
      const dy = line.points[i + 1] - eraserY;
      const distanceSquared = dx * dx + dy * dy;
      
      if (distanceSquared <= eraserSizeSquared) {
        shouldKeepLine = false;
        break;
      }
    }
    return shouldKeepLine ? line : null;
  }).filter(Boolean);

  self.postMessage(newLines);
}; 