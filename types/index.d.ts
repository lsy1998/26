export interface Point {
  x: number;
  y: number;
}

export interface Line {
  points: number[];
  color: string;
  strokeWidth: number;
  opacity: number;
  tension: number;
}

export interface PinnedImage {
  id: number;
  url: string;
  position: Point;
  rotation: number;
  scale: number;
}

export interface Pin {
  id: number;
  position: Point;
  color: string;
  rotation: number;
  scale: number;
}

export interface Text {
  id: number;
  text: string;
  fontSize: number;
  color: string;
  position: Point;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

export interface CanvasData {
  version: string;
  lines: Line[];
  pinnedImages: PinnedImage[];
  pins: Pin[];
  texts: Text[];
  settings?: {
    brushColor?: string;
    brushRadius?: number;
    currentBrush?: string;
  };
} 