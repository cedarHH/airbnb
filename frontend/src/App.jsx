// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import { AuthProvider } from './components/Auth/AuthContext';
import Navbar from './components/Navbar';
import AllListing from './components/Listing/AllListing';
import HostedListing from './components/Listing/HostedListing';
import EditListing from './components/Listing/EditListing';
import CreateListing from './components/Listing/CreateListing';
import HomeListing from './components/Listing/HomeListing';
import DetailView from './components/Listing/Detail';
import HostedDetail from './components/Listing/HostedDetail';

function App () {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomeListing />} />
            <Route path="/detail/:id" element={<DetailView />} />
            <Route path="/hosted-detail/:id" element={<HostedDetail />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/all-listings" element={<AllListing />} />
            <Route path="/hosted-listings" element={<HostedListing />} />
            <Route path="/create-listings" element={<CreateListing />} />
            <Route path="/edit-listings/:id" element={<EditListing />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
