import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Path, Image, Transformer, Group, Text as KonvaText } from 'react-konva';
import { Html } from 'react-konva-utils';
import { Button, Slider, Typography, Box, Menu, MenuItem } from '@mui/material';
import { 
  Create, // 铅笔
  Brush, // 毛笔
  Edit, // 钢笔
  FormatPaintOutlined, // 马克笔
  AutoFixHigh, // 橡皮擦
  RestartAlt, // 重置
  Save as SaveIcon, // 保存
  Upload as UploadIcon, // 上传
  ExpandLess, // 展开
  ExpandMore, // 收起
  Delete as DeleteIcon, // 添加删除图标导入
} from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import TransformableElement from './TransformableElement';
import UrlInputDialog from './UrlInputDialog';
import TextInputDialog from './TextInputDialog';

// 修改笔刷类型定义
const BRUSH_TYPES = {
  PENCIL: {
    name: 'Pencil',
    icon: <Create />,
    strokeWidth: 2,
    opacity: 0.8,
    tension: 0.5,
  },
  PEN: {
    name: 'Pen',
    icon: <Edit />,
    strokeWidth: 3,
    opacity: 1,
    tension: 0.3,
  },
  MARKER: {
    name: 'Marker',
    icon: <FormatPaintOutlined />,
    strokeWidth: 8,
    opacity: 0.6,
    tension: 0.2,
  },
  BRUSH: {
    name: 'Brush',
    icon: <Brush />,
    strokeWidth: 5,
    opacity: 0.7,
    tension: 0.8,
  },
};

// 修改图钉组件
const PushPin = ({ x, y, color, rotation = 0, scale = 1 }) => {
  return (
    <Group 
      x={x} 
      y={y} 
      rotation={rotation}
      scaleX={scale}
      scaleY={scale}
    >
      {/* 图钉头部 */}
      <Path
        x={-12}
        y={-24}
        data={`
          M12,2 
          a10,10 0 1,0 0,20 
          a10,10 0 1,0 0,-20
          M12,5
          a7,7 0 1,0 0,14
          a7,7 0 1,0 0,-14
        `}
        fill={color}
        scaleX={1.2}
        scaleY={1.2}
        shadowColor="rgba(0,0,0,0.3)"
        shadowBlur={3}
        shadowOffset={{ x: 2, y: 2 }}
      />
      {/* 图钉头部的高光 */}
      <Path
        x={-12}
        y={-24}
        data={`
          M8,7
          a4,4 0 1,0 8,0
          a4,4 0 1,0 -8,0
        `}
        fill="#ffffff"
        opacity={0.3}
        scaleX={1.2}
        scaleY={1.2}
      />
      {/* 图钉针身 */}
      <Path
        x={-12}
        y={-24}
        data={`
          M11,22
          l2,-2
          l2,2
          l-1,15
          l-2,0
          z
        `}
        fill={color}
        scaleX={1.2}
        scaleY={1.2}
        shadowColor="rgba(0,0,0,0.2)"
        shadowBlur={2}
        shadowOffset={{ x: 1, y: 1 }}
      />
      {/* 针身的高光 */}
      <Path
        x={-12}
        y={-24}
        data={`
          M11.5,22
          l1,-1
          l0.5,1
          l-0.5,15
          l-1,0
          z
        `}
        fill="#ffffff"
        opacity={0.2}
        scaleX={1.2}
        scaleY={1.2}
      />
    </Group>
  );
};

