import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, fallback = null }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="protected-route-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="protected-route-fallback">
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>Please log in to access this page.</p>
          <p>You'll be redirected to the login page shortly...</p>
        </div>
      </div>
    );
  }

  return children;
}