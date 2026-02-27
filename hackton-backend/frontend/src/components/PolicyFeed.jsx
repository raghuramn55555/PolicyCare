import { useState } from 'react';
import PolicyCard from './PolicyCard';
import { motion, AnimatePresence } from 'framer-motion';

function PolicyFeed({ recommendations, nearbyAgents, loading, userProfile, hasSearched }) {
  const [isVideoFirst, setIsVideoFirst] = useState(false);
  const [activeTab, setActiveTab] = useState('government_scheme'); // 'government_scheme' or 'insurance_policy'
  const userLanguage = userProfile?.language || 'en';

  const filteredPolicies = (recommendations || []).filter(p => p && p.type === activeTab);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-50 h-64 rounded-[40px] animate-pulse" />
        ))}
      </div>
    );
  }

  // Show 'no results' message if user searched but got nothing
  if (!recommendations || recommendations.length === 0) {
    if (!hasSearched) return null;
    return (
      <div className="text-center py-16 px-6">
        <div className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100 max-w-md mx-auto">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-black text-gray-700 mb-2">No Policies Found</h3>
          <p className="text-gray-400 text-sm font-bold leading-relaxed">
            No policies are present based on the provided details. Try adjusting your age, income, or occupation to see more results.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      {/* Controls & Tabs */}
      <div className="bg-white p-2 rounded-[32px] border border-gray-100 shadow-sm">
        {/* Tab Switcher */}
        <div className="flex p-1 bg-gray-50 rounded-[28px] mb-6">
          <button
            onClick={() => setActiveTab('government_scheme')}
            className={`flex-1 py-4 rounded-[24px] text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'government_scheme'
              ? 'bg-india-green text-white shadow-lg'
              : 'text-gray-400 hover:text-gray-600'
              }`}
            style={{ backgroundColor: activeTab === 'government_scheme' ? '#138808' : 'transparent' }}
          >
            {userLanguage === 'te' ? 'ప్రభుత్వ పథకాలు' : 'Govt Schemes'}
          </button>
          <button
            onClick={() => setActiveTab('insurance_policy')}
            className={`flex-1 py-4 rounded-[24px] text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'insurance_policy'
              ? 'bg-india-blue text-white shadow-lg'
              : 'text-gray-400 hover:text-gray-600'
              }`}
            style={{ backgroundColor: activeTab === 'insurance_policy' ? '#0F4C75' : 'transparent' }}
          >
            {userLanguage === 'te' ? 'భీమా పాలసీలు' : 'Insurance'}
          </button>
        </div>

        <div className="flex justify-between items-center px-4 pb-4">
          <div>
            <h2 className="text-xl font-black text-india-blue tracking-tighter" style={{ color: activeTab === 'government_scheme' ? '#138808' : '#0F4C75' }}>
              {activeTab === 'government_scheme'
                ? (userLanguage === 'te' ? 'మీ అర్హతను తనిఖీ చేయండి' : 'Check Eligibility')
                : (userLanguage === 'te' ? 'ముఖ్యమైన బీమా ప్లాన్లు' : 'Buy & Apply')}
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              {activeTab === 'government_scheme' ? 'Welfare & Benefits' : 'Financial Protection'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsVideoFirst(!isVideoFirst)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isVideoFirst ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' : 'bg-gray-100 text-gray-500'
                }`}
            >
              {isVideoFirst ? '🎥 Video-First ON' : '📺 Switch to Video-First'}
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="grid grid-cols-1 gap-8">
        <AnimatePresence mode="wait">
          {filteredPolicies.length > 0 ? (
            filteredPolicies.map((policy, idx) => (
              <motion.div
                key={policy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.05 }}
              >
                <PolicyCard
                  policy={policy}
                  userLanguage={userLanguage}
                  isVideoFirst={isVideoFirst}
                />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 opacity-50">
              <p className="font-bold text-gray-400">No recommendations found in this category.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Agent Section */}
      {nearbyAgents?.length > 0 && (
        <div className="mt-16">
          <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest mb-8 text-center">Nearby Agents speaking {userLanguage === 'te' ? 'Telugu' : 'your language'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nearbyAgents.map(agent => (
              <div key={agent.id} className="bg-india-blue/5 p-8 rounded-[40px] border border-india-blue/10 flex items-center justify-between group hover:bg-india-blue transition-all" style={{ borderLeft: '8px solid #0F4C75' }}>
                <div>
                  <h4 className="font-black text-lg text-india-blue tracking-tighter group-hover:text-white" style={{ color: '#0F4C75' }}>{agent.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400 group-hover:text-white/60 uppercase tracking-widest">{agent.location} • {Array.isArray(agent.languages) ? agent.languages.join(', ') : (agent.languages || '')}</p>
                </div>
                <button className="bg-white text-india-blue px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm" style={{ color: '#0F4C75' }}>
                  Contact
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PolicyFeed;
