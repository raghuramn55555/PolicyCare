import React, { useState } from 'react';
import axios from 'axios';

function PolicePage() {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResponse('');
        try {
            const res = await axios.post('http://localhost:5000/api/police/query', { message: query });
            setResponse(res.data.reply);
        } catch (error) {
            setResponse('Error: Could not retrieve information.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-blue-900">Police Information System</h1>

            <form onSubmit={handleSubmit} className="mb-8">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask about filing an FIR, traffic rules, etc..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
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

export default PolicePage;
