import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

const TextInputDialog = ({ open, onClose, onSubmit }) => {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [color, setColor] = useState('#000000');

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit({ text, fontSize, color });
    setText('');
    setFontSize(24);
    setColor('#000000');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>添加文字</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="文字内容"
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>字体大小</InputLabel>
          <Select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
          >
            {[16, 20, 24, 32, 40, 48, 64, 80, 96, 128].map(size => (
              <MenuItem key={size} value={size}>{size}px</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>颜色</InputLabel>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ marginTop: '20px', width: '100%', height: '40px' }}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleSubmit} variant="contained">
          添加
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TextInputDialog; 