// 修改 PinnedImage 组件
const PinnedImage = ({ 
  imageUrl, 
  initialPosition,
  isSelected,
  onSelect,
  onDelete,
  onDragMove,
  onMouseEnter,
  onMouseLeave,
  rotation = 0,  // 添加旋转属性
  scale = 1,     // 添加缩放属性
}) => {
  const [size, setSize] = useState({ width: 100, height: 100 });
  const img = new window.Image();
  
  img.onload = () => {
    const aspectRatio = img.height / img.width;
    setSize({
      width: 100,
      height: 100 * aspectRatio
    });
  };
  
  img.src = imageUrl;

  return (
    <TransformableElement
      position={initialPosition}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      onDragMove={onDragMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      minScale={0.1}
      maxScale={5}
      baseSize={100}
      initialRotation={rotation}  // 传递初始旋转角度
      initialScale={scale}        // 传递初始缩放值
    >
      <Image
        image={img}
        width={size.width}
        height={size.height}
        shadowColor="rgba(0,0,0,0.5)"
        shadowBlur={15}
        shadowOffset={{ x: 8, y: 8 }}
        shadowOpacity={0.8}
      />
    </TransformableElement>
  );
};

// 修改 StandalonePushPin 组件
const StandalonePushPin = ({ 
  position,
  color,
  isSelected,
  onSelect,
  onDelete,
  onDragMove,
  onMouseEnter,
  onMouseLeave,
  rotation = -90,  // 添加旋转属性
  scale = 1.5,     // 添加缩放属性
}) => {
  return (
    <TransformableElement
      position={position}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      onDragMove={onDragMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      initialRotation={rotation}  // 使用传入的旋转值
      initialScale={scale}        // 使用传入的缩放值
      minScale={0.5}
      maxScale={3}
      baseSize={20}
    >
      <PushPin 
        x={0}
        y={0}
        color={color}
        rotation={0}
        scale={1}
      />
    </TransformableElement>
  );
};

// 添加 TransformableText 组件
const TransformableText = ({ 
  text, 
  position,
  fontSize,
  color,
  isSelected,
  onSelect,
  onDelete,
  onDragMove,
  onMouseEnter,
  onMouseLeave,
  rotation = 0,
  scaleX = 1,
  scaleY = 1,
}) => {
  const textRef = useRef(null);
  const transformerRef = useRef(null);

  useEffect(() => {
    if (isSelected && transformerRef.current && textRef.current) {
      transformerRef.current.nodes([textRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleTransform = () => {
    const node = textRef.current;
    if (!node) return;

    onDragMove({
      target: node
    });
  };

  return (
    <>
      <KonvaText
        ref={textRef}
        text={text}
        x={position.x}
        y={position.y}
        fontSize={fontSize}
        fill={color}
        fontFamily="CustomFont, Arial"
        padding={5}
        align="center"
        draggable
        rotation={rotation}
        scaleX={scaleX}
        scaleY={scaleY}
        onClick={onSelect}
        onDragMove={onDragMove}
        onTransform={handleTransform}
        onTransformEnd={handleTransform}
        onMouseEnter={(e) => {
          e.target.getStage().container().style.cursor = 'pointer';
          onMouseEnter?.();
        }}
        onMouseLeave={(e) => {
          e.target.getStage().container().style.cursor = 'default';
          onMouseLeave?.();
        }}
        onContextMenu={(e) => {
          e.evt.preventDefault();
          onDelete();
        }}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={true}
          boundBoxFunc={(oldBox, newBox) => {
            const minScale = 0.2;
            const maxScale = 5;
            const scaleX = newBox.width / oldBox.width;
            const scaleY = newBox.height / oldBox.height;
            if (scaleX < minScale || scaleX > maxScale || 
                scaleY < minScale || scaleY > maxScale) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
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
  const [pinnedImages, setPinnedImages] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isOverImage, setIsOverImage] = useState(false);
  const [pins, setPins] = useState([]); // 添加独立图钉状态
  const [selectedPinId, setSelectedPinId] = useState(null); // 添加选中图钉状态
  const [isOverPin, setIsOverPin] = useState(false);  // 添加新状态
  const [urlDialog, setUrlDialog] = useState({ 
    open: false, 
    type: null,
    position: null 
  });
  const [texts, setTexts] = useState([]);
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [textDialog, setTextDialog] = useState({ open: false, position: null });
  const [isOverText, setIsOverText] = useState(false);
  const [isToolbarExpanded, setIsToolbarExpanded] = useState(true);

  // 义 A4 纸的尺寸（横向）
  const PAPER_WIDTH = 3508; // 297mm -> 3508px
  const PAPER_HEIGHT = 2480; // 210mm -> 2480px

  // 删除 generateRoughPaperPath 函数，替换为简单的矩形路径
  const paperPath = `M 0 0 L ${PAPER_WIDTH} 0 L ${PAPER_WIDTH} ${PAPER_HEIGHT} L 0 ${PAPER_HEIGHT} Z`;

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

  // 修改获取相对位置的函数
  const getRelativePointerPosition = (stage) => {
    const pos = stage.getPointerPosition();
    if (!pos) return null;
    
    // 计算相对于纸张的坐标
    return {
      x: (pos.x - position.x) / scale,
      y: (pos.y - position.y) / scale
    };
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

  // 优化橡皮擦逻辑
  const eraseLines = (eraserX, eraserY, eraserSize) => {
    // 计算实际的橡皮擦大小（考虑缩放）
    const effectiveEraserSize = eraserSize / scale;
    const eraserSizeSquared = effectiveEraserSize * effectiveEraserSize;

    return lines.map(line => {
      const points = line.points;
      let newPoints = [];
      let isSegmentErased = false;
      
      // 优化：使用批量处理而不是逐点处理
      for (let i = 0; i < points.length; i += 2) {
        const x = points[i];
        const y = points[i + 1];
        
        // 使用距离平方比较来避免开方运算
        const dx = x - eraserX;
        const dy = y - eraserY;
        const distanceSquared = dx * dx + dy * dy;
        
        if (distanceSquared > eraserSizeSquared) {
          if (isSegmentErased) {
            // 如果之前的点被擦除了，添加一个断点
            if (newPoints.length > 0) {
              newPoints.push(null, null);
            }
            isSegmentErased = false;
          }
          newPoints.push(x, y);
        } else {
          isSegmentErased = true;
        }
      }

      // 如果没有点被保留，返回 null
      if (newPoints.length === 0) {
        return null;
      }

      // 处理断点，将线分割成多个子线条
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
    .filter(Boolean); // 移除所有 null 值
  };

  // 添加检查点是否在纸张范围内的函数
  const isPointInPaper = (point) => {
    return point.x >= 0 && 
           point.x <= PAPER_WIDTH && 
           point.y >= 0 && 
           point.y <= PAPER_HEIGHT;
  };

  // 修改 handleMouseDown
  const handleMouseDown = (e) => {
    // 如果不是左键点击，不处理绘制
    if (e.evt.button !== 0) {
      // 如果是中键点击，处理拖动
      if (e.evt.button === 1) {
        e.evt.preventDefault();
        e.target.getStage().container().style.cursor = 'grabbing';
        setIsDragging(true);
      }
      return;
    }

    // 如果点击在可交互元素上，不处理绘制
    if (isOverImage || isOverPin || isOverText) {
      return;
    }

    const stage = e.target.getStage();
    const pos = getRelativePointerPosition(stage);
    
    if (!pos) return;

    // 检查是否在纸张范围内
    if (!isPointInPaper(pos)) return;

    setIsDrawing(true);

    if (!isErasing) {
      const newLine = {
        points: [pos.x, pos.y],
        color: brushColor,
        strokeWidth: BRUSH_TYPES[currentBrush].strokeWidth * brushRadius,
        opacity: BRUSH_TYPES[currentBrush].opacity,
        tension: BRUSH_TYPES[currentBrush].tension,
      };
      setLines([...lines, newLine]);
    }
  };

  // 修改 handleMouseMove
  const handleMouseMove = (e) => {
    // 更新光标位置
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    if (point) {
      setCursorPosition({
        x: point.x,
        y: point.y
      });
    }

    // 如果正在拖动，优先处理拖动
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
    if (!pos) return;

    // 只在纸张范围内绘制
    if (!isPointInPaper(pos)) return;

    if (isErasing) {
      const newLines = eraseLines(pos.x, pos.y, eraserRadius);
      setLines(newLines);
      return;
    }

    let lastLine = lines[lines.length - 1];
    if (!lastLine) return;

    // 更新最后一条线的点
    const newPoints = [...lastLine.points, pos.x, pos.y];
    const newLines = [...lines];
    newLines[newLines.length - 1] = {
      ...lastLine,
      points: newPoints,
    };
    setLines(newLines);
  };

  const handleMouseUp = (e) => {
    // 如果是标中键释放停止拖动
    if (e.evt.button === 1) {
      e.target.getStage().container().style.cursor = 'default';
      setIsDragging(false);
      return;
    }
    setIsDrawing(false);  // 无论画笔还是擦模重置 isDrawing
  };

  // 更新鼠标进/离开画布的处理
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
    // 只有在非橡皮擦模式下才重置光标
    if (!isErasing) {
      if (stageRef.current) {
        stageRef.current.container().style.cursor = 'default';
      }
      document.body.style.cursor = 'default';
    }
  };

  const renderGrid = () => {
    const gridSize = 50;
    const lines = [];

    // 绘制垂直线，从第一条线开始，到倒数第二条线结束
    for (let i = gridSize; i < PAPER_WIDTH; i += gridSize) {
      lines.push(
        <Line
          key={`v${i}`}
          points={[i, 0, i, PAPER_HEIGHT]}
          stroke="#c0c0c0"
          strokeWidth={0.8}
          opacity={0.6}
        />
      );
    }

    // 绘制水平线，从第一条线开始，到倒数第二条线结束
    for (let i = gridSize; i < PAPER_HEIGHT; i += gridSize) {
      lines.push(
        <Line
          key={`h${i}`}
          points={[0, i, PAPER_WIDTH, i]}
          stroke="#c0c0c0"
          strokeWidth={0.8}
          opacity={0.6}
        />
      );
    }

    // 添加更粗的主网格线，同样避开边缘
    for (let i = gridSize * 5; i < PAPER_WIDTH; i += gridSize * 5) {
      lines.push(
        <Line
          key={`vMain${i}`}
          points={[i, 0, i, PAPER_HEIGHT]}
          stroke="#a0a0a0"
          strokeWidth={1.2}
          opacity={0.8}
        />
      );
    }

    for (let i = gridSize * 5; i < PAPER_HEIGHT; i += gridSize * 5) {
      lines.push(
        <Line
          key={`hMain${i}`}
          points={[0, i, PAPER_WIDTH, i]}
          stroke="#a0a0a0"
          strokeWidth={1.2}
          opacity={0.8}
        />
      );
    }

    return lines;
  };

  // 添加自义光标组件
  const CustomCursor = ({ position, radius }) => {
    const stage = stageRef.current;
    if (!stage) return null;

    // 计算实际显示的光标大小（考虑缩放）
    const displayRadius = radius * scale;

    // 考虑画布的变换
    const stageBox = stage.container().getBoundingClientRect();
    const cursorX = position.x + stageBox.left;
    const cursorY = position.y + stageBox.top;

    return (
      <div
        style={{
          position: 'fixed',
          left: cursorX,
          top: cursorY,
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

  // 添加重置函数
  const handleReset = () => {
    const centerX = (window.innerWidth - PAPER_WIDTH) / 2;
    const centerY = (window.innerHeight - PAPER_HEIGHT) / 2;
    setPosition({ x: centerX, y: centerY });
    setScale(1);
  };

  // 修改右键菜单处理函数
  const handleContextMenu = (e) => {
    e.evt.preventDefault();

    // 获取相对于画布的位置
    const stage = e.target.getStage();
    const pos = getRelativePointerPosition(stage);

    // 检查是否在纸张范围内
    if (!pos || !isPointInPaper(pos)) {
      setContextMenu(null);
      return;
    }

    // 设置右键菜单位置和状态
    setContextMenu({
      mouseX: e.evt.clientX,
      mouseY: e.evt.clientY,
      stagePos: pos
    });
  };

  // 修改图片上传处理函数
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPinnedImages([
          ...pinnedImages,
          {
            id: Date.now(),
            url: event.target.result,
            position: contextMenu?.stagePos || { x: PAPER_WIDTH / 2, y: PAPER_HEIGHT / 2 },
            rotation: 0,
            scale: 1,
          }
        ]);
      };
      reader.readAsDataURL(file);
    }
    setContextMenu(null);
  };

  // 添加图片选择处理函数
  const handleStageClick = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedImageId(null);
      setSelectedPinId(null);
    }
  };

  // 添加图钉颜色改变处理函数
  const handlePinColorChange = (id, newColor) => {
    setPinnedImages(pinnedImages.map(img => 
      img.id === id ? { ...img, pinColor: newColor } : img
    ));
  };

  // 添加图钉处理函数
  const handleAddPin = () => {
    if (contextMenu) {
      setPins([
        ...pins,
        {
          id: Date.now(),
          position: contextMenu.stagePos,
          color: '#FF4081',
          rotation: -90, // 添加初始旋转
          scale: 1.5,   // 添加初始缩放
        }
      ]);
      setContextMenu(null);
    }
  };

  // 添加图钉拖动处理函数
  const handlePinDragMove = (pinId, e) => {
    const node = e.target;
    setPins(pins.map(pin => 
      pin.id === pinId ? {
        ...pin,
        position: {
          x: node.x(),
          y: node.y()
        },
        rotation: node.rotation(),
        scale: node.scaleX(),
      } : pin
    ));
  };

  // 修改处理在线资源的函数，保存点击位置
  const handleOnlineResource = (type) => {
    const clickPosition = contextMenu.stagePos; // 保存点击位置
    setUrlDialog({ 
      open: true, 
      type,
      position: clickPosition // 保存位置信息
    });
    setContextMenu(null);
  };

  // 修改 URL 提交处理函数
  const handleUrlSubmit = (url) => {
    if (urlDialog.type === 'image') {
      setPinnedImages([
        ...pinnedImages,
        {
          id: Date.now(),
          url: url,
          position: urlDialog.position,
          rotation: 0,
          scale: 1,
        }
      ]);
    } else if (urlDialog.type === 'icon') {
      // 这可以添加在线图标的处理
    }
  };

  // 添加文处理数
  const handleAddText = () => {
    setTextDialog({ 
      open: true, 
      position: contextMenu.stagePos 
    });
    setContextMenu(null);
  };

  // 处理交
  const handleTextSubmit = ({ text, fontSize, color }) => {
    setTexts([
      ...texts,
      {
        id: Date.now(),
        text,
        fontSize,
        color,
        position: textDialog.position,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      }
    ]);
  };

  // 移动字体加载到组件内部
  useEffect(() => {
    const font = new FontFace('CustomFont', `url(/fonts/bluefish.ttf)`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      if (stageRef.current) {
        stageRef.current.batchDraw();
      }
    }).catch((error) => {
      console.error('Font loading failed:', error);
    });
  }, []);

  // 修改文字拖动处理函数
  const handleTextDragMove = (textId, e) => {
    const { target } = e;
    if (!target) return;

    setTexts(texts.map(t => 
      t.id === textId ? {
        ...t,
        position: {
          x: target.x(),
          y: target.y()
        },
        rotation: target.rotation(),
        scaleX: target.scaleX(),
        scaleY: target.scaleY(),
      } : t
    ));
  };

  // 修改 TransformableText 组件的 handleTransform
  const handleTransform = () => {
    const node = textRef.current;
    if (!node) return;

    // 直接使用节点的方法获取属性
    onDragMove({
      target: node
    });
  };

  // 修改保存函数，确保保存完整的线条数据
  const saveCanvasData = () => {
    const canvasData = {
      lines: lines.map(line => ({
        points: line.points,
        color: line.color,
        strokeWidth: line.strokeWidth,
        opacity: line.opacity,
        tension: line.tension,
      })),
      pinnedImages: pinnedImages.map(img => ({
        id: img.id,
        url: img.url,
        position: img.position,
        rotation: img.rotation || 0,
        scale: img.scale || 1,
      })),
      pins: pins.map(pin => ({
        id: pin.id,
        position: pin.position,
        color: pin.color,
        rotation: pin.rotation || -90,
        scale: pin.scale || 1.5,
      })),
      texts: texts.map(text => ({
        id: text.id,
        text: text.text,
        fontSize: text.fontSize,
        color: text.color,
        position: text.position,
        rotation: text.rotation || 0,
        scaleX: text.scaleX || 1,
        scaleY: text.scaleY || 1,
      })),
      version: '1.0',
    };

    const jsonString = JSON.stringify(canvasData);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `canvas-data-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 修改加载函数，确保数据格式正确
  const loadCanvasData = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (!data.version) {
          alert('Invalid file format');
          return;
        }

        // 确保每个线条都有完整的属性
        const processedLines = (data.lines || []).map(line => ({
          points: line.points,
          color: line.color || '#000000',
          strokeWidth: line.strokeWidth || (BRUSH_TYPES.PENCIL.strokeWidth * 5),
          opacity: line.opacity || BRUSH_TYPES.PENCIL.opacity,
          tension: line.tension || BRUSH_TYPES.PENCIL.tension,
        }));

        setLines(processedLines);
        setPinnedImages(data.pinnedImages || []);
        setPins(data.pins || []);
        setTexts(data.texts || []);

        // 重置选中状态
        setSelectedImageId(null);
        setSelectedPinId(null);
        setSelectedTextId(null);
        
        // 重置工具状态
        setIsErasing(false);
        setIsDrawing(false);
        setCurrentBrush('PENCIL');
        
      } catch (error) {
        console.error('Error loading canvas data:', error);
        alert('Error loading file');
      }
    };
    reader.readAsText(file);
  };

  // 添加文件输入引用
  const loadFileInputRef = useRef(null);

  // 修改图片拖动处理函数
  const handleImageDragMove = (imageId, e) => {
    const node = e.target;
    setPinnedImages(pinnedImages.map(img => 
      img.id === imageId ? {
        ...img,
        position: {
          x: node.x(),
          y: node.y()
        },
        rotation: node.rotation(),
        scale: node.scaleX(),
      } : img
    ));
  };

  // 修改工具栏组件
  const Toolbar = () => {
    // 获取当前选中的元素
    const hasSelectedElement = selectedImageId || selectedPinId || selectedTextId;

    return (
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
        onMouseEnter={() => {
          // 临时显示默认光标
          document.body.style.cursor = 'default';
        }}
        onMouseLeave={() => {
          // 如果是橡皮擦模式，恢复隐光标
          if (isErasing) {
            document.body.style.cursor = 'none';
          }
        }}
      >
        {/* 展开/收起按钮 */}
        <Button
          onClick={() => setIsToolbarExpanded(!isToolbarExpanded)}
          sx={{
            minWidth: '32px',
            width: '32px',
            height: '32px',
            padding: 0,
            backgroundColor: 'transparent',
            color: 'rgba(0, 0, 0, 0.5)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          {isToolbarExpanded ? <ExpandLess /> : <ExpandMore />}
        </Button>

        {/* 工具栏内容 */}
        {isToolbarExpanded && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              backgroundColor: 'transparent',
              padding: '4px',
              borderRadius: 1,
              '& .MuiButton-root': {
                backgroundColor: 'transparent',
                color: 'rgba(0, 0, 0, 0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&.Mui-disabled': {
                  color: 'rgba(0, 0, 0, 0.2)',
                }
              }
            }}
          >
            {/* 画笔工具组 */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {Object.entries(BRUSH_TYPES).map(([key, brush]) => (
                <Tooltip key={key} title={brush.name} arrow placement="left">
                  <Button
                    size="small"
                    onClick={() => setCurrentBrush(key)}
                    disabled={isErasing}
                    sx={{
                      minWidth: '32px',
                      width: '32px',
                      height: '32px',
                      padding: 0,
                      ...(currentBrush === key && {
                        backgroundColor: 'rgba(0, 0, 0, 0.05) !important',
                      })
                    }}
                  >
                    {brush.icon}
                  </Button>
                </Tooltip>
              ))}
            </Box>

            {/* 颜色和大小控制 */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Color" arrow placement="left">
                <Box 
                  sx={{ 
                    width: '32px', 
                    height: '32px',
                    border: '2px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}
                >
                  <input
                    type="color"
                    value={brushColor}
                    onChange={(e) => setBrushColor(e.target.value)}
                    disabled={isErasing}
                    style={{
                      width: '150%',
                      height: '150%',
                      margin: '-25%',
                      padding: 0,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  />
                </Box>
              </Tooltip>
              <Tooltip title={isErasing ? "Eraser" : "Brush"} arrow placement="left">
                <Button
                  size="small"
                  onClick={toggleEraser}
                  sx={{
                    minWidth: '32px',
                    width: '32px',
                    height: '32px',
                    padding: 0,
                    ...(isErasing && {
                      backgroundColor: 'rgba(0, 0, 0, 0.05) !important',
                    })
                  }}
                >
                  <AutoFixHigh />
                </Button>
              </Tooltip>
            </Box>

            {/* 文件操作按钮组 */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Save" arrow placement="left">
                <Button
                  size="small"
                  onClick={saveCanvasData}
                  sx={{
                    minWidth: '32px',
                    width: '32px',
                    height: '32px',
                    padding: 0,
                  }}
                >
                  <SaveIcon />
                </Button>
              </Tooltip>
              <Tooltip title="Load" arrow placement="left">
                <Button
                  size="small"
                  onClick={() => loadFileInputRef.current?.click()}
                  sx={{
                    minWidth: '32px',
                    width: '32px',
                    height: '32px',
                    padding: 0,
                  }}
                >
                  <UploadIcon />
                </Button>
              </Tooltip>
              <Tooltip title="Reset" arrow placement="left">
                <Button
                  size="small"
                  onClick={handleReset}
                  sx={{
                    minWidth: '32px',
                    width: '32px',
                    height: '32px',
                    padding: 0,
                  }}
                >
                  <RestartAlt />
                </Button>
              </Tooltip>
            </Box>

            {/* 大小调节滑块 */}
            <Tooltip title={isErasing ? "Eraser Size" : "Brush Size"} arrow placement="left">
              <Box sx={{ width: '100px', px: 1 }}>
                <Slider
                  size="small"
                  value={isErasing ? eraserRadius : brushRadius}
                  min={1}
                  max={isErasing ? 50 : 20}
                  onChange={(e, newValue) => 
                    isErasing ? setEraserRadius(newValue) : setBrushRadius(newValue)
                  }
                  sx={{
                    color: 'rgba(0, 0, 0, 0.5)',
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#fff',
                      border: '2px solid rgba(0, 0, 0, 0.5)',
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    }
                  }}
                />
              </Box>
            </Tooltip>

            {/* 添加删除按钮，只在有选中元素时显示 */}
            {hasSelectedElement && (
              <Tooltip title="Delete Selected" arrow placement="left">
                <Button
                  size="small"
                  onClick={() => {
                    if (selectedImageId) {
                      handleDeleteImage(selectedImageId);
                    } else if (selectedPinId) {
                      handleDeletePin(selectedPinId);
                    } else if (selectedTextId) {
                      handleDeleteText(selectedTextId);
                    }
                  }}
                  sx={{
                    minWidth: '32px',
                    width: '32px',
                    height: '32px',
                    padding: 0,
                    backgroundColor: 'transparent',
                    color: 'rgba(255, 0, 0, 0.5)',  // 使用红色表示删除
                    '&:hover': {
                      backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    }
                  }}
                >
                  <DeleteIcon />
                </Button>
              </Tooltip>
            )}
          </Box>
        )}
      </Box>
    );
  };

  // 删除图钉的处理函数
  const handleDeletePin = (pinId) => {
    setPins(pins.filter(pin => pin.id !== pinId));
    setSelectedPinId(null); // 清除选中状态
  };

  // 修改删除图片的处理函数
  const handleDeleteImage = (imageId) => {
    setPinnedImages(pinnedImages.filter(img => img.id !== imageId));
    setSelectedImageId(null); // 清除选中状态
  };

  // 修改删除文字的处理函数
  const handleDeleteText = (textId) => {
    setTexts(texts.filter(text => text.id !== textId));
    setSelectedTextId(null); // 清除选中状态
  };

  // 添加初始化函数
  const initializeCanvas = async () => {
    try {
      const response = await fetch('/initial-canvas.json');
      if (!response.ok) {
        console.warn('No initial canvas data found');
        return;
      }
      
      const data = await response.json();
      
      // 验证数据格式
      if (!data.version) {
        console.warn('Invalid canvas data format');
        return;
      }

      // 初始化各种元素
      if (data.lines) {
        setLines(data.lines.map(line => ({
          points: line.points,
          color: line.color || '#000000',
          strokeWidth: line.strokeWidth || (BRUSH_TYPES.PENCIL.strokeWidth * 5),
          opacity: line.opacity || BRUSH_TYPES.PENCIL.opacity,
          tension: line.tension || BRUSH_TYPES.PENCIL.tension,
        })));
      }

      if (data.pinnedImages) {
        setPinnedImages(data.pinnedImages.map(img => ({
          id: img.id || Date.now(),
          url: img.url,
          position: img.position,
          rotation: img.rotation || 0,
          scale: img.scale || 1,
        })));
      }

      if (data.pins) {
        setPins(data.pins.map(pin => ({
          id: pin.id || Date.now(),
          position: pin.position,
          color: pin.color || '#FF4081',
          rotation: pin.rotation || -90,
          scale: pin.scale || 1.5,
        })));
      }

      if (data.texts) {
        setTexts(data.texts.map(text => ({
          id: text.id || Date.now(),
          text: text.text,
          fontSize: text.fontSize,
          color: text.color,
          position: text.position,
          rotation: text.rotation || 0,
          scaleX: text.scaleX || 1,
          scaleY: text.scaleY || 1,
        })));
      }

      // 可以添加其他初始化设置
      if (data.settings) {
        if (data.settings.brushColor) setBrushColor(data.settings.brushColor);
        if (data.settings.brushRadius) setBrushRadius(data.settings.brushRadius);
        if (data.settings.currentBrush) setCurrentBrush(data.settings.currentBrush);
        // ... 其他设置
      }

    } catch (error) {
      console.error('Error loading initial canvas data:', error);
    }
  };

  // 在组件加载时调用初始化函数
  useEffect(() => {
    initializeCanvas();
  }, []); // 空依赖数组表示只在组件挂载时执行一次

  return (
    <>
      {isErasing && (
        <CustomCursor 
          position={cursorPosition} 
          radius={eraserRadius} 
        />
      )}
      
      <Typography variant="h4" gutterBottom sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
        
      </Typography>
      
      <Stage
        width={windowSize.width}
        height={windowSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
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
        style={{ 
          cursor: isDragging ? 'grabbing' : (isErasing ? 'none' : 'default'),
          touchAction: 'none',
          userSelect: 'none'
        }}
        onContextMenu={(e) => {
          e.evt.preventDefault();
          handleContextMenu(e);
        }}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={PAPER_WIDTH}
            height={PAPER_HEIGHT}
            fill="#f7f2ea"
            shadowColor="rgba(0, 0, 0, 0.2)"
            shadowBlur={10}
            shadowOffset={{ x: 5, y: 5 }}
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
          {pinnedImages.map((img) => (
            <PinnedImage
              key={img.id}
              imageUrl={img.url}
              initialPosition={img.position}
              rotation={img.rotation || 0}
              scale={img.scale || 1}
              isSelected={img.id === selectedImageId}
              onSelect={(e) => {
                e.cancelBubble = true;
                setSelectedImageId(img.id);
                setSelectedPinId(null);
              }}
              onDelete={() => handleDeleteImage(img.id)}
              onDragMove={(e) => handleImageDragMove(img.id, e)}
              onMouseEnter={() => setIsOverImage(true)}
              onMouseLeave={() => setIsOverImage(false)}
            />
          ))}
          {pins.map((pin) => (
            <StandalonePushPin
              key={pin.id}
              position={pin.position}
              color={pin.color}
              isSelected={pin.id === selectedPinId}
              rotation={pin.rotation || -90}
              scale={pin.scale || 1.5}
              onSelect={(e) => {
                e.cancelBubble = true;
                setSelectedPinId(pin.id);
                setSelectedImageId(null);
              }}
              onDelete={() => handleDeletePin(pin.id)}
              onDragMove={(e) => handlePinDragMove(pin.id, e)}
              onMouseEnter={() => setIsOverPin(true)}
              onMouseLeave={() => setIsOverPin(false)}
            />
          ))}
          {texts.map((textItem) => (
            <TransformableText
              key={textItem.id}
              {...textItem}
              isSelected={textItem.id === selectedTextId}
              onSelect={(e) => {
                e.cancelBubble = true;
                setSelectedTextId(textItem.id);
                setSelectedImageId(null);
                setSelectedPinId(null);
              }}
              onDelete={() => handleDeleteText(textItem.id)}
              onDragMove={(e) => handleTextDragMove(textItem.id, e)}
              onMouseEnter={() => setIsOverText(true)}
              onMouseLeave={() => setIsOverText(false)}
            />
          ))}
        </Layer>
      </Stage>

      <Toolbar />

      {selectedImageId && pinnedImages.find(img => img.id === selectedImageId) && (
        <div
          style={{
            position: 'absolute',
            top: position.y + pinnedImages.find(img => img.id === selectedImageId).position.y - 40,
            left: position.x + pinnedImages.find(img => img.id === selectedImageId).position.x + 40,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            zIndex: 1000,
          }}
        >
          <input
            type="color"
            value={pinnedImages.find(img => img.id === selectedImageId).pinColor}
            onChange={(e) => handlePinColorChange(selectedImageId, e.target.value)}
            style={{
              width: '20px',
              height: '20px',
              padding: 0,
              border: 'none',
              cursor: 'pointer'
            }}
          />
        </div>
      )}

      {selectedPinId && pins.find(pin => pin.id === selectedPinId) && (
        <div
          style={{
            position: 'absolute',
            top: position.y + pins.find(pin => pin.id === selectedPinId).position.y - 40,
            left: position.x + pins.find(pin => pin.id === selectedPinId).position.x + 40,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            zIndex: 1000,
          }}
        >
          <input
            type="color"
            value={pins.find(pin => pin.id === selectedPinId).color}
            onChange={(e) => {
              setPins(pins.map(pin => 
                pin.id === selectedPinId ? { ...pin, color: e.target.value } : pin
              ));
            }}
            style={{
              width: '20px',
              height: '20px',
              padding: 0,
              border: 'none',
              cursor: 'pointer'
            }}
          />
        </div>
      )}

      {/* 添加URL输入对话框 */}
      <UrlInputDialog
        open={urlDialog.open}
        type={urlDialog.type}
        onClose={() => setUrlDialog({ open: false, type: null })}
        onSubmit={handleUrlSubmit}
      />

      {/* 添加文字输入对话框 */}
      <TextInputDialog
        open={textDialog.open}
        onClose={() => setTextDialog({ open: false, position: null })}
        onSubmit={handleTextSubmit}
      />

      {/* 添加加载文件的隐藏输入 */}
      <input
        ref={loadFileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files?.[0]) {
            loadCanvasData(e.target.files[0]);
            e.target.value = ''; // 重置输入，允许加载相同的文件
          }
        }}
      />

      {/* 添加右键菜单 */}
      <Menu
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(5px)',
            '& .MuiMenuItem-root': {
              fontSize: '0.9rem',
              py: 1,
            }
          }
        }}
        keepMounted={false}
        disablePortal
        slotProps={{
          backdrop: {
            invisible: true,
          },
        }}
      >
        <MenuItem 
          onClick={() => {
            fileInputRef.current?.click();
            setContextMenu(null);
          }}
        >
          Add Local Image
        </MenuItem>
        <MenuItem 
          onClick={() => {
            handleOnlineResource('image');
            setContextMenu(null);
          }}
        >
          Add Online Image
        </MenuItem>
        <MenuItem 
          onClick={() => {
            handleOnlineResource('icon');
            setContextMenu(null);
          }}
        >
          Add Online Icon
        </MenuItem>
        <MenuItem 
          onClick={() => {
            handleAddPin();
            setContextMenu(null);
          }}
        >
          Add a Pin
        </MenuItem>
        <MenuItem 
          onClick={() => {
            handleAddText();
            setContextMenu(null);
          }}
        >
          Add Text
        </MenuItem>
      </Menu>

      {/* 添加文件输入引用 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
    </>
  );
};

export default DrawingCanvas; 