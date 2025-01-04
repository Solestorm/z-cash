import React from 'react';
import { Box, Typography } from '@mui/material';
import { CurrencyExchange } from '@mui/icons-material';

function Logo({ size = 'medium' }) {
  const sizes = {
    small: { icon: 24, text: 'h6' },
    medium: { icon: 32, text: 'h5' },
    large: { icon: 48, text: 'h4' }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 1,
        animation: 'fadeIn 0.5s ease-in'
      }}
    >
      <CurrencyExchange 
        sx={{ 
          fontSize: sizes[size].icon,
          color: 'primary.main',
          animation: 'spin 20s linear infinite'
        }}
      />
      <Typography 
        variant={sizes[size].text}
        sx={{
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #1976d2, #dc004e)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        Z-Cash
      </Typography>
    </Box>
  );
}

export default Logo; 