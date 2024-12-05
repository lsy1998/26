import { useState, useCallback } from 'react';
import { isPointInPaper } from '../utils/canvasHelpers';
import { PAPER_DIMENSIONS } from '../constants';

export const useContextMenu = () => {
  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = useCallback((e, position, scale) => {
    e.evt.preventDefault();

    // 获取相对于画布的位置
    const stage = e.target.getStage();
    if (!stage) return;

    const stagePos = stage.getPointerPosition();
    if (!stagePos) return;

    const pos = {
      x: (stagePos.x - position.x) / scale,
      y: (stagePos.y - position.y) / scale
    };

    // 检查是否在纸张范围内
    if (!isPointInPaper(pos, PAPER_DIMENSIONS.WIDTH, PAPER_DIMENSIONS.HEIGHT)) {
      setContextMenu(null);
      return;
    }

    // 设置右键菜单位置（使用原始鼠标位置）
    setContextMenu({
      mouseX: e.evt.clientX,
      mouseY: e.evt.clientY,
      stagePos: { x: pos.x, y: pos.y }
    });
  }, []);

  return {
    contextMenu,
    setContextMenu,
    handleContextMenu
  };
}; 