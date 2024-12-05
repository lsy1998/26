import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useState } from 'react';

export const UrlInputDialog = ({ open, onClose, onSubmit }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = () => {
    if (!url.trim()) {
      setError('请输入URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('请输入有效的URL');
      return;
    }

    onSubmit(url.trim());
    setUrl('');
    setError('');
  };

  const handleClose = () => {
    setUrl('');
    setError('');
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
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
      <DialogTitle>添加网络图片</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="图片URL"
          type="url"
          fullWidth
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError('');
          }}
          error={!!error}
          helperText={error || '输入图片URL，按 Enter 确认，Esc 取消'}
          placeholder="https://example.com/image.jpg"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button onClick={handleSubmit} color="primary" disabled={!url.trim()}>
          确定
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 