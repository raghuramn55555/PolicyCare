import { useState } from 'react';
import { motion } from 'framer-motion';

const OCCUPATIONS = [
  { value: 'student', label: 'Student' },
  { value: 'farmer', label: 'Farmer' },
  { value: 'worker', label: 'Worker' },
  { value: 'business', label: 'Business' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'retired', label: 'Retired' },
];

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'te', label: 'Telugu' },
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli',
  'Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

function UserProfileForm({ onSubmit, loading, initialProfile }) {
  const [formData, setFormData] = useState({
    age: initialProfile?.age || '',
    gender: initialProfile?.gender || '',
    occupation: initialProfile?.occupation || '',
    monthlySalary: '',
    annualIncome: initialProfile?.income || initialProfile?.annualIncome || '',
    state: '',
    city: '',
    language: initialProfile?.language || 'en',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const profile = {
      ...formData,
      age: parseInt(formData.age),
      monthlySalary: parseFloat(formData.monthlySalary) || 0,
      annualIncome: parseFloat(formData.annualIncome) || 0,
    };
    onSubmit(profile);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Profile</h2>
      <p className="text-gray-600 text-sm mb-6">
        Enter your details to discover personalized policies
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-1">
            Age *
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="18"
            max="100"
            required
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-india-blue focus:outline-none transition"
            placeholder="Enter your age"
          />
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-1">
            Gender *
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-india-blue focus:outline-none transition"
          >
            <option value="">Select Gender</option>
            {GENDERS.map(g => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="occupation" className="block text-sm font-semibold text-gray-700 mb-1">
            Occupation *
          </label>
          <select
            id="occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-india-blue focus:outline-none transition"
          >
            <option value="">Select Occupation</option>
            {OCCUPATIONS.map(occ => (
              <option key={occ.value} value={occ.value}>{occ.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="monthlySalary" className="block text-sm font-semibold text-gray-700 mb-1">
            Monthly Salary (₹)
          </label>
          <input
            type="number"
            id="monthlySalary"
            name="monthlySalary"
            value={formData.monthlySalary}
            onChange={handleChange}
            min="0"
            step="1000"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-india-blue focus:outline-none transition"
            placeholder="e.g., 50000"
          />
        </div>

        <div>
          <label htmlFor="annualIncome" className="block text-sm font-semibold text-gray-700 mb-1">
            Annual Income (₹) *
          </label>
          <input
            type="number"
            id="annualIncome"
            name="annualIncome"
            value={formData.annualIncome}
            onChange={handleChange}
            min="0"
            step="10000"
            required
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-india-blue focus:outline-none transition"
            placeholder="e.g., 600000"
          />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-1">
            State *
          </label>
          <select
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-india-blue focus:outline-none transition"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-1">
            City / Nearby Location *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-india-blue focus:outline-none transition"
            placeholder="e.g., Hyderabad"
          />
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-1">
            Preferred Language *
          </label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-india-blue focus:outline-none transition"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
        </div>

        <motion.button
          type="submit"
          className="w-full bg-india-blue hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Finding My Policies...
            </span>
          ) : (
            'Find My Policies'
          )}
        </motion.button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-india-blue">
        <p className="text-sm text-gray-700">
          <strong className="text-india-blue">💡 AI-Powered Discovery</strong><br />
          Our Agentic RAG system analyzes your profile to match you with the most suitable government and private policies.
        </p>
      </div>
    </motion.div>
  );
}

export default UserProfileForm;
