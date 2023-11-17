// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from './authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', email);
      setIsLoggedIn(true);
    } catch (error) {
      alert('Login error: ' + error.response.data.error);
      console.log(error.response)
    }
  };

  const logout = async () => {
    await authService.logout(localStorage.getItem('token'));
    localStorage.removeItem('token');
    setUserEmail(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
