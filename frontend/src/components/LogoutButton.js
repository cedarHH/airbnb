// LogoutButton.js
import React from 'react';
import { useAuth } from './AuthContext';

const LogoutButton = () => {
  const { logout } = useAuth();
  const handleLogout = async () => {
    try {
      logout()
    } catch (error) {
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;
