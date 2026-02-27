import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import UserProfileForm from './components/UserProfileForm';
import PolicyFeed from './components/PolicyFeed';
import PolicyDetails from './components/PolicyDetails';
import Header from './components/Header';
import Login from './components/Login';
import axios from 'axios';
import FloatingChatbot from './components/FloatingChatbot';
import ErrorBoundary from './components/ErrorBoundary';
import PopularSection from './components/PopularSection';
import PolicePage from './pages/PolicePage';
import InsurancePage from './pages/InsurancePage';
import Sidebar from './components/Sidebar';

function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [nearbyAgents, setNearbyAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [user, setUser] = useState(null); // Auth state
  const location = useLocation();

  const isDomainRAG = location.pathname === '/police' || location.pathname === '/insurance';

  // Check for existing session
  useEffect(() => {
    const savedUser = localStorage.getItem('policySetuUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('policySetuUser');
    setUser(null);
    setRecommendations([]);
    setNearbyAgents([]);
  };

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('policySetuUser', JSON.stringify(userData));
    setUser(userData);
  };

  const handleGetRecommendations = async (profile) => {
    setLoading(true);
    setUserProfile(profile);
    setSelectedPolicy(null);
    setHasSearched(true);

    try {
      const response = await axios.post('http://localhost:5000/recommend', profile);

      if (response.data.success) {
        setRecommendations(response.data.recommendations || []);
        setNearbyAgents(response.data.nearbyAgents || []);
      } else {
        console.error('Error:', response.data.error);
        setRecommendations([]);
        setNearbyAgents([]);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      setRecommendations([]);
      setNearbyAgents([]);
    } finally {
      setLoading(false);
    }
  };

  const MainApp = () => (
    <>
      <Header user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          <Login onLoginSuccess={handleLoginSuccess} />
        ) : selectedPolicy ? (
          <PolicyDetails
            policy={selectedPolicy}
            onBack={() => setSelectedPolicy(null)}
            userProfile={userProfile}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="lg:col-span-1">
              <div className="sticky top-8">
                <UserProfileForm
                  onSubmit={handleGetRecommendations}
                  loading={loading}
                  initialProfile={user}
                />
              </div>
            </aside>

            <section className="lg:col-span-3">
              {recommendations.length === 0 && !loading && !hasSearched && (
                <div className="mb-10">
                  <PopularSection
                    language={userProfile?.language || 'en'}
                    onPolicyClick={setSelectedPolicy}
                  />
                </div>
              )}

              <PolicyFeed
                recommendations={recommendations}
                nearbyAgents={nearbyAgents}
                loading={loading}
                onPolicyClick={setSelectedPolicy}
                userProfile={userProfile}
                hasSearched={hasSearched}
              />
            </section>
          </div>
        )}
      </main>

      <footer className="bg-india-blue text-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg font-semibold mb-2">PolicySetu</p>
          <p className="text-blue-200 text-sm">
            Your Gateway to Policies, Schemes & Financial Security
          </p>
          <p className="text-blue-300 text-xs mt-4">
            Powered by Agentic RAG • Digital India Initiative
          </p>
        </div>
      </footer>

      <FloatingChatbot userProfile={user} />
    </>
  );

  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${isDomainRAG ? 'flex' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'}`}>
        {isDomainRAG && <Sidebar />}

        <div className={isDomainRAG ? "flex-1 ml-64 bg-gray-50 min-h-screen" : "w-full"}>
          <Routes>
            <Route path="/" element={<MainApp />} />
            <Route path="/police" element={<PolicePage />} />
            <Route path="/insurance" element={<InsurancePage />} />
          </Routes>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;

