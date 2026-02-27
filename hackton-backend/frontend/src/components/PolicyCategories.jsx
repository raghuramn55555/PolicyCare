import { useState } from 'react';
import { motion } from 'framer-motion';
import PolicyCard from './PolicyCard';

function PolicyCategories({ recommendations, loading, onPolicyClick, userProfile }) {
  const [activeCategory, setActiveCategory] = useState('all');

  // Separate policies into Government and Private
  const governmentPolicies = recommendations.filter(p => 
    p.type?.toLowerCase().includes('government') || 
    p.provider === 'Government' ||
    p.name?.toLowerCase().includes('government')
  );

  const privatePolicies = recommendations.filter(p => 
    !governmentPolicies.includes(p)
  );

  const displayPolicies = activeCategory === 'government' 
    ? governmentPolicies 
    : activeCategory === 'private' 
    ? privatePolicies 
    : recommendations;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-india-blue mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Finding the best policies for you...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="text-center py-16 px-4">
        <div className="text-6xl mb-4">🎯</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Get Started</h2>
        <p className="text-gray-600 text-lg mb-8">
          Enter your profile details to discover personalized policies and schemes
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl mb-2">🤖</div>
            <div className="font-semibold">AI-Driven Matching</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-3xl mb-2">📊</div>
            <div className="font-semibold">Eligibility Scoring</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="text-3xl mb-2">🎯</div>
            <div className="font-semibold">Personalized Results</div>
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">No Policies Found</h2>
        <p className="text-gray-600 text-lg">
          Try adjusting your profile to find suitable policies
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex gap-4 border-b-2 border-gray-200">
        <motion.button
          onClick={() => setActiveCategory('all')}
          className={`px-6 py-3 font-semibold transition ${
            activeCategory === 'all'
              ? 'text-india-blue border-b-4 border-india-blue'
              : 'text-gray-600 hover:text-india-blue'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          All Policies ({recommendations.length})
        </motion.button>
        <motion.button
          onClick={() => setActiveCategory('government')}
          className={`px-6 py-3 font-semibold transition ${
            activeCategory === 'government'
              ? 'text-india-blue border-b-4 border-india-blue'
              : 'text-gray-600 hover:text-india-blue'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Government Schemes ({governmentPolicies.length})
        </motion.button>
        <motion.button
          onClick={() => setActiveCategory('private')}
          className={`px-6 py-3 font-semibold transition ${
            activeCategory === 'private'
              ? 'text-india-blue border-b-4 border-india-blue'
              : 'text-gray-600 hover:text-india-blue'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Private Policies ({privatePolicies.length})
        </motion.button>
      </div>

      {/* Policy Cards Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {displayPolicies.map((policy, index) => (
          <motion.div
            key={policy.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PolicyCard
              policy={policy}
              rank={policy.rank || index + 1}
              onClick={() => onPolicyClick(policy)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default PolicyCategories;

