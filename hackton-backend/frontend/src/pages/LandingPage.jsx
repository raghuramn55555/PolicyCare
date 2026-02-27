import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-indigo-50">
      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-40 bg-white/80 backdrop-blur border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xl">
              🏛️
            </div>
            <div>
              <p className="text-lg font-bold text-indigo-900">PolicySetu</p>
              <p className="text-[11px] uppercase tracking-widest text-indigo-400 font-semibold">
                Policies • Schemes • Advisors
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <div className="hidden md:flex gap-4 text-xs font-semibold text-indigo-600">
              <a href="#features" className="hover:text-indigo-900">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-indigo-900">
                How It Works
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs font-bold text-indigo-700 hover:text-indigo-900"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-xs font-bold px-4 py-2 rounded-full bg-indigo-600 text-white shadow hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pt-24">
        {/* Hero */}
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-500 mb-3">
                Agentic RAG Powered Policy Advisor
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-4">
                Discover the right policy,
                <span className="text-indigo-600"> in your language.</span>
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mb-6 max-w-xl">
                PolicySetu combines government schemes, insurance products, and local
                advisors into one intelligent dashboard. Ask in plain language, get
                personalized, explainable recommendations.
              </p>

              <div className="flex flex-wrap gap-3 items-center mb-6">
                <Link
                  to="/signup"
                  className="px-6 py-3 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest shadow hover:bg-indigo-700"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="px-5 py-3 rounded-full border border-indigo-200 text-xs font-bold uppercase tracking-widest text-indigo-700 bg-white hover:border-indigo-400"
                >
                  Login to Dashboard
                </Link>
                <p className="text-[11px] text-slate-500">
                  No changes to your existing data or flows.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="bg-white/80 rounded-2xl p-4 border border-slate-100">
                  <p className="font-bold text-slate-900 mb-1">Unified Policy View</p>
                  <p>
                    See government schemes, insurance plans, and nearby agents in one
                    real-time feed.
                  </p>
                </div>
                <div className="bg-white/80 rounded-2xl p-4 border border-slate-100">
                  <p className="font-bold text-slate-900 mb-1">Chat-first Experience</p>
                  <p>
                    Ask conversationally in English, Hindi, or Telugu – the system
                    understands and explains.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-tr from-indigo-200 via-blue-100 to-transparent rounded-[40px] blur-2xl opacity-60" />
              <div className="relative bg-white rounded-[32px] shadow-xl border border-slate-100 p-5 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em]">
                    Live Dashboard Preview
                  </p>
                  <span className="px-2 py-1 text-[10px] rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                    Backward Compatible
                  </span>
                </div>
                <div className="h-40 rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 flex items-center justify-center text-center px-6 text-white text-sm font-semibold">
                  <p>
                    Your existing recommendation engine and chatbot stay exactly the
                    same.
                    <br />
                    We only modernize the entry flow.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-[11px]">
                  <div className="bg-slate-50 rounded-2xl p-3">
                    <p className="font-bold text-slate-800 mb-1">1. Land</p>
                    <p className="text-slate-500">Users arrive on a public overview page.</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-3">
                    <p className="font-bold text-slate-800 mb-1">2. Authenticate</p>
                    <p className="text-slate-500">Login/Sign up using existing APIs.</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-3">
                    <p className="font-bold text-slate-800 mb-1">3. Explore</p>
                    <p className="text-slate-500">Enter the protected PolicySetu dashboard.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="px-4 sm:px-6 lg:px-8 py-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">
              Features built for stable systems
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-sm text-slate-600">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-[0.2em] mb-2">
                  Backward Compatible
                </p>
                <p className="font-semibold text-slate-900 mb-1">
                  Non-breaking SaaS-style upgrade
                </p>
                <p>
                  Existing RAG pipelines, recommendation flows, and auth APIs remain
                  untouched. Only the UI routing evolves.
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-[0.2em] mb-2">
                  Agentic RAG
                </p>
                <p className="font-semibold text-slate-900 mb-1">
                  Multi-agent policy intelligence
                </p>
                <p>
                  Retrieval, reasoning, and domain agents work behind the scenes while
                  the UI gives users a clean SaaS-like entry point.
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-[0.2em] mb-2">
                  Production Mindset
                </p>
                <p className="font-semibold text-slate-900 mb-1">
                  Stable, shippable architecture
                </p>
                <p>
                  Versioned flows, protected routes, and clear separation of public vs
                  authenticated surfaces – the way real SaaS products ship.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-r from-indigo-50 via-slate-50 to-blue-50"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">
              How PolicySetu works
            </h2>
            <div className="grid md:grid-cols-4 gap-6 text-sm text-slate-600">
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-[0.2em] mb-2">
                  01 • Profile
                </p>
                <p>
                  User signs in or signs up and shares basic profile details like age,
                  income, location, and language.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-[0.2em] mb-2">
                  02 • Retrieval
                </p>
                <p>
                  Your existing RAG stack retrieves candidate schemes and policies from
                  configured vector stores.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-[0.2em] mb-2">
                  03 • Reasoning
                </p>
                <p>
                  Agentic orchestration evaluates eligibility, relevance, and trade-offs
                  – with zero changes in this refactor.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-[0.2em] mb-2">
                  04 • Explain
                </p>
                <p>
                  The dashboard and chatbot surface explainable recommendations users can
                  trust and act on.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="font-semibold">
            PolicySetu • Stable-by-default policy intelligence
          </p>
          <p className="text-slate-400">
            Backward compatibility first. RAG, agents, and APIs remain untouched.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

