import { Box, IconButton, Paper, Tooltip, Slider } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Brush as BrushIcon,
  Create as PencilIcon,
  FormatPaintOutlined as MarkerIcon,
  Edit as PenIcon,
  RestartAlt as ResetIcon,
  SaveAlt as SaveIcon,
  Upload as LoadIcon,
  Delete as DeleteIcon,
  FormatClear as EraserIcon,
  KeyboardArrowUp,
  KeyboardArrowDown,
  Image as ExportIcon,
} from '@mui/icons-material';
import { BRUSH_TYPES } from '../constants/brushes';

const ToolbarContainer = styled(Paper)(({ theme, expanded }) => ({
  position: 'fixed',
  right: theme.spacing(2),
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  backgroundColor: 'transparent',
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  boxShadow: `
    0 4px 20px rgba(0, 0, 0, 0.05),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 2px rgba(255, 255, 255, 0.4)
  `,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  maxHeight: expanded ? '80vh' : '48px',
  overflow: 'hidden',
  zIndex: 1000,
  borderRadius: '12px',
  [theme.breakpoints.down('sm')]: {
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    left: theme.spacing(2),
    maxHeight: expanded ? '60vh' : '48px',
    flexDirection: expanded ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
  [theme.breakpoints.up('sm')]: {
    top: theme.spacing(2),
    width: 'auto',
  },
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
  },
}));

const ToolbarContent = styled(Box)(({ theme, expanded }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  opacity: expanded ? 1 : 0,
  transform: expanded ? 'translateY(0)' : 'translateY(-20px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  visibility: expanded ? 'visible' : 'hidden',
  padding: '4px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    transform: expanded ? 'translateY(0)' : 'translateY(20px)',
  },
}));

const ColorPicker = styled('input')(({ theme }) => ({
  width: '40px',
  height: '40px',
  padding: 0,
  border: 'none',
  borderRadius: '50%',
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative',
  boxShadow: `
    0 2px 8px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.4)
  `,
  '&::-webkit-color-swatch': {
    borderRadius: '50%',
    border: 'none',
    width: '100%',
    height: '100%',
  },
  '&::-moz-color-swatch': {
    borderRadius: '50%',
    border: 'none',
    width: '100%',
    height: '100%',
  },
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: `
      0 4px 12px rgba(0, 0, 0, 0.15),
      inset 0 0 0 1px rgba(255, 255, 255, 0.35),
      inset 0 2px 6px rgba(255, 255, 255, 0.45)
    `,
    transition: 'transform 0.2s ease',
  },
  [theme.breakpoints.down('sm')]: {
    width: '32px',
    height: '32px',
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  boxShadow: `
    0 2px 4px rgba(0, 0, 0, 0.03),
    inset 0 0 0 1px rgba(255, 255, 255, 0.04),
    inset 0 1px 2px rgba(255, 255, 255, 0.3)
  `,
  '& svg': {
    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))',
    transition: 'all 0.2s ease-in-out',
    color: 'rgba(0, 0, 0, 0.54)',
  },
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
    '& svg': {
      transform: 'translateY(-1px)',
      filter: 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.25))',
      color: theme.palette.primary.main,
    },
  },
  '&.MuiIconButton-colorPrimary': {
    background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.08) 0%, rgba(25, 118, 210, 0.04) 100%)',
    boxShadow: `
      0 2px 4px rgba(25, 118, 210, 0.1),
      inset 0 0 0 1px rgba(25, 118, 210, 0.2)
    `,
    '& svg': {
      filter: 'none',
      color: theme.palette.primary.main,
      transform: 'translateY(-1px)',
    },
    '&:hover': {
      background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.12) 0%, rgba(25, 118, 210, 0.06) 100%)',
      boxShadow: `
        0 2px 6px rgba(25, 118, 210, 0.15),
        inset 0 0 0 1px rgba(25, 118, 210, 0.3)
      `,
      '& svg': {
        filter: 'none',
        transform: 'translateY(-2px)',
      },
    },
  },
  '&:active': {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
    '& svg': {
      transform: 'translateY(0)',
      filter: 'none',
    },
  },
  '&.Mui-disabled': {
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
    opacity: 0.3,
    '& svg': {
      filter: 'none',
      transform: 'none',
      color: 'rgba(0, 0, 0, 0.26)',
    },
  },
  transition: 'all 0.2s ease-in-out',
  borderRadius: '8px',
  [theme.breakpoints.down('sm')]: {
    padding: '8px',
    '& svg': {
      fontSize: '1.25rem',
    },
  },
}));

