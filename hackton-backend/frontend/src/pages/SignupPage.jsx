import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Login from '../components/Login';
import { useAuth } from '../auth/AuthContext';

function SignupPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7765/ingest/4fd65ffe-9803-4ddd-ac36-eb151af07c65', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '9a3e5c' }, body: JSON.stringify({ sessionId: '9a3e5c', runId: 'pre-fix', hypothesisId: 'H5', location: 'pages/SignupPage.jsx:effect', message: 'SignupPage mounted/updated', data: { hasUser: !!user, fromPathname: location.state?.from?.pathname || null }, timestamp: Date.now() }) }).catch(() => { });
    // #endregion
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSignupSuccess = (userData) => {
    // #region agent log
    fetch('http://127.0.0.1:7765/ingest/4fd65ffe-9803-4ddd-ac36-eb151af07c65', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '9a3e5c' }, body: JSON.stringify({ sessionId: '9a3e5c', runId: 'pre-fix', hypothesisId: 'H5', location: 'pages/SignupPage.jsx:handleSignupSuccess', message: 'Signup success handler called', data: { hasUserData: !!userData, hasIdentifier: !!userData?.identifier }, timestamp: Date.now() }) }).catch(() => { });
    // #endregion
    login(userData);
    const from = location.state?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <Login onLoginSuccess={handleSignupSuccess} initialMode="signup" />
    </div>
  );
}

export default SignupPage;

