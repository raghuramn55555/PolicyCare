import React, { useState } from 'react';
import axios from 'axios';

function InsurancePage() {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResponse('');
        try {
            const res = await axios.post('http://localhost:5000/api/insurance/query', { message: query });
            setResponse(res.data.reply);
        } catch (error) {
            setResponse('Error: Could not retrieve information.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-green-900">Insurance Advisory System</h1>

            <form onSubmit={handleSubmit} className="mb-8">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask about health cover, term plans, policies..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Searching...' : 'Submit'}
                    </button>
                </div>
            </form>

            {response && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Response</h2>
                    <p className="text-gray-600 whitespace-pre-wrap">{response}</p>
                </div>
            )}
        </div>
    );
}

export default InsurancePage;
