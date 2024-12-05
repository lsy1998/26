import { Create, Brush, Edit, FormatPaintOutlined } from '@mui/icons-material';

export const BRUSH_TYPES = {
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