import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import LogoutButton from '../Auth/LogoutButton';

const Navbar = () => {
  const { isLoggedIn } = useAuth();

  return (
    <nav>
      { isLoggedIn
        ? (
        <>
          <Link to="/hosted-listings">My Hosted Listings</Link>
          <Link to="/all-listings">All Listings</Link>
          <LogoutButton />
        </>
          )
        : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
          )}
    </nav>
  );
};

export default Navbar;
