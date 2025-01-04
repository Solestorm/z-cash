import React from 'react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function BackButton() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Tooltip title="Back to Dashboard">
      <IconButton
        onClick={() => navigate('/dashboard')}
        sx={{
          position: 'absolute',
          left: { xs: 16, sm: 24 },
          top: { xs: 16, sm: 24 },
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[2],
          border: `1px solid ${theme.palette.divider}`,
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.04)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        <ArrowBack />
      </IconButton>
    </Tooltip>
  );
}

export default BackButton; 