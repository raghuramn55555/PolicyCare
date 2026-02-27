import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PolicyChatbot from './PolicyChatbot';

function PolicyDetails({ policy, onBack, userProfile }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEli5, setIsEli5] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'eligibility', label: 'Eligibility' },
    { id: 'documents', label: 'Documents' },
    { id: 'application', label: 'How to Apply' },
  ];

  const toggleVoiceSummary = () => {
    setIsSpeaking(!isSpeaking);
    // Placeholder for actual Speech Synthesis API
    if (!isSpeaking) {
      console.log(`[VOICE] Summarizing ${policy.name}`);
      // In a real app: window.speechSynthesis.speak(new SpeechSynthesisUtterance(policy.description));
    }
  };

  return (
    <motion.div
      className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-gray-100"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-gray-500 hover:text-india-blue transition-all font-bold group"
      >
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50">
          ←
        </div>
        Back to Feed
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-(6)">
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-black text-gray-800 mb-4 leading-tight">
              {policy.name}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-4 py-1.5 bg-india-blue text-white rounded-full text-xs font-black uppercase tracking-widest">
                {policy.type}
              </span>
              <span className="px-4 py-1.5 bg-india-green text-white rounded-full text-xs font-black uppercase tracking-widest">
                {Math.round((policy.matchScore || 0.85) * 100)}% MATCH SCORE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-start">
            <button
              onClick={() => setIsEli5(!isEli5)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all shadow-sm ${isEli5 ? 'bg-orange-500 text-white shadow-orange-200' : 'bg-white border-2 border-gray-100 text-gray-500 hover:border-orange-200'}`}
            >
              👶 {isEli5 ? 'ELI5 ACTIVE' : 'EXPLAIN LIKE I\'M 5'}
            </button>
            <button
              onClick={toggleVoiceSummary}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all shadow-sm ${isSpeaking ? 'bg-indigo-600 text-white animate-pulse shadow-indigo-200' : 'bg-white border-2 border-gray-100 text-gray-500 hover:border-indigo-200'}`}
            >
              🔊 {isSpeaking ? 'STOP AUDIO' : 'VOICE SUMMARY'}
            </button>
          </div>
        </div>
        <p className="text-gray-500 text-lg leading-relaxed mt-6 italic">
          "{isEli5 ? 'This is like a big safety net that catches you if you fall.' : policy.description}"
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto mb-10 bg-gray-50 p-1.5 rounded-2xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab.id
                ? 'bg-white text-india-blue shadow-md'
                : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[300px]"
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                    <div className="text-[10px] font-black text-blue-400 uppercase tracking-tighter mb-1">Min Age</div>
                    <div className="text-xl font-bold text-india-blue">{policy.minAge || 'N/A'}</div>
                  </div>
                  <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100">
                    <div className="text-[10px] font-black text-green-400 uppercase tracking-tighter mb-1">Premium</div>
                    <div className="text-xl font-bold text-india-green">₹{policy.minPremium || '0'}</div>
                  </div>
                  <div className="bg-purple-50/50 p-6 rounded-3xl border border-purple-100">
                    <div className="text-[10px] font-black text-purple-400 uppercase tracking-tighter mb-1">Max Cover</div>
                    <div className="text-xl font-bold text-purple-700">Lakhs</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    🚀 Key Features & Benefits
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {policy.features?.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all">
                        <div className="h-10 w-10 bg-india-green/10 rounded-2xl flex items-center justify-center text-india-green font-bold">
                          ✓
                        </div>
                        <span className="font-bold text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50/30 p-8 rounded-[40px] border-2 border-dashed border-yellow-200 flex flex-col justify-center items-center text-center">
                <div className="text-5xl mb-6">💡</div>
                <h3 className="text-2xl font-black text-gray-800 mb-4">Why is this a match?</h3>
                <p className="text-gray-600 font-medium leading-relaxed italic">
                  {policy.whyRecommended || 'Our Agentic RAG system matched this because it fits your age and income profile perfectly.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'eligibility' && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-white border-2 border-gray-100 p-8 rounded-[40px]">
                <h3 className="text-2xl font-black mb-8">Eligibility Passbook</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-6 bg-gray-50 rounded-3xl">
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase">Age Requirement</p>
                      <p className="font-bold">{policy.ageRange}</p>
                    </div>
                    <div className="bg-india-green text-white px-4 py-2 rounded-full text-xs font-black italic">VERIFIED</div>
                  </div>
                  <div className="flex justify-between items-center p-6 bg-gray-50 rounded-3xl">
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase">Income Cap</p>
                      <p className="font-bold">{policy.premiumRange}</p>
                    </div>
                    <div className="bg-india-green text-white px-4 py-2 rounded-full text-xs font-black italic">VERIFIED</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && <div className="text-gray-400 font-bold p-10 text-center">Standard documents required for {policy.name}...</div>}
          {activeTab === 'application' && (
            <div className="flex gap-4">
              <a
                href={policy.applyLink || '#'}
                target="_blank"
                className="bg-india-blue text-white font-black py-6 px-12 rounded-[30px] shadow-xl shadow-blue-200 hover:scale-105 transition-all text-xl"
              >
                Direct Apply Now →
              </a>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-16 pt-16 border-t-4 border-gray-50 border-dotted">
        <PolicyChatbot policy={policy} userProfile={userProfile} isEli5={isEli5} />
      </div>
    </motion.div>
  );
}

export default PolicyDetails;
