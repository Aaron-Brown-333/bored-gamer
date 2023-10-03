import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { auth } from './utils/Firebase';
import Login from './Login';
import Index from './Home/Index';
import Lobby from './Home/Lobby';
import AuthenticatedLayout from './Layouts/AuthenticatedLayout';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={isAuthenticated ? <ProtectedRoute /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

const ProtectedRoute = () => (
  <AuthenticatedLayout>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/Lobby/:RoomCode" element={<Lobby />} />
    </Routes>
  </AuthenticatedLayout>
);

export default App;
