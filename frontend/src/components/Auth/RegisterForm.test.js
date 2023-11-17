import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import RegisterForm from './RegisterForm';
import { BrowserRouter } from 'react-router-dom';
import authService from './authService';

jest.mock('./authService'); 

describe('RegisterForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders email, password, and name input fields and a register button', () => {
    render(<BrowserRouter><RegisterForm /></BrowserRouter>);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('allows entering email, password, and name', () => {
    render(<BrowserRouter><RegisterForm /></BrowserRouter>);
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    expect(screen.getByLabelText(/email address/i).value).toBe('test@example.com');
    expect(screen.getByLabelText(/password/i).value).toBe('password123');
    expect(screen.getByLabelText(/name/i).value).toBe('John Doe');
  });

});
