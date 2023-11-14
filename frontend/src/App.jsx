import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import { AuthProvider } from './components/Auth/AuthContext';
import Navbar from './components/Navbar';

function App () {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            {/* /hosted-listings" "/all-listings" */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
