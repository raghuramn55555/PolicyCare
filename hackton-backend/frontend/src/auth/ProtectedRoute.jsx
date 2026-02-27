import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isReady } = useAuth();
  const location = useLocation();

  if (!isReady) {
    // #region agent log
    fetch('http://127.0.0.1:7765/ingest/4fd65ffe-9803-4ddd-ac36-eb151af07c65', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '9a3e5c' }, body: JSON.stringify({ sessionId: '9a3e5c', runId: 'post-fix', hypothesisId: 'H6', location: 'auth/ProtectedRoute.jsx:wait', message: 'ProtectedRoute waiting for auth initialization', data: { pathname: location?.pathname || null }, timestamp: Date.now() }) }).catch(() => { });
    // #endregion
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-slate-500">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    // #region agent log
    fetch('http://127.0.0.1:7765/ingest/4fd65ffe-9803-4ddd-ac36-eb151af07c65', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '9a3e5c' }, body: JSON.stringify({ sessionId: '9a3e5c', runId: 'pre-fix', hypothesisId: 'H3', location: 'auth/ProtectedRoute.jsx:redirect', message: 'ProtectedRoute redirecting to /login', data: { fromPathname: location?.pathname || null }, timestamp: Date.now() }) }).catch(() => { });
    // #endregion
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // #region agent log
  fetch('http://127.0.0.1:7765/ingest/4fd65ffe-9803-4ddd-ac36-eb151af07c65', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '9a3e5c' }, body: JSON.stringify({ sessionId: '9a3e5c', runId: 'pre-fix', hypothesisId: 'H3', location: 'auth/ProtectedRoute.jsx:allow', message: 'ProtectedRoute allowing access', data: { pathname: location?.pathname || null }, timestamp: Date.now() }) }).catch(() => { });
  // #endregion
  return children;
}

export default ProtectedRoute;

