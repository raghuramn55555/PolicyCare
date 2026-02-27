import { motion } from 'framer-motion';

function Header({ user, onLogout }) {
  return (
    <motion.header
      className="bg-gradient-to-r from-india-blue via-blue-700 to-india-blue text-white shadow-lg sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <motion.h1
              className="text-2xl md:text-3xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              PolicySetu
            </motion.h1>
            <p className="text-xs text-blue-100 hidden md:block">
              Gateway to Policies & Financial Security
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex gap-2">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-[10px] font-semibold uppercase tracking-wider">
                Smart Advisor
              </span>
              <span className="px-3 py-1 bg-india-green/20 backdrop-blur-sm rounded-full text-[10px] font-semibold uppercase tracking-wider">
                🇮🇳 Digital India
              </span>
            </div>

            {user && (
              <div className="flex items-center gap-3 pl-4 border-l border-white/20">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold truncate max-w-[150px]">{user.identifier}</p>
                  <button
                    onClick={onLogout}
                    className="text-[10px] text-blue-200 hover:text-white uppercase font-bold tracking-tighter"
                  >
                    Logout
                  </button>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-xl border-2 border-white/30">
                  👤
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;
