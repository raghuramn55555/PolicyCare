import Header from '../components/Header';
import UserProfileForm from '../components/UserProfileForm';
import PolicyDetails from '../components/PolicyDetails';
import PolicyFeed from '../components/PolicyFeed';
import PopularSection from '../components/PopularSection';
import FloatingChatbot from '../components/FloatingChatbot';
import { useAuth } from '../auth/AuthContext';
import { useState } from 'react';
import axios from 'axios';

function DashboardPage() {
  const { user, logout } = useAuth();

  const [recommendations, setRecommendations] = useState([]);
  const [nearbyAgents, setNearbyAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

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

  return (
    <>
      <Header user={user} onLogout={logout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          <div className="text-center py-20 text-slate-600">
            <p className="font-semibold">
              You are not logged in. Please login again to continue.
            </p>
          </div>
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
}

export default DashboardPage;

