import { Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(8px)',
    borderRadius: 8,
    marginTop: 2,
    minWidth: 180,
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    '& .MuiMenuItem-root': {
      fontSize: 14,
      padding: '8px 16px',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      },
    },
  },
}));

export const ContextMenu = ({
  contextMenu,
  onClose,
  onAddImage,
  onAddPin,
  onAddText,
  onPaste,
}) => {
  if (!contextMenu) return null;

  return (
    <StyledMenu
      open={true}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={{
        top: contextMenu.mouseY,
        left: contextMenu.mouseX,
      }}
    >
      <MenuItem onClick={() => { onAddImage?.('local'); onClose(); }}>
        添加本地图片
      </MenuItem>
      <MenuItem onClick={() => { onAddImage?.('url'); onClose(); }}>
        添加网络图片
      </MenuItem>
      <MenuItem onClick={() => { onAddPin?.(contextMenu.stagePos); onClose(); }}>
        添加图钉
      </MenuItem>
      <MenuItem onClick={() => { onAddText?.(contextMenu.stagePos); onClose(); }}>
        添加文字
      </MenuItem>
      <MenuItem onClick={() => { onPaste?.(); onClose(); }}>
        粘贴
      </MenuItem>
    </StyledMenu>
  );
}; 