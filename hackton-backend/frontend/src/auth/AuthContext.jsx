import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('policySetuUser');
    if (savedUser) {
      try {
        // #region agent log
        fetch('http://127.0.0.1:7765/ingest/4fd65ffe-9803-4ddd-ac36-eb151af07c65', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '9a3e5c' }, body: JSON.stringify({ sessionId: '9a3e5c', runId: 'pre-fix', hypothesisId: 'H1', location: 'auth/AuthContext.jsx:loadUser', message: 'Loaded saved user from localStorage', data: { hasSavedUser: true }, timestamp: Date.now() }) }).catch(() => { });
        // #endregion
        setUser(JSON.parse(savedUser));
      } catch {
        // #region agent log
        fetch('http://127.0.0.1:7765/ingest/4fd65ffe-9803-4ddd-ac36-eb151af07c65', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '9a3e5c' }, body: JSON.stringify({ sessionId: '9a3e5c', runId: 'pre-fix', hypothesisId: 'H1', location: 'auth/AuthContext.jsx:loadUser', message: 'Failed to parse saved user JSON', data: { hasSavedUser: true }, timestamp: Date.now() }) }).catch(() => { });
        // #endregion
        setUser(null);
      }
    } else {
      // #region agent log
      fetch('http://127.0.0.1:7765/ingest/4fd65ffe-9803-4ddd-ac36-eb151af07c65', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '9a3e5c' }, body: JSON.stringify({ sessionId: '9a3e5c', runId: 'pre-fix', hypothesisId: 'H1', location: 'auth/AuthContext.jsx:loadUser', message: 'No saved user in localStorage', data: { hasSavedUser: false }, timestamp: Date.now() }) }).catch(() => { });
      // #endregion
    }

    // #region agent log
    fetch('http://127.0.0.1:7765/ingest/4fd65ffe-9803-4ddd-ac36-eb151af07c65', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '9a3e5c' }, body: JSON.stringify({ sessionId: '9a3e5c', runId: 'post-fix', hypothesisId: 'H6', location: 'auth/AuthContext.jsx:ready', message: 'AuthContext finished initialization', data: { hadSavedUser: !!savedUser }, timestamp: Date.now() }) }).catch(() => { });
    // #endregion
    setIsReady(true);
  }, []);

  const login = (userData) => {
    // #region agent log
    fetch('http://127.0.0.1:7765/ingest/4fd65ffe-9803-4ddd-ac36-eb151af07c65', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '9a3e5c' }, body: JSON.stringify({ sessionId: '9a3e5c', runId: 'pre-fix', hypothesisId: 'H2', location: 'auth/AuthContext.jsx:login', message: 'AuthContext.login called', data: { hasUserData: !!userData, hasIdentifier: !!userData?.identifier }, timestamp: Date.now() }) }).catch(() => { });
    // #endregion
    localStorage.setItem('policySetuUser', JSON.stringify(userData));
    setUser(userData);
    setIsReady(true);
  };

  const logout = () => {
    // #region agent log
    fetch('http://127.0.0.1:7765/ingest/4fd65ffe-9803-4ddd-ac36-eb151af07c65', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '9a3e5c' }, body: JSON.stringify({ sessionId: '9a3e5c', runId: 'pre-fix', hypothesisId: 'H2', location: 'auth/AuthContext.jsx:logout', message: 'AuthContext.logout called', data: {}, timestamp: Date.now() }) }).catch(() => { });
    // #endregion
    localStorage.removeItem('policySetuUser');
    setUser(null);
    setIsReady(true);
  };

  const value = {
    user,
    isReady,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

