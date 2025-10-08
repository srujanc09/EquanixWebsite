import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// API base URL - change this to your backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// API utility functions
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('equanix_access_token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...options
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on app start
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem('equanix_access_token');
      const refreshToken = localStorage.getItem('equanix_refresh_token');

      if (accessToken) {
        try {
          // Try to get current user with stored token
          const response = await apiCall('/auth/me');
          setUser(response.data.user);
        } catch (error) {
          console.error('Failed to get user with stored token:', error);
          
          // If access token is invalid, try refresh token
          if (refreshToken) {
            try {
              await refreshTokens();
            } catch (refreshError) {
              console.error('Failed to refresh token:', refreshError);
              // Clear invalid tokens
              localStorage.removeItem('equanix_access_token');
              localStorage.removeItem('equanix_refresh_token');
            }
          } else {
            // No refresh token, clear access token
            localStorage.removeItem('equanix_access_token');
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const refreshTokens = async () => {
    const refreshToken = localStorage.getItem('equanix_refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await apiCall('/auth/refresh', {
        method: 'POST',
        body: { refreshToken }
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;
      
      // Store new tokens
      localStorage.setItem('equanix_access_token', accessToken);
      localStorage.setItem('equanix_refresh_token', newRefreshToken);

      // Get updated user data
      const userResponse = await apiCall('/auth/me');
      setUser(userResponse.data.user);

      return response;
    } catch (error) {
      // Clear invalid tokens
      localStorage.removeItem('equanix_access_token');
      localStorage.removeItem('equanix_refresh_token');
      setUser(null);
      throw error;
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: { email, password }
      });

      const { user: userData, tokens } = response.data;
      
      // Store tokens
      localStorage.setItem('equanix_access_token', tokens.accessToken);
      localStorage.setItem('equanix_refresh_token', tokens.refreshToken);
      
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    setLoading(true);
    try {
      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: { email, password, name }
      });

      const { user: userData, tokens } = response.data;
      
      // Store tokens
      localStorage.setItem('equanix_access_token', tokens.accessToken);
      localStorage.setItem('equanix_refresh_token', tokens.refreshToken);
      
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('equanix_refresh_token');
      
      if (refreshToken) {
        await apiCall('/auth/logout', {
          method: 'POST',
          body: { refreshToken }
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear local state and tokens
      setUser(null);
      localStorage.removeItem('equanix_access_token');
      localStorage.removeItem('equanix_refresh_token');
    }
  };

  const updateProfile = async (updates) => {
    try {
      const response = await apiCall('/users/profile', {
        method: 'PUT',
        body: updates
      });

      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updatePreferences = async (preferences) => {
    try {
      const response = await apiCall('/users/preferences', {
        method: 'PUT',
        body: preferences
      });

      // Update user with new preferences
      setUser(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          preferences: response.data.preferences
        }
      }));

      return { success: true, preferences: response.data.preferences };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    updatePreferences,
    refreshTokens,
    isAuthenticated: !!user,
    // Utility for making authenticated API calls
    apiCall
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}