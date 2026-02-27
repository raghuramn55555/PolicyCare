import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

/**
 * PopularSection Component
 * Displays popular schemes and policies on dashboard load
 * NO user profile required - general audience content
 */
function PopularSection({ language = 'en', onPolicyClick }) {
    const [schemes, setSchemes] = useState([]);
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/popular?language=${language}`);
                if (res.data.success) {
                    setSchemes(res.data.schemes || []);
                    setPolicies(res.data.policies || []);
                }
            } catch (error) {
                console.error('Failed to fetch popular items:', error);
                // Fallback: empty arrays (UI handles gracefully)
            } finally {
                setLoading(false);
            }
        };
        fetchPopular();
    }, [language]);

    // Card Component for horizontal scroll
    const PopularCard = ({ item, color }) => {
        const name = typeof item.name === 'object' ? (item.name[language] || item.name['en']) : item.name;
        const description = typeof item.description === 'object'
            ? (item.description[language] || item.description['en'])
            : item.description;

        return (
            <motion.div
                className="flex-shrink-0 w-72 bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                whileHover={{ y: -5 }}
                onClick={() => onPolicyClick?.(item)}
            >
                <div className={`h-2 ${color === 'green' ? 'bg-green-500' : 'bg-blue-500'}`} />
                <div className="p-5">
                    <h4 className="font-bold text-gray-800 text-sm mb-2 line-clamp-2">{name}</h4>
                    <p className="text-gray-500 text-xs line-clamp-3">{description?.slice(0, 100)}...</p>
                    <div className="mt-4 flex items-center justify-between">
                        <span className={`text-xs font-bold uppercase tracking-wider ${color === 'green' ? 'text-green-600' : 'text-blue-600'}`}>
                            {item.category || (color === 'green' ? 'Scheme' : 'Policy')}
                        </span>
                        <span className="text-gray-400 text-xs">→</span>
                    </div>
                </div>
            </motion.div>
        );
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="h-48 bg-gray-100 rounded-3xl animate-pulse" />
                <div className="h-48 bg-gray-100 rounded-3xl animate-pulse" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Popular Government Schemes */}
            {schemes.length > 0 && (
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-2xl">🟢</span>
                        <h2 className="text-xl font-black text-gray-800 tracking-tight">
                            Popular Government Schemes
                        </h2>
                    </div>
                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                        {schemes.map((item) => (
                            <PopularCard key={item.id} item={item} color="green" />
                        ))}
                    </div>
                </section>
            )}

            {/* Popular Insurance Policies */}
            {policies.length > 0 && (
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-2xl">🔵</span>
                        <h2 className="text-xl font-black text-gray-800 tracking-tight">
                            Popular Insurance Policies
                        </h2>
                    </div>
                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                        {policies.map((item) => (
                            <PopularCard key={item.id} item={item} color="blue" />
                        ))}
                    </div>
                </section>
            )}

            {/* Fallback if both empty */}
            {schemes.length === 0 && policies.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    <p className="text-lg font-bold">Explore policies and schemes above!</p>
                </div>
            )}
        </div>
    );
}

export default PopularSection;
