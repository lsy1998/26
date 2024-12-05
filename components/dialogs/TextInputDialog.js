import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  Slider,
  Box,
  Typography,
  styled
} from '@mui/material';
import { useState } from 'react';

const ColorPicker = styled('input')({
  width: '40px',
  height: '40px',
  padding: 0,
  border: 'none',
  borderRadius: '50%',
  cursor: 'pointer',
  '&::-webkit-color-swatch': {
    borderRadius: '50%',
    border: 'none',
  },
  '&::-moz-color-swatch': {
    borderRadius: '50%',
    border: 'none',
  },
});

const PreviewText = styled('div')(({ color, size }) => ({
  fontFamily: 'CustomFont',
  fontSize: `${size}px`,
  color: color,
  marginTop: '16px',
  textAlign: 'center',
  minHeight: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px dashed #ccc',
  borderRadius: '4px',
  padding: '8px',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word'
}));

export const TextInputDialog = ({ open, onClose, onSubmit, initialColor = '#000000' }) => {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [color, setColor] = useState(initialColor);

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit({
        text: text.trim(),
        fontSize,
        color
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setText('');
    setFontSize(24);
    setColor(initialColor);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      onKeyDown={handleKeyDown}
    >
      <DialogTitle>添加文字</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="文字内容"
          fullWidth
          multiline
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="输入文字内容..."
          helperText="按 Ctrl + Enter 确认，Esc 取消"
        />
        
        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom>字体大小</Typography>
          <Slider
            value={fontSize}
            onChange={(_, value) => setFontSize(value)}
            min={12}
            max={72}
            step={1}
            marks={[
              { value: 12, label: '12' },
              { value: 24, label: '24' },
              { value: 48, label: '48' },
              { value: 72, label: '72' },
            ]}
            valueLabelDisplay="auto"
          />
        </Box>

        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography>颜色</Typography>
          <ColorPicker
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </Box>

        {text && (
          <PreviewText color={color} size={fontSize}>
            {text}
          </PreviewText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button onClick={handleSubmit} color="primary" disabled={!text.trim()}>
          确定
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 