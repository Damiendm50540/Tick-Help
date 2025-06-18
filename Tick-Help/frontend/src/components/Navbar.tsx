import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const userInitials = currentUser
    ? `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`
    : '';

  return (
    <AppBar position="fixed" elevation={3} sx={{ background: 'linear-gradient(90deg, #4f8cff 0%, #6f6fff 100%)', boxShadow: 3 }}>
      <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto', minHeight: 64 }}>
        <Typography
          variant="h5"
          component={Link}
          to="/tickets"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'white', fontWeight: 700, letterSpacing: 1 }}
        >
          Tick'Help
        </Typography>
        {currentUser ? (
          <div>
            <IconButton
              size="large"
              aria-label="compte de l'utilisateur connecté"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              sx={{ p: 0 }}
            >
              <Avatar sx={{ width: 36, height: 36, bgcolor: '#fff', color: '#4f8cff', fontWeight: 700, border: '2px solid #4f8cff' }}>
                {userInitials}
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
                Mon Profil
              </MenuItem>
              {currentUser.role === 'admin' && (
                <MenuItem onClick={() => { handleClose(); navigate('/admin'); }}>
                  Administration
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout}>Se déconnecter</MenuItem>
            </Menu>
          </div>
        ) : (
          <div>
            <Button color="inherit" component={Link} to="/" sx={{ color: 'white', fontWeight: 500 }}>
              Connexion
            </Button>
            <Button color="inherit" component={Link} to="/register" sx={{ color: 'white', fontWeight: 500 }}>
              Inscription
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;