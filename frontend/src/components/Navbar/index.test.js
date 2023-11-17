import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './index';
import { AuthProvider } from '../Auth/AuthContext';

const renderNavbar = (isLoggedIn) => {
  const logoutMock = jest.fn();
  return render(
    <BrowserRouter>
      <AuthProvider value={{ isLoggedIn, logout: logoutMock }}>
        <Navbar />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Navbar Component', () => {
  test('renders login and register buttons when not logged in', () => {
    renderNavbar(false);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });
});
