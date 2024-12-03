import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Path } from 'react-konva';
import { Button, Slider, Typography, Box } from '@mui/material';

// 在文件开头添加笔刷类型定义
const BRUSH_TYPES = {
  PENCIL: {
    name: '铅笔',
    strokeWidth: 2,
    opacity: 0.8,
    tension: 0.5,
  },
  PEN: {
    name: '钢笔',
    strokeWidth: 3,
    opacity: 1,
    tension: 0.3,
  },
  MARKER: {
    name: '马克笔',
    strokeWidth: 8,
    opacity: 0.6,
    tension: 0.2,
  },
  BRUSH: {
    name: '毛笔',
    strokeWidth: 5,
    opacity: 0.7,
    tension: 0.8,
  },
};

const DrawingCanvas = () => {
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushRadius, setBrushRadius] = useState(5);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const stageRef = useRef(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isErasing, setIsErasing] = useState(false);
  const [eraserRadius, setEraserRadius] = useState(20);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [currentBrush, setCurrentBrush] = useState('PENCIL');

  // 定义 A4 纸的尺寸（横向）
  const PAPER_WIDTH = 3508; // 297mm -> 3508px
  const PAPER_HEIGHT = 2480; // 210mm -> 2480px

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    // 初始化纸张位置，使其居中
    setPosition({
      x: (window.innerWidth - PAPER_WIDTH) / 2,
      y: (window.innerHeight - PAPER_HEIGHT) / 2
    });

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getRelativePointerPosition = (stage) => {
    const transform = stage.getAbsoluteTransform().copy();
    const pos = stage.getPointerPosition();
    transform.invert();
    return transform.point(pos);
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();
    const oldScale = scale;
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    // 计算新的缩放值
    const newScale = e.evt.deltaY < 0 ? oldScale * 1.1 : oldScale / 1.1;

    // 限制缩放范围
    const limitedScale = Math.min(Math.max(newScale, 0.1), 5);

    setScale(limitedScale);

    // 调整位置以保持鼠标指向的点不变
    const newPos = {
      x: pointer.x - mousePointTo.x * limitedScale,
      y: pointer.y - mousePointTo.y * limitedScale,
    };

    setPosition(newPos);
  };

  // 添加一个辅助函数来计算点到线段的距离
  const pointToLineDistance = (x, y, x1, y1, x2, y2) => {
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

  // 修改橡皮擦逻辑
  const eraseLines = (eraserX, eraserY, eraserSize) => {
    // 计算实际的橡皮擦大小（考虑缩放）
    const effectiveEraserSize = eraserSize * scale;

    return lines.map(line => {
      const points = [...line.points];
      let newPoints = [];
      
      for (let i = 0; i < points.length; i += 2) {
        const x = points[i];
        const y = points[i + 1];
        
        // 计算点到橡皮擦中心的距离
        const dx = x - eraserX;
        const dy = y - eraserY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 如果点不在橡皮擦范围内，保留该点
        if (distance > effectiveEraserSize) {
          newPoints.push(x, y);
        } else {
          // 如果有前一个点且还有后续点，添加断点标记
          if (newPoints.length > 0 && i + 2 < points.length) {
            newPoints = [...newPoints, null, null];
          }
        }
      }
      
      // 处理断点，将线条分割成多个子线条
      const subLines = [];
      let currentLine = [];
      
      for (let i = 0; i < newPoints.length; i += 2) {
        if (newPoints[i] === null) {
          if (currentLine.length >= 4) {
            subLines.push({
              ...line,
              points: currentLine
            });
          }
          currentLine = [];
        } else {
          currentLine.push(newPoints[i], newPoints[i + 1]);
        }
      }
      
      // 添加最后一个子线条
      if (currentLine.length >= 4) {
        subLines.push({
          ...line,
          points: currentLine
        });
      }
      
      return subLines;
    })
    .flat()
    .filter(line => line.points.length >= 4);
  };

  // 修改绘画相关的处理函数
  const handleMouseDown = (e) => {
    if (e.evt.button === 1) {
      e.evt.preventDefault();
      e.target.getStage().container().style.cursor = 'grabbing';
      setIsDragging(true);
      return;
    }

    if (e.evt.button !== 0) return;
    setIsDrawing(true);

    if (!isErasing) {
      const stage = e.target.getStage();
      const pos = getRelativePointerPosition(stage);
      setLines([...lines, { 
        points: [pos.x, pos.y], 
        color: brushColor,
        strokeWidth: BRUSH_TYPES[currentBrush].strokeWidth * brushRadius * scale,
        opacity: BRUSH_TYPES[currentBrush].opacity,
        tension: BRUSH_TYPES[currentBrush].tension,
      }]);
    }
  };

  const handleMouseMove = (e) => {
    const stage = e.target.getStage();
    
    // 更新光标位置
    if (isErasing) {
      setCursorPosition({
        x: e.evt.clientX,
        y: e.evt.clientY
      });

      // 只在按住鼠标左键时擦除
      if (isDrawing) {
        const pos = getRelativePointerPosition(stage);
        const newLines = eraseLines(pos.x, pos.y, eraserRadius);
        setLines(newLines);
      }
      return;
    }

    if (isDragging) {
      const dx = e.evt.movementX;
      const dy = e.evt.movementY;
      setPosition({
        x: position.x + dx,
        y: position.y + dy
      });
      return;
    }

    if (!isDrawing) return;

    const pos = getRelativePointerPosition(stage);
    let lastLine = lines[lines.length - 1];
    const newPoints = [...lastLine.points, pos.x, pos.y];
    const newLines = [...lines];
    newLines[newLines.length - 1] = {
      ...lastLine,
      points: newPoints,
    };
    setLines(newLines);
  };

  const handleMouseUp = (e) => {
    // 如果是鼠标中键释放，停止拖动
    if (e.evt.button === 1) {
      e.target.getStage().container().style.cursor = 'default';
      setIsDragging(false);
      return;
    }
    setIsDrawing(false);  // 无论是画笔还是橡皮擦模式都重置 isDrawing
  };

  // 更新鼠标进入/离开画布的处理
  const handleMouseEnter = (e) => {
    if (isErasing) {
      const stage = e.target.getStage();
      const containerRect = stage.container().getBoundingClientRect();
      setCursorPosition({
        x: e.evt.clientX,
        y: e.evt.clientY
      });
      document.body.style.cursor = 'none';
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsDrawing(false);
    if (stageRef.current) {
      stageRef.current.container().style.cursor = 'default';
    }
    document.body.style.cursor = 'default';
  };

  const renderGrid = () => {
    const gridSize = 20; // 方格大小
    const lines = [];

    // 绘制垂直线
    for (let i = 0; i <= PAPER_WIDTH; i += gridSize) {
      lines.push(
        <Line
          key={`v${i}`}
          points={[i, 0, i, PAPER_HEIGHT]}
          stroke="#ddd"
          strokeWidth={0.5}
        />
      );
    }

    // 绘制水平线
    for (let i = 0; i <= PAPER_HEIGHT; i += gridSize) {
      lines.push(
        <Line
          key={`h${i}`}
          points={[0, i, PAPER_WIDTH, i]}
          stroke="#ddd"
          strokeWidth={0.5}
        />
      );
    }

    return lines;
  };

  // 生成不规则边缘的路径
  const generateRoughPaperPath = () => {
    const roughness = 3; // 不规则程度
    let path = `M 0 0`;

    // 上边缘
    for (let x = 0; x <= PAPER_WIDTH; x += 20) {
      const offsetY = Math.random() * roughness;
      path += ` L ${x} ${offsetY}`;
    }

    // 右边缘
    for (let y = 0; y <= PAPER_HEIGHT; y += 20) {
      const offsetX = PAPER_WIDTH - Math.random() * roughness;
      path += ` L ${offsetX} ${y}`;
    }

    // 下边缘
    for (let x = PAPER_WIDTH; x >= 0; x -= 20) {
      const offsetY = PAPER_HEIGHT - Math.random() * roughness;
      path += ` L ${x} ${offsetY}`;
    }

    // 左边缘
    for (let y = PAPER_HEIGHT; y >= 0; y -= 20) {
      const offsetX = Math.random() * roughness;
      path += ` L ${offsetX} ${y}`;
    }

    path += ' Z';  // 闭合路径
    return path;
  };

  // 在组件加载时生成路径并保存
  const [paperPath] = useState(generateRoughPaperPath());

  // 添加自定义光标组件
  const CustomCursor = ({ position, radius }) => {
    const stage = stageRef.current;
    if (!stage) return null;

    // 计算实际显示的光标大小（考虑缩放）
    const displayRadius = radius * scale;

    return (
      <div
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: displayRadius * 2,
          height: displayRadius * 2,
          border: '2px solid #666',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          transform: 'translate(-50%, -50%)',
        }}
      />
    );
  };

  // 更新橡皮擦切换函数
  const toggleEraser = () => {
    setIsErasing(!isErasing);
    if (!isErasing) {
      document.body.style.cursor = 'none';
    } else {
      document.body.style.cursor = 'default';
    }
  };

  return (
    <>
      {isErasing && (
        <CustomCursor 
          position={cursorPosition} 
          radius={eraserRadius} 
        />
      )}
      
      <Typography variant="h4" gutterBottom sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
        绘图应用
      </Typography>
      
      <Stage
        width={windowSize.width}
        height={windowSize.height}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        onWheel={handleWheel}
        ref={stageRef}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        style={{ cursor: isDragging ? 'grabbing' : (isErasing ? 'none' : 'default') }}
      >
        <Layer>
          <Path
            data={paperPath}
            fill="#f0e6d6"
            shadowColor="rgba(0, 0, 0, 0.2)"
            shadowBlur={10}
            shadowOffset={{ x: 5, y: 5 }}
          />
          <Path
            data={paperPath}
            fill="#e8dfd0"
            scale={{ x: 0.998, y: 0.998 }}
            x={1}
            y={1}
          />
          {renderGrid()}
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.strokeWidth}
              opacity={line.opacity}
              tension={line.tension}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>

      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
        <Button onClick={() => {
          setScale(1);
          setPosition({
            x: (windowSize.width - PAPER_WIDTH) / 2,
            y: (windowSize.height - PAPER_HEIGHT) / 2
          });
        }} variant="contained" sx={{ mr: 1 }}>重置</Button>
      </Box>

      <Box sx={{ 
        position: 'absolute', 
        bottom: 16, 
        left: 16, 
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {Object.entries(BRUSH_TYPES).map(([key, brush]) => (
            <Button
              key={key}
              variant={currentBrush === key ? "contained" : "outlined"}
              onClick={() => setCurrentBrush(key)}
              disabled={isErasing}
              sx={{ minWidth: '80px' }}
            >
              {brush.name}
            </Button>
          ))}
        </Box>

        <Typography gutterBottom>选择颜色:</Typography>
        <input
          type="color"
          value={brushColor}
          onChange={(e) => setBrushColor(e.target.value)}
          disabled={isErasing}
        />
        <Typography gutterBottom>
          {isErasing ? "橡皮擦大小:" : "笔刷大小:"}
        </Typography>
        <Slider
          value={isErasing ? eraserRadius : brushRadius}
          min={1}
          max={isErasing ? 50 : 20}
          onChange={(e, newValue) => 
            isErasing ? setEraserRadius(newValue) : setBrushRadius(newValue)
          }
          valueLabelDisplay="auto"
        />
        <Button 
          variant="contained" 
          color={isErasing ? "primary" : "secondary"}
          onClick={toggleEraser} 
        >
          {isErasing ? "切换到画笔" : "切换到橡皮擦"}
        </Button>
      </Box>
    </>
  );
};

export default DrawingCanvas; 