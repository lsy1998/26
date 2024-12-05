self.onmessage = function(e) {
  const { lines, eraserX, eraserY, eraserSizeSquared } = e.data;
  
  const newLines = lines.map(line => {
    const points = line.points;
    let newPoints = [];
    let isSegmentErased = false;
    
    for (let i = 0; i < points.length; i += 2) {
      const x = points[i];
      const y = points[i + 1];
      const dx = x - eraserX;
      const dy = y - eraserY;
      const distanceSquared = dx * dx + dy * dy;
      
      if (distanceSquared > eraserSizeSquared) {
        if (isSegmentErased && newPoints.length > 0) {
          newPoints.push(null, null);
        }
        isSegmentErased = false;
        newPoints.push(x, y);
      } else {
        isSegmentErased = true;
      }
    }
    
    return newPoints.length > 0 ? { ...line, points: newPoints } : null;
  }).filter(Boolean);
  
  self.postMessage(newLines);
}; 