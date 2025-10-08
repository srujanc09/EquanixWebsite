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

  // Ensure a method is always set (fetch defaults to GET but make it explicit)
  config.method = (config.method || 'GET').toUpperCase();

  // Allow cross-origin requests if the backend is on a different host/port
  // (safe to set - backend still needs to allow CORS)
  if (!config.mode) config.mode = 'cors';

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    console.debug('API call:', config.method, url, config.body ? '(body)' : '');
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    // Provide a clearer message for common network failures
    console.error('API call failed:', error, { url, config });

    // If the fetch failed due to network, try once more using a relative URL (in case backend is proxied)
    if (error && error.message && error.message.toLowerCase().includes('failed to fetch')) {
      const relativeUrl = endpoint; // try without API_BASE_URL
      try {
        console.debug('Retrying API call with relative URL:', relativeUrl);
        const retryResponse = await fetch(relativeUrl, config);
        const retryData = await retryResponse.json();
        if (!retryResponse.ok) {
          throw new Error(retryData.message || `HTTP error! status: ${retryResponse.status}`);
        }
        return retryData;
      } catch (retryError) {
        const hint = `Network request failed for ${url} and relative ${relativeUrl}. Is the backend running and reachable? Check CORS and REACT_APP_API_URL.`;
        const augmented = new Error(`${error.message} — ${hint}`);
        augmented.original = retryError;
        throw augmented;
      }
    }

    throw error;
  }
};

// --- Local in-browser auth fallback (for dev/demo when no backend/Supabase) ---
const LOCAL_USERS_KEY = 'equanix_local_users';
const LOCAL_SESSION_KEY = 'equanix_local_session';

function _hash(pw) {
  try { return btoa(pw); } catch { return pw; }
}

function _loadLocalUsers() {
  return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '{}');
}

function _saveLocalUsers(users) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

async function localCreateUser(email, password, name) {
  const users = _loadLocalUsers();
  if (users[email]) throw new Error('User already exists');
  const user = { id: `local_${Date.now()}`, email, name: name || '', createdAt: new Date().toISOString() };
  users[email] = { ...user, password: _hash(password) };
  _saveLocalUsers(users);
  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({ email, createdAt: new Date().toISOString() }));
  return user;
}

async function localAuthenticate(email, password) {
  const users = _loadLocalUsers();
  const stored = users[email];
  if (!stored) throw new Error('No user found');
  if (stored.password !== _hash(password)) throw new Error('Invalid credentials');
  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({ email, createdAt: new Date().toISOString() }));
  const { password: _p, ...user } = stored;
  return user;
}

async function localRestoreSession() {
  const session = localStorage.getItem(LOCAL_SESSION_KEY);
  if (!session) return null;
  try {
    const s = JSON.parse(session);
    const users = _loadLocalUsers();
    const stored = users[s.email];
    if (!stored) return null;
    const { password: _p, ...user } = stored;
    return user;
  } catch (err) {
    return null;
  }
}

async function localSignOut() {
  localStorage.removeItem(LOCAL_SESSION_KEY);
}

async function localUpdateProfile(updates) {
  const session = localStorage.getItem(LOCAL_SESSION_KEY);
  if (!session) throw new Error('No local session');
  const s = JSON.parse(session);
  const users = _loadLocalUsers();
  const stored = users[s.email];
  if (!stored) throw new Error('No local user');
  const updated = { ...stored, ...updates };
  users[s.email] = updated;
  _saveLocalUsers(users);
  const { password: _p, ...user } = updated;
  return user;
}


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on app start
  useEffect(() => {
    const initAuth = async () => {
      // Try local session first
      try {
        const localUser = await localRestoreSession();
        if (localUser) {
          setUser(localUser);
        } else {
          // fallback: try previous API token flow
          const accessToken = localStorage.getItem('equanix_access_token');
          const refreshToken = localStorage.getItem('equanix_refresh_token');

          if (accessToken) {
            try {
              const response = await apiCall('/auth/me');
              setUser(response.data.user);
            } catch (error) {
              console.error('Failed to get user with stored token:', error);
              if (refreshToken) {
                try {
                  await refreshTokens();
                } catch (refreshError) {
                  console.error('Failed to refresh token:', refreshError);
                  localStorage.removeItem('equanix_access_token');
                  localStorage.removeItem('equanix_refresh_token');
                }
              } else {
                localStorage.removeItem('equanix_access_token');
              }
            }
          }
        }
      } catch (err) {
        console.error('Local session restore failed:', err);
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
      // Use API-based auth, or local auth if API fails
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
      } catch (err) {
        // Try local fallback
        try {
          const localUser = await localAuthenticate(email, password);
          setUser(localUser);
          return { success: true, user: localUser };
        } catch (localErr) {
          return { success: false, error: err.message || localErr.message };
        }
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    setLoading(true);
    try {
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
      } catch (err) {
        // Try local fallback
        try {
          const localUser = await localCreateUser(email, password, name);
          setUser(localUser);
          return { success: true, user: localUser };
        } catch (localErr) {
          return { success: false, error: err.message || localErr.message };
        }
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      try {
        const refreshToken = localStorage.getItem('equanix_refresh_token');
        if (refreshToken) {
          await apiCall('/auth/logout', {
            method: 'POST',
            body: { refreshToken }
          });
        } else {
          // If API logout not available, sign out local session
          await localSignOut();
        }
      } catch (err) {
        // API failed — ensure local signout
        await localSignOut();
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
      try {
        const response = await apiCall('/users/profile', {
          method: 'PUT',
          body: updates
        });

        setUser(response.data.user);
        return { success: true, user: response.data.user };
      } catch (err) {
        // Fallback to local profile update
        try {
          const localUser = await localUpdateProfile(updates);
          setUser(localUser);
          return { success: true, user: localUser };
        } catch (localErr) {
          return { success: false, error: err.message || localErr.message };
        }
      }
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