const StyledSlider = styled(Slider)(({ theme }) => ({
  '& .MuiSlider-thumb': {
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  '& .MuiSlider-track': {
    backgroundColor: theme.palette.primary.main,
    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
  },
  '& .MuiSlider-rail': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  [theme.breakpoints.down('sm')]: {
    width: '150px',
    margin: '0 8px',
    '& .MuiSlider-thumb': {
      width: '16px',
      height: '16px',
    },
  },
}));

export const Toolbar = ({
  isToolbarExpanded,
  setIsToolbarExpanded,
  currentBrush,
  setCurrentBrush,
  isErasing,
  toggleEraser,
  brushColor,
  setBrushColor,
  brushRadius,
  setBrushRadius,
  eraserRadius,
  setEraserRadius,
  handleReset,
  saveCanvasData,
  loadFileInputRef,
  hasSelectedElement,
  handleDeleteSelected,
  onExport,
  uploadToServer,
}) => {
  return (
    <ToolbarContainer expanded={isToolbarExpanded}>
      <Tooltip 
        title={isToolbarExpanded ? "收起工具栏" : "展开工具栏"} 
        placement="left"
      >
        <StyledIconButton 
          onClick={() => setIsToolbarExpanded(prev => !prev)} 
          size="small"
          sx={{
            transform: isToolbarExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <KeyboardArrowUp />
        </StyledIconButton>
      </Tooltip>

      <ToolbarContent expanded={isToolbarExpanded}>
        <>
          {/* 画笔选择按钮 */}
          {Object.entries(BRUSH_TYPES).map(([type, brush]) => (
            <Tooltip key={type} title={brush.name} placement="left">
              <StyledIconButton
                onClick={() => {
                  console.log('Changing brush from:', currentBrush, 'to:', type);
                  setCurrentBrush(type);
                }}
                color={currentBrush === type ? 'primary' : 'default'}
              >
                {brush.icon}
              </StyledIconButton>
            </Tooltip>
          ))}

          {/* 橡皮擦按钮 */}
          <Tooltip title="橡皮擦" placement="left">
            <StyledIconButton
              onClick={toggleEraser}
              color={isErasing ? 'primary' : 'default'}
            >
              <EraserIcon />
            </StyledIconButton>
          </Tooltip>

          {/* 颜色选择器 */}
          <Tooltip title="颜色" placement="left">
            <ColorPicker
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
            />
          </Tooltip>

          {/* 画笔大小滑块 */}
          {!isErasing && (
            <Box sx={{ px: 1, width: '100%' }}>
              <StyledSlider
                value={brushRadius}
                onChange={(_, value) => setBrushRadius(value)}
                min={1}
                max={20}
                step={1}
              />
            </Box>
          )}

          {/* 橡皮擦大小滑块 */}
          {isErasing && (
            <Box sx={{ px: 1, width: '100%' }}>
              <StyledSlider
                value={eraserRadius}
                onChange={(_, value) => setEraserRadius(value)}
                min={5}
                max={50}
                step={1}
              />
            </Box>
          )}

          {/* 其他按钮 */}
          <Tooltip title="重置视图" placement="left">
            <StyledIconButton onClick={handleReset}>
              <ResetIcon />
            </StyledIconButton>
          </Tooltip>

          <Tooltip title="保存" placement="left">
            <StyledIconButton onClick={saveCanvasData}>
              <SaveIcon />
            </StyledIconButton>
          </Tooltip>

          <Tooltip title="上传到服务器" placement="left">
            <StyledIconButton onClick={uploadToServer}>
              <SaveIcon />
            </StyledIconButton>
          </Tooltip>

          <Tooltip title="导出可视区域" placement="left">
            <StyledIconButton onClick={onExport}>
              <ExportIcon />
            </StyledIconButton>
          </Tooltip>

          <Tooltip title="加载" placement="left">
            <StyledIconButton onClick={() => loadFileInputRef.current?.click()}>
              <LoadIcon />
            </StyledIconButton>
          </Tooltip>

          {hasSelectedElement && (
            <Tooltip title="删除" placement="left">
              <StyledIconButton onClick={handleDeleteSelected}>
                <DeleteIcon />
              </StyledIconButton>
            </Tooltip>
          )}
        </>
      </ToolbarContent>
    </ToolbarContainer>
  );
}; 