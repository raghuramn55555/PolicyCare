import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function AudioPlayer({ src, label }) {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <button
      onClick={() => setIsPlaying(!isPlaying)}
      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all border border-blue-100"
    >
      {isPlaying ? '⏸️ Playing' : '🔊 Listen'} {label}
    </button>
  );
}

function VideoPlayer({ src, label, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center p-4"
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-white text-4xl">×</button>
      <div className="w-full max-w-4xl aspect-video bg-gray-800 rounded-[32px] overflow-hidden shadow-2xl border-4 border-white/10">
        <div className="w-full h-full flex items-center justify-center text-white/20 font-black italic">
          [ VIDEO PLAYER: {src || 'demo.mp4'} ]
        </div>
      </div>
      <p className="text-white mt-6 font-black uppercase tracking-widest text-xs">{label}</p>
    </motion.div>
  );
}

function PolicyCard({ policy, userLanguage = 'en', isVideoFirst = false }) {
  const [showVideo, setShowVideo] = useState(false);

  if (!policy) return null;

  // Helper to get localized text safely
  const getLoc = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj?.[userLanguage] || obj?.['en'] || '';
  };

  const name = getLoc(policy.name);
  const description = getLoc(policy.description);

  // Specific fields based on type
  const isScheme = policy.type === 'government_scheme';
  const benefits = isScheme ? getLoc(policy.benefits) : getLoc(policy.coverage_summary);
  const eligibility = isScheme ? getLoc(policy.eligibility) : getLoc(policy.ideal_for);
  const ctaText = isScheme
    ? (userLanguage === 'te' ? 'అర్హతను తనిఖీ చేయండి' : 'Check Eligibility')
    : (getLoc(policy.cta) || 'View Details');

  const policyCategory = getLoc(policy.category) || getLoc(policy.policy_type) || 'General';

  const themeColor = isScheme ? '#138808' : '#0F4C75'; // Green vs Blue
  const badgeText = isScheme ? (userLanguage === 'te' ? 'ప్రభుత్వ పథకం' : 'Govt Scheme') : (userLanguage === 'te' ? 'భీమా' : 'Insurance');

  if (isVideoFirst) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-[40px] overflow-hidden shadow-xl border-4 border-opacity-10 mb-8"
        style={{ borderColor: themeColor }}
      >
        <div className="aspect-video bg-gray-100 relative group cursor-pointer" onClick={() => setShowVideo(true)}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-all" style={{ backgroundColor: themeColor }}>
              <span className="text-3xl ml-1">▶</span>
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6 bg-black/40 backdrop-blur-md p-4 rounded-2xl">
            <h3 className="text-white font-black text-xl tracking-tighter">{name}</h3>
            <p className="text-white/80 text-[10px] uppercase font-bold tracking-widest mt-1 line-clamp-2">{description}</p>
          </div>
        </div>
        {showVideo && <VideoPlayer src={policy.video} label={name} onClose={() => setShowVideo(false)} />}
      </motion.div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 mb-6 hover:shadow-md transition-all relative overflow-hidden">
      {/* Type Badge */}
      <div className="absolute top-0 right-0 px-6 py-2 rounded-bl-[24px] text-[10px] font-black uppercase tracking-widest text-white" style={{ backgroundColor: themeColor }}>
        {badgeText}
      </div>

      <div className="flex justify-between items-start mb-6 pr-20">
        <div>
          <h3 className="text-2xl font-black tracking-tighter mb-2" style={{ color: themeColor }}>{name}</h3>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{policyCategory}</p>
        </div>
      </div>

      <p className="text-gray-600 text-sm font-bold leading-relaxed mb-6">
        {description}
      </p>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-[20px]">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
            {isScheme ? 'Eligibility' : 'Ideal For'}
          </h4>
          <p className="text-xs font-bold text-gray-700">{eligibility}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-[20px]">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
            {isScheme ? 'Benefits' : 'Coverage'}
          </h4>
          <p className="text-xs font-bold text-gray-700">{benefits}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <button
          onClick={() => setShowVideo(true)}
          className="flex items-center gap-2 px-6 py-3 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 transition-transform active:scale-95"
          style={{ backgroundColor: themeColor }}
        >
          🎥 {userLanguage === 'te' ? 'వీడియో చూడండి' : 'Watch Video'}
        </button>

        <a
          href={policy.official_source || '#'}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-6 py-3 border-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all ml-auto"
          style={{ borderColor: themeColor, color: themeColor }}
        >
          {ctaText} 📝
        </a>
      </div>

      {showVideo && <VideoPlayer src={policy.video} label={name} onClose={() => setShowVideo(false)} />}
    </div>
  );
}

export default PolicyCard;
