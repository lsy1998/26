import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const UrlInputDialog = ({ open, onClose, onSubmit, type }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!url) {
      setError('请输入URL');
      return;
    }

    try {
      new URL(url);
      onSubmit(url);
      setUrl('');
      setError('');
      onClose();
    } catch (e) {
      setError('请输入有效的URL');
    }
  };

  const handleClose = () => {
    setUrl('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {type === 'image' ? '添加在线图片' : '添加在线图标'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="URL"
          type="url"
          fullWidth
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button onClick={handleSubmit} variant="contained">
          添加
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UrlInputDialog; 