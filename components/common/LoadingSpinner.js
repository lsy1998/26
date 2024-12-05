import { Box, CircularProgress } from '@mui/material';

export const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 9999,
      }}
    >
      <CircularProgress size={48} />
      <Box sx={{ mt: 2, color: 'text.secondary' }}>{message}</Box>
    </Box>
  );
}; 