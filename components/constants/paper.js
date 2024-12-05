// A4 纸张尺寸（横向）
export const PAPER_DIMENSIONS = {
  WIDTH: 3508, // 297mm -> 3508px
  HEIGHT: 2480, // 210mm -> 2480px
};

export const PAPER_STYLES = {
  FILL: '#f7f2ea',
  SHADOW: {
    COLOR: 'rgba(0, 0, 0, 0.2)',
    BLUR: 10,
    OFFSET: { x: 5, y: 5 },
  },
  GRID: {
    SMALL: {
      SIZE: 50,
      COLOR: '#c0c0c0',
      WIDTH: 0.8,
      OPACITY: 0.6,
    },
    LARGE: {
      SIZE: 250, // 50 * 5
      COLOR: '#a0a0a0',
      WIDTH: 1.2,
      OPACITY: 0.8,
    },
  },
}; 