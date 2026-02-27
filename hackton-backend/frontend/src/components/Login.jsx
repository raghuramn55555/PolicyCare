import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Configure base URL for axios
const api = axios.create({
    baseURL: 'http://localhost:5000/api/auth'
});

function Login({ onLoginSuccess }) {
    const [mode, setMode] = useState('login'); // 'login' or 'signup'
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Extended Profile State
    const [age, setAge] = useState('');
    const [income, setIncome] = useState('');
    const [pincode, setPincode] = useState('');
    const [occupation, setOccupation] = useState('');
    const [gender, setGender] = useState('');
    const [familyStatus, setFamilyStatus] = useState('single');
    const [language, setLanguage] = useState('en');

    const toggleMode = () => {
        setMode(mode === 'login' ? 'signup' : 'login');
        setError('');
        setMessage('');
        // Reset form
        setPassword('');
        setConfirmPassword('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        // Basic validation
        if (!identifier || !password) {
            setError('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        if (mode === 'signup' && password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            if (mode === 'signup') {
                const payload = {
                    identifier,
                    password,
                    profile: {
                        age: parseInt(age) || 0,
                        income: parseInt(income) || 0,
                        pincode,
                        occupation,
                        gender,
                        familyStatus,
                        language
                    }
                };

                const res = await api.post('/signup', payload);
                if (res.data.success) {
                    setMessage('Account created! Logging you in...');
                    // Auto-login after signup
                    onLoginSuccess({
                        identifier,
                        ...payload.profile,
                        isNewUser: true
                    });
                }
            } else {
                const res = await api.post('/login', { identifier, password });
                if (res.data.success) {
                    onLoginSuccess(res.data.user);
                }
            }
        } catch (err) {
            console.error('Auth Error:', err);
            const msg = err.response?.data?.error || 'Authentication failed. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <motion.div
                className="bg-white p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-md border border-gray-50"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center mb-10">
                    <div className="text-6xl mb-6">🏛️</div>
                    <h1 className="text-4xl font-black text-india-blue tracking-tighter">PolicySetu</h1>
                    <p className="text-gray-400 font-bold mt-2 uppercase text-[10px] tracking-widest">
                        {mode === 'login' ? 'Welcome Back' : 'Create New Account'}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border-2 border-red-100"
                        >
                            ⚠️ {error}
                        </motion.div>
                    )}
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mb-6 p-4 bg-green-50 text-green-600 rounded-2xl text-xs font-bold border-2 border-green-100"
                        >
                            ✅ {message}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-4">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="name@domain.com"
                                className="w-full px-6 py-3 bg-gray-50 border-2 border-transparent rounded-[20px] focus:border-india-blue focus:bg-white focus:outline-none transition-all font-bold text-gray-700 text-sm shadow-inner"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-4">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full px-6 py-3 bg-gray-50 border-2 border-transparent rounded-[20px] focus:border-india-blue focus:bg-white focus:outline-none transition-all font-bold text-gray-700 text-sm shadow-inner"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {mode === 'signup' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-4 pt-2"
                            >
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-4">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full px-6 py-3 bg-gray-50 border-2 border-transparent rounded-[20px] focus:border-india-blue focus:bg-white focus:outline-none transition-all font-bold text-gray-700 text-sm shadow-inner"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-4">
                                            Age
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            placeholder="25"
                                            className="w-full px-6 py-3 bg-gray-50 border-2 border-transparent rounded-[20px] focus:border-india-blue focus:bg-white focus:outline-none transition-all font-bold text-gray-700 text-sm shadow-inner"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-4">
                                            Pincode
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="500001"
                                            className="w-full px-6 py-3 bg-gray-50 border-2 border-transparent rounded-[20px] focus:border-india-blue focus:bg-white focus:outline-none transition-all font-bold text-gray-700 text-sm shadow-inner"
                                            value={pincode}
                                            onChange={(e) => setPincode(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-4">
                                        Annual Income (₹)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="500000"
                                        className="w-full px-6 py-3 bg-gray-50 border-2 border-transparent rounded-[20px] focus:border-india-blue focus:bg-white focus:outline-none transition-all font-bold text-gray-700 text-sm shadow-inner"
                                        value={income}
                                        onChange={(e) => setIncome(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-4">
                                            Family
                                        </label>
                                        <select
                                            className="w-full px-6 py-3 bg-gray-50 border-2 border-transparent rounded-[20px] focus:border-india-blue focus:bg-white focus:outline-none transition-all font-bold text-gray-700 text-sm shadow-inner"
                                            value={familyStatus}
                                            onChange={(e) => setFamilyStatus(e.target.value)}
                                        >
                                            <option value="single">Single</option>
                                            <option value="married">Married</option>
                                            <option value="married_kids">Married + Kids</option>
                                            <option value="senior">Senior Citizen</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-4">
                                            Language
                                        </label>
                                        <select
                                            className="w-full px-6 py-3 bg-gray-50 border-2 border-transparent rounded-[20px] focus:border-india-blue focus:bg-white focus:outline-none transition-all font-bold text-gray-700 text-sm shadow-inner"
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                        >
                                            <option value="en">English</option>
                                            <option value="te">Telugu (తెలుగు)</option>
                                            <option value="hi">Hindi (हिन्दी)</option>
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-4">
                                    Occupation
                                </label>
                                <select
                                    className="w-full px-6 py-3 bg-gray-50 border-2 border-transparent rounded-[20px] focus:border-india-blue focus:bg-white focus:outline-none transition-all font-bold text-gray-700 text-sm shadow-inner"
                                    value={occupation}
                                    onChange={(e) => setOccupation(e.target.value)}
                                >
                                    <option value="">Select</option>
                                    <option value="student">Student</option>
                                    <option value="farmer">Farmer</option>
                                    <option value="salaried">Salaried</option>
                                    <option value="business">Business</option>
                                    <option value="unemployed">Unemployed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-4">
                                    Gender
                                </label>
                                <select
                                    className="w-full px-6 py-3 bg-gray-50 border-2 border-transparent rounded-[20px] focus:border-india-blue focus:bg-white focus:outline-none transition-all font-bold text-gray-700 text-sm shadow-inner"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        style={{ backgroundColor: '#0F4C75' }}
                        className="w-full text-white font-black py-4 rounded-[20px] shadow-xl shadow-blue-100 hover:bg-blue-800 disabled:opacity-50 transition-all active:scale-95 uppercase tracking-widest text-xs mt-4"
                    >
                        {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={toggleMode}
                        style={{ color: '#0F4C75' }}
                        className="text-xs font-bold hover:underline uppercase tracking-widest"
                    >
                        {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                    </button>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-50 text-center">
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                        Your data is stored securely in PolicySetu Store
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

export default Login;
