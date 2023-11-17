// LogoutButton.js
import React from 'react';
import { useAuth } from './AuthContext';
import { Button } from '@mui/material';

const LogoutButton = () => {
  const { logout } = useAuth();
  const handleLogout = async () => {
    try {
      logout()
    } catch (error) {
    }
  };

  return (
    <Button onClick={handleLogout} >Logout</Button>
  );
};

export default LogoutButton;
