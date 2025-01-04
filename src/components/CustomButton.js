import React from 'react';
import { Button, styled, keyframes } from '@mui/material';

const rippleEffect = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.4;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

const StyledButton = styled(Button)(({ theme, variant }) => ({
  position: 'relative',
  overflow: 'hidden',
  transform: 'translate3d(0, 0, 0)',
  transition: 'all 0.3s ease-in-out',
  borderRadius: '50px',
  padding: '8px 24px',
  fontSize: '0.95rem',
  fontWeight: 500,

  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '5px',
    height: '5px',
    background: 'rgba(255, 255, 255, 0.5)',
    opacity: 0,
    borderRadius: '100%',
    transform: 'scale(1, 1) translate(-50%)',
    transformOrigin: '50% 50%'
  },

  '&:active::after': {
    animation: `${rippleEffect} 0.6s ease-out`
  },

  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 8px 16px rgba(255, 255, 255, 0.1)'
      : '0 8px 16px rgba(0, 0, 0, 0.1)',
  },

  '&:active': {
    transform: 'translateY(1px)',
  },

  // Gradient background for contained buttons
  '&.MuiButton-contained': {
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    border: 'none',
    '&:hover': {
      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
    }
  },

  // Gradient border for outlined buttons
  '&.MuiButton-outlined': {
    background: theme.palette.mode === 'dark' ? 'rgba(25, 118, 210, 0.05)' : 'transparent',
    border: `2px solid ${theme.palette.primary.main}`,
    '&:hover': {
      background: theme.palette.mode === 'dark' 
        ? 'rgba(25, 118, 210, 0.15)' 
        : 'rgba(25, 118, 210, 0.05)',
      border: `2px solid ${theme.palette.primary.dark}`,
    }
  },

  // Special styles for nav buttons
  '&.nav-button': {
    borderRadius: '12px',
    minWidth: '120px',
    height: '40px',
    fontSize: '0.875rem',
    boxShadow: 'none',
    border: `2px solid transparent`,
    background: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(25, 118, 210, 0.05)',
    color: theme.palette.primary.main,

    '&:hover': {
      background: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(25, 118, 210, 0.1)',
      border: `2px solid ${theme.palette.primary.main}`,
      transform: 'translateY(-2px)',
    }
  }
}));

function CustomButton({ children, className, ...props }) {
  return (
    <StyledButton 
      className={`${className || ''} ${props.navButton ? 'nav-button' : ''}`} 
      {...props}
    >
      {children}
    </StyledButton>
  );
}

export default CustomButton; 