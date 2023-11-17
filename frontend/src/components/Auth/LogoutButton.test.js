import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import LogoutButton from './LogoutButton';
import { AuthContext } from './AuthContext';

describe('LogoutButton Component', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderLogoutButton = () => {
    return render(
      <AuthContext.Provider value={{ logout: mockLogout }}>
        <LogoutButton />
      </AuthContext.Provider>
    );
  };

  test('renders logout button', () => {
    const { getByRole } = renderLogoutButton();
    expect(getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  test('calls logout function when button is clicked', () => {
    const { getByRole } = renderLogoutButton();
    fireEvent.click(getByRole('button', { name: /logout/i }));
    expect(mockLogout).toHaveBeenCalled();
  });
});
