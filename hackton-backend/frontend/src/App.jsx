import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';
import PolicePage from './pages/PolicePage';
import InsurancePage from './pages/InsurancePage';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

function App() {
  const location = useLocation();

  const isDomainRAG = location.pathname === '/police' || location.pathname === '/insurance';

  const MainApp = () => (
    <DashboardPage />
  );

  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className={`min-h-screen ${isDomainRAG ? 'flex' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'}`}>
          {isDomainRAG && <Sidebar />}

          <div className={isDomainRAG ? "flex-1 ml-64 bg-gray-50 min-h-screen" : "w-full"}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/police" element={<PolicePage />} />
              <Route path="/insurance" element={<InsurancePage />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

