import { PAPER_DIMENSIONS } from '../components/constants/paper';

export const validatePoint = (point) => {
  if (!point || typeof point.x !== 'number' || typeof point.y !== 'number') {
    throw new Error('Invalid point format');
  }
  
  if (point.x < 0 || point.x > PAPER_DIMENSIONS.WIDTH ||
      point.y < 0 || point.y > PAPER_DIMENSIONS.HEIGHT) {
    throw new Error('Point out of paper bounds');
  }
  
  return true;
};

export const validateLine = (line) => {
  if (!Array.isArray(line.points) || line.points.length < 4 || line.points.length % 2 !== 0) {
    throw new Error('Invalid line points');
  }
  
  if (typeof line.color !== 'string' || !line.color.match(/^#[0-9A-Fa-f]{6}$/)) {
    throw new Error('Invalid line color');
  }
  
  if (typeof line.strokeWidth !== 'number' || line.strokeWidth <= 0) {
    throw new Error('Invalid line stroke width');
  }
  
  if (typeof line.opacity !== 'number' || line.opacity < 0 || line.opacity > 1) {
    throw new Error('Invalid line opacity');
  }
  
  if (typeof line.tension !== 'number' || line.tension < 0 || line.tension > 1) {
    throw new Error('Invalid line tension');
  }
  
  return true;
};

export const validateCanvasData = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid canvas data format');
  }

  if (!data.version || typeof data.version !== 'string') {
    throw new Error('Invalid or missing version');
  }

  if (!Array.isArray(data.lines)) {
    throw new Error('Lines must be an array');
  }

  if (!Array.isArray(data.pinnedImages)) {
    throw new Error('PinnedImages must be an array');
  }

  if (!Array.isArray(data.pins)) {
    throw new Error('Pins must be an array');
  }

  if (!Array.isArray(data.texts)) {
    throw new Error('Texts must be an array');
  }

  // 验证每个元素
  data.lines.forEach(validateLine);
  data.pinnedImages.forEach(validatePinnedImage);
  data.pins.forEach(validatePin);
  data.texts.forEach(validateText);

  return true;
}; 