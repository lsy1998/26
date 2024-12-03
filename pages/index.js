import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button, Slider, Typography, Box } from '@mui/material';

// 动态导入整个绘图组件
const DrawingCanvas = dynamic(() => import('../components/DrawingCanvas'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function Home() {
  return (
    <Box sx={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <DrawingCanvas />
    </Box>
  );
} 