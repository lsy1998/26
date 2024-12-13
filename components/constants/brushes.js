import {
  Brush as BrushIcon,
  Create as PencilIcon,
  FormatPaintOutlined as MarkerIcon,
  Edit as PenIcon,
} from '@mui/icons-material';

export const BRUSH_TYPES = {
  BRUSH: {
    name: '画笔',
    icon: <BrushIcon />,
    strokeWidth: 5,
    opacity: 0.7,
    tension: 0.8,
  },
  PENCIL: {
    name: '铅笔',
    icon: <PencilIcon />,
    strokeWidth: 2,
    opacity: 0.8,
    tension: 0.5,
  },
  MARKER: {
    name: '记号笔',
    icon: <MarkerIcon />,
    strokeWidth: 8,
    opacity: 0.6,
    tension: 0.2,
  },
  PEN: {
    name: '钢笔',
    icon: <PenIcon />,
    strokeWidth: 3,
    opacity: 1,
    tension: 0.3,
  },
}; 