import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  }
  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={RouterLink} to="/">Home</Button>
          {/* <Button color="inherit" component={RouterLink} to="/search">Search</Button> */}
        {isLoggedIn
          ? (
            <>
              <Button color="inherit" component={RouterLink} to="/hosted-listings">My Hosted Listings</Button>
              <Button color="inherit" component={RouterLink} to="/all-listings">All Listings</Button>
            </>

            )
          : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">Login</Button>
              <Button color="inherit" component={RouterLink} to="/register">Register</Button>
            </>

            )}
      </Box>
        {isLoggedIn && <Button color="inherit" onClick={handleLogout}>Logout</Button>}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
