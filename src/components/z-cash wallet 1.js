import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  useTheme,
  Container,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  Fade,
  styled
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  AccountCircle, 
  ExitToApp, 
  Settings, 
  Security,
  Brightness4, 
  Brightness7 
} from '@mui/icons-material';
import { useDarkMode } from '../contexts/DarkModeContext';
import Logo from './Logo';
import CustomButton from './CustomButton';

// Styled Avatar with animation
const StyledAvatar = styled(Avatar)(({ theme }) => ({
  cursor: 'pointer',
  border: `2px solid ${theme.palette.primary.main}`,
  transition: 'all 0.3s ease',
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: `0 0 20px ${theme.palette.primary.main}40`,
    border: `2px solid ${theme.palette.secondary.main}`,
  },
  '&:active': {
    transform: 'scale(0.95)',
  }
}));

function Navbar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const user = JSON.parse(localStorage.getItem('user'));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    localStorage.removeItem('user');
    localStorage.removeItem('transactions');
    navigate('/');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box 
            onClick={() => navigate('/dashboard')}
            sx={{ 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                opacity: 0.8
              },
              transition: 'opacity 0.3s ease'
            }}
          >
            <Logo size="medium" />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user && (
              <>
                <CustomButton 
                  color="primary" 
                  onClick={() => navigate('/transactions')}
                  navButton
                >
                  Transactions
                </CustomButton>
                <CustomButton 
                  color="primary" 
                  onClick={() => navigate('/bills')}
                  navButton
                >
                  Bills
                </CustomButton>
                
                <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
                  <IconButton onClick={toggleDarkMode} color="primary">
                    {darkMode ? <Brightness7 /> : <Brightness4 />}
                  </IconButton>
                </Tooltip>

                <Tooltip title="Account settings">
                  <StyledAvatar
                    onClick={handleProfileClick}
                    aria-controls={open ? 'profile-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    {getInitials(user.name)}
                  </StyledAvatar>
                </Tooltip>
              </>
            )}
          </Box>

          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 4px 20px rgba(255,255,255,0.1)'
                  : '0 4px 20px rgba(0,0,0,0.1)',
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              My Profile
            </MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
              <ListItemIcon>
                <Security fontSize="small" />
              </ListItemIcon>
              Security
